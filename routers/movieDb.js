import express from 'express';
import props from '../config/conf';
import key from '../config/keys.conf';

const router = express.Router();
const MOVIEDB_URL = props['moviedb.url'];
const MOVIEDB_KEY = `api_key=${key['moviedb.key']}`;

router.get('/person/:id/combined_credits', (req, res)=> {
  let url = `/person/${req.params.id}/combined_credits?`;
  new getApi(url, res, req);
});

router.get('/search/:id', (req, res)=> {
  let url = `/search/${req.params.id}?`;
  new getApi(url, res, req);
});

router.get('/genre/:id/movies', (req, res)=> {
  let url = `/genre/${req.params.id}/movies?`;
  new getApi(url, res, req);
});

router.get('/movie/:id', (req, res)=> {
  let url = `/movie/${req.params.id}?`;
  new getApi(url, res, req);
  });

router.use((req,res)=> {
  res.status(404).send(text);
});

  function getApi(url, res, req) {
    this.url = MOVIEDB_URL+url+MOVIEDB_KEY;
    if(req.query.page) this.url += `&page=${req.query.page}`;
    if(req.query.append_to_response) this.url += `&append_to_response=${req.query.append_to_response}`;
    if(req.query.query) this.url += `&query=${req.query.query}`;
    fetch(this.url)
      .then((response)=> response.json())
      .then((json)=> res.send(json))
      .catch((text)=> res.status(404).send(text));
  }
 export default router;
