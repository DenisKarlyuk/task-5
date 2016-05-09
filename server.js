import path from 'path';
import React from 'react';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
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
const API_DB = 'apiKey=N45LFP8U-avNxijAJ5SIwOx_LOQPhxhT';
const API_MOVIE = 'api_key=e0aa8ef5230330454d715945a0db3d27';

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/static'));

app.put('/api/db/rank', (req, res)=> {
  let url = `https://api.mlab.com/api/1/databases/movie/collections/rank?q=${req.query.q}&${API_DB}`;
  let options = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    };
  postPutApi(url, options, res);
});

app.post('/api/db/rank', (req, res)=> {
  let url = `https://api.mlab.com/api/1/databases/movie/collections/rank?q=${req.query.q}&${API_DB}`;
  let options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  };
  postPutApi(url, options, res);
});

app.post('/api/db/comment', (req, res)=> {
  let url = `https://api.mlab.com/api/1/databases/movie/collections/comment?q=${req.query.q}&${API_DB}`;
  let options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  };
  postPutApi(url, options, res);
});

app.get('/api/db/rank', (req, res)=> {
  let url = `https://api.mlab.com/api/1/databases/movie/collections/rank?q=${req.query.q}&${API_DB}`;
  getApi(url, res);
});

app.get('/api/db/comment', (req, res)=> {
  let url = `https://api.mlab.com/api/1/databases/movie/collections/comment?q=${req.query.q}&${API_DB}`;
  getApi(url, res);
});

app.get('/api/movie/:id', (req, res)=> {
  let url = `http://api.themoviedb.org/3/movie/${req.params.id}?${API_MOVIE}`;
  if(Number.isInteger(+req.params.id)) {
    url += `&append_to_response=${req.query.append_to_response}`;
  }
  getApi(url, res);
});

app.get('/api/person/:id', (req, res)=> {
  let url = `http://api.themoviedb.org/3/person/${req.params.id}&${API_MOVIE}`;
  getApi(url, res);
});

app.get('/api/search/:id', (req, res)=> {
  let url = `http://api.themoviedb.org/3/search/${req.params.id}?query=${req.query.query}&${API_MOVIE}`;
  getApi(url, res);
});

function getApi(url, res) {
  fetch(url)
    .then((response)=> response.json())
    .then((json)=> res.send(json))
    .catch((text)=> res.send(text));
}

function postPutApi(url, options, res) {
  fetch(url, options)
    .then(()=> res.send());
}

app.get('/*', (req, res)=> {
  let url = req.originalUrl;
  if(!url.length) url = 'movie/top_rated';
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
    .then((html)=> res.end(html));
});

export default app;
