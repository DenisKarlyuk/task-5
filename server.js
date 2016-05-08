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

app.put('/api/db/*', (req, res)=> {
  let urlPutDb = req.url.slice(8);
  let url = `https://api.mlab.com/api/1/databases/movie/collections/${urlPutDb}${API_DB}`;
  let body = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    };
  postPutApi(url, body, res);
});

app.post('/api/db/*', (req, res)=> {
  let urlPostDb = req.url.slice(8);
  let url = `https://api.mlab.com/api/1/databases/movie/collections/${urlPostDb}${API_DB}`;
  let body = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  };
  postPutApi(url, body, res);
});

app.get('/api/db/*', (req, res)=> {
  let urlDb = req.url.slice(8);
  let url = `https://api.mlab.com/api/1/databases/movie/collections/${urlDb}${API_DB}`
  getApi(url, res);
});

app.get('/api/movie/*', (req, res)=> {
  let urlMovie = req.url.slice(11);
  let url = `http://api.themoviedb.org/3/${urlMovie}${API_MOVIE}`;
  getApi(url, res);
});

function getApi(url, res) {
  fetch(url)
    .then((response)=> response.json())
    .then((json)=> res.send(json))
    .catch((text)=> res.send(text));
}

function postPutApi(url, body, res) {
  fetch(url, body)
    .then(()=> res.send());
}

app.get('/*', (req, res)=> {
  let url = req.url.slice(1)+'&';
  if(!(/\?/).test(url)) url = url.slice(0, -1)+'?';
  if(url.length===1) url = 'movie/top_rated?';
  const store = configStore({
    clientId: req.cookies.clientId
  });
  const idMovie = requestDb(url);

  function renderView(req, res, next) {

    const initialView = renderToString(
      <Provider store={ store }>
        <div className="react">
          <App />
        </div>
      </Provider>
    );

    const initialState = store.getState();
    const html = `
      <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>MovieDb</title>
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
