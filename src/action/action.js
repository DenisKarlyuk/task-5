import fetch from 'isomorphic-fetch';

function reqStart() {
  return {
    type: 'LOADING_LIST'
  };
}

function getList(list, url, page, pages) {
  return {
    type: 'LOADED_LIST',
    list,
    url,
    page,
    pages
  };
}

function reqError(text) {
  return {
    type: 'LOADING_ERROR',
    text
  };
}

export function apiRequest(url) {
  return (dispatch)=> {
    dispatch(reqStart());
    return fetch(`http://api.themoviedb.org/3/${url}api_key=e0aa8ef5230330454d715945a0db3d27`)
      .then((resp) => resp.json())
      .then((json) => dispatch(getList((json.results||json.cast||json),
                      url, (json.page), (json.total_pages>1000 ? 1000 : json.total_pages))))
      .catch((text)=> dispatch(reqError(text)));
  };
}

function comment(comment) {
  return {
    type: 'LOADED_COMMENT',
    comment
  };
}

function rank(rank) {
  return {
    type: 'LOADED_RANK',
    rank
  };
}

export function apiDb(id) {
  return (dispatch)=> {
    return fetch(`https://api.mlab.com/api/1/databases/movie/collections/${id}apiKey=N45LFP8U-avNxijAJ5SIwOx_LOQPhxhT`)
      .then((resp) => resp.json())
      .then((json) => dispatch(id.slice(0, 1)==='c' ? comment(json) : rank(json)))
      .catch((text)=> dispatch(reqError(text)));
  };
}

function postComment(comment) {
  return {
    type: 'POST_COMMENT',
    comment
  };
}

export function postDb(url, body) {
  return (dispatch)=> {
    return fetch(`https://api.mlab.com/api/1/databases/movie/collections/${url}?apiKey=N45LFP8U-avNxijAJ5SIwOx_LOQPhxhT`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)})
      .then(()=> url==='comment'
          ? dispatch(postComment(body))
          : dispatch(apiDb(`rank?q={"id": ${body.id}}&`)))
      .catch((text)=> dispatch(reqError(text)));
  };
}

export function updateRankDb(url, body, id) {
  return (dispatch)=> {
    return fetch(`https://api.mlab.com/api/1/databases/movie/collections/rank?${url}&apiKey=N45LFP8U-avNxijAJ5SIwOx_LOQPhxhT`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'$set': body})})
      .then(()=> dispatch(apiDb(`rank?q={"id": ${id}}&`)))
      .catch((text)=> dispatch(reqError(text)));
  };
}
