import express from 'express';
import props from '../config/conf';
import key from '../config/keys.conf';

const router = express.Router();
const MLAB_DB_URL = props['mlab.db.url'];
const MLAB_DB_KEY = `apiKey=${key['mlab.db.key']}`;

router.use('/:collection', (req, res, next)=> {
  req.createUrl = `${MLAB_DB_URL}/${req.params.collection}?${MLAB_DB_KEY}&q=${req.query.q}`;  
  next();
});

router.route('/:collection')
  .put((req, res)=> {
    const options = {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      };
    postPutApi(options, req, res);
  })

  .post((req, res)=> {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    };
    postPutApi(options, req, res);
  })

  .get((req, res)=> {
    getApi(req, res);
  });

  function getApi(req, res) {
    fetch(req.createUrl)
      .then((response)=> response.json())
      .then((json)=> res.send(json))
      .catch((text)=> res.status(500).send(text));
  }

  function postPutApi(options, req, res) {
    fetch(req.createUrl, options)
      .then(()=> res.send())
      .catch((text)=> res.status(500).send(text));
  }

 export default router;
