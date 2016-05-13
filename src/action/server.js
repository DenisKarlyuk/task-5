import fetch from 'isomorphic-fetch';
import props from '../../config/conf';
import key from '../../config/keys.conf';

const MOVIEDB_URL = props['moviedb.url'];
const MOVIEDB_KEY = `api_key=${key['moviedb.key']}`;

function getGenres(genres) {
  return {
    type: 'LOADED_GENRES',
    genres
  };
}

export function reqGenres() {
  return dispatch => {
    return fetch(`${MOVIEDB_URL}/genre/movie/list?${MOVIEDB_KEY}`)
    .then((resp) => resp.json())
    .then((json) => dispatch(getGenres(json.genres)));
  };
}
