import fetch from 'isomorphic-fetch';

function getGenres(genres) {
  return {
    type: 'LOADED_GENRES',
    genres
  };
}

export function reqGenres() {
  return dispatch => {
    return fetch(`http://api.themoviedb.org/3/genre/movie/list?api_key=e0aa8ef5230330454d715945a0db3d27`)
    .then((resp) => resp.json())
    .then((json) => dispatch(getGenres(json.genres)));
  };
}
