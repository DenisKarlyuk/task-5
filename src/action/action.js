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
  return (dispatch) => {
    dispatch(reqStart());
    return fetch(`http://api.themoviedb.org/3/${url}api_key=e0aa8ef5230330454d715945a0db3d27`)
      .then((resp) => resp.json())
      .then((json) => dispatch(getList((json.results||json.cast||json),
                      url, (json.page||0), (json.total_pages||0))))
      .catch((text)=> dispatch(reqError(text)));
  };
}
