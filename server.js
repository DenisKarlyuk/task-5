import path from 'path';
import React from 'react';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import props from './config/conf';
import config from './webpack.config';
import { renderToString } from 'react-dom/server';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { Provider } from 'react-redux';
import configStore from './src/store/configStore';
import fetch from 'isomorphic-fetch';
import { apiRequest, apiDb } from './src/action/action';
import { reqGenres } from './src/action/server';
import { requestDb } from './src/util/reqParse';
import App from './src/components/App';

const app = express();
const compiler = webpack(config);
const MLAB_DB_URL = props['mlab.db.url'];
const MLAB_DB_KEY = `apiKey=${props['mlab.db.key']}`;
const MOVIEDB_URL = props['moviedb.url'];
const MOVIEDB_KEY = `api_key=${props['moviedb.key']}`;

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/static'));

app.put('/api/db/rank', (req, res)=> {
  let url = `${MLAB_DB_URL}/rank?${MLAB_DB_KEY}`;
  let options = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    };
  postPutApi(url, options, res, req);
});

app.post('/api/db/:collection', (req, res)=> {
  let url = `${MLAB_DB_URL}/${req.params.collection}?${MLAB_DB_KEY}`;
  let options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  };
  postPutApi(url, options, res, req);
});

app.get('/api/db/:collection', (req, res)=> {
  let url = `${MLAB_DB_URL}/${req.params.collection}?${MLAB_DB_KEY}`;
  getApi(url, res, req);
});

app.get('/api/person/:id/combined_credits', (req, res)=> {
  let url = `${MOVIEDB_URL}/person/${req.params.id}/combined_credits?${MOVIEDB_KEY}`;
  getApi(url, res, req);
});

app.get('/api/search/:id', (req, res)=> {
  let url = `${MOVIEDB_URL}/search/${req.params.id}?${MOVIEDB_KEY}`;
  getApi(url, res, req);
});

app.get('/api/genre/:id/movies', (req, res)=> {
  let url = `${MOVIEDB_URL}/genre/${req.params.id}/movies?${MOVIEDB_KEY}`;
  getApi(url, res, req);
});

app.get('/api/:type/:id', (req, res)=> {
  let url = `${MOVIEDB_URL}/${req.params.type}/${req.params.id}?${MOVIEDB_KEY}`;
  getApi(url, res, req);
});

app.get('/api/*', (req, res)=> {
  res.send({});
});

function getApi(url, res, req) {
  if(req.query.page) url += `&page=${req.query.page}`;
  if(req.query.append_to_response) url += `&append_to_response=${req.query.append_to_response}`;
  if(req.query.query) url += `&query=${req.query.query}`;
  if(req.query.q) url += `&q=${req.query.q}`;
  fetch(url)
    .then((response)=> response.json())
    .then((json)=> res.send(json))
    .catch((text)=> res.send(text));
}

function postPutApi(url, options, res, req) {
  if(req.query.q) url += `&q=${req.query.q}`;
  fetch(url, options)
    .then(()=> res.send());
}

app.get('/*', (req, res)=> {
  let url = req.originalUrl.slice(1);
  if(!url.length) url = 'movie/top_rated';
  console.log('!!!!!!!!!!!!!!!!!!!!'+url);
  const store = configStore({
    clientId: req.cookies.clientId
  });
  console.log(url);
  const idMovie = requestDb(url);
  function renderView(req, res, next) {

    const initialView = renderToString(
      <Provider store={ store }>
        <App />
      </Provider>
    );

    const initialState = store.getState();
    const html = `
      <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>MovieDb</title>
            <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">
          </head>
          <body>
            <div id="root">${initialView}</div>
              <script>
                window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
              </script>
              <script src="/static/bundle.js"></script>
          </body>
        </html>`
      return html;
    }

  store.dispatch(reqGenres()) & store.dispatch(apiRequest(url))
    .then(()=> idMovie ? store.dispatch(apiDb(`comment?q={"id": "${idMovie}"}&`))
                       : '')
    .then(()=> idMovie ? store.dispatch(apiDb(`rank?q={"id": ${idMovie}}&`))
                       : '')
    .then(renderView)
    .then((html)=> res.end(html))
    .catch((error)=> res.status(404).send('404'));
});

export default app;
