import props from '../../config/conf';

export function cookie(clientId) {
  return {
    type: 'SET_COOKIE',
    clientId
  };
}

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

function reqError(error) {
  return {
    type: 'LOADING_ERROR',
    error
  };
}

export function apiRequest(url) {
  return (dispatch)=> {
    dispatch(reqStart());
    return fetch(`${props['express.api.url']}/moviedb/${url}`)
      .then((resp) => resp.json())
      .then((json) => {
        if(!json.total_pages) {
          json.total_pages = 0;
        }

        dispatch(getList((json.results||json.cast||json), url,
          (json.page||0), (json.total_pages>1000 ? 1000 : json.total_pages)))
        })
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
    return fetch(`${props['express.api.url']}/mlabdb/${id}`)
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

export function postDb(collection, id, clientId, value) {
  const body = {
    id: id,
    clientId: clientId,
    value: value,
    data: new Date().toUTCString()
  };

  return (dispatch)=> {
    return fetch(`${props['express.api.url']}/mlabdb/${collection}?`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(()=>
        collection==='comment' ? dispatch(postComment(body))
                               : dispatch(apiDb(`rank?q={"id": ${body.id}}&`)))
      .catch((text)=> dispatch(reqError(text)));
  };
}

export function updateRankDb(idDB, rank, id) {
  let body = {'value': rank};
  let query = `q={"_id":{"$oid": "${idDB}"}}`;

  return (dispatch)=> {
    return fetch(`${props['express.api.url']}/mlabdb/rank?${query}&`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'$set': body})
    })
      .then(()=> dispatch(apiDb(`rank?q={"id": ${id}}&`)))
      .catch((text)=> dispatch(reqError(text)));
  };
}
