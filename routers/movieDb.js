import express from 'express';
import props from '../config/conf';
import key from '../config/keys.conf';

const router = express.Router();
const MOVIEDB_URL = props['moviedb.url'];
const MOVIEDB_KEY = `api_key=${key['moviedb.key']}`;

const NOT_FOUND = {
  "status_code": 404,
  "status_message": "The resource you requested could not be found."
};
const SERVER_ERROR = {
  "status_code": 500,
  "status_message": "Internal Server Error."
};

router.get('/person/:id/combined_credits', (req, res)=> {
  let path = `/person/${req.params.id}/combined_credits?`;
  getApi(path, res, req);
});

router.get('/search/:id', (req, res)=> {
  let path = `/search/${req.params.id}?`;
  getApi(path, res, req);
});

router.get('/genre/:id/movies', (req, res)=> {
  let path = `/genre/${req.params.id}/movies?`;
  getApi(path, res, req);
});

router.get('/movie/:id', (req, res)=> {
  let path = `/movie/${req.params.id}?`;
  getApi(path, res, req);
  });

router.use((req, res)=> {
  res.status(NOT_FOUND.status_code).send(NOT_FOUND)
});

function getApi(path, res, req) {
  let url = MOVIEDB_URL+path+MOVIEDB_KEY;

  if(req.query.page) url += `&page=${req.query.page}`;
  if(req.query.append_to_response) url += `&append_to_response=${req.query.append_to_response}`;
  if(req.query.query) url += `&query=${req.query.query}`;

  console.log(
    `--start_GET_API_MOVIE--
    Method: ${req.method} Url: ${url}\n--end_GET_API_MOVIE--\n`
  );

  fetch(url)
    .then((response)=> response.json())
    .then((json)=> {

      if(json.status_code===34) {
        return res.status(NOT_FOUND.status_code).send(NOT_FOUND)
      }

      if(json.status_code===7) {
        return res.status(SERVER_ERROR.status_message).send(SERVER_ERROR)
      }

      return res.send(json)
    })
    .catch((text)=> res.status(SERVER_ERROR.status_message).send(SERVER_ERROR));
}

 export default router;
