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
import { apiRequest, apiDb } from './src/action/action';
import { reqGenres } from './src/action/server';
import { requestDb } from './src/util/reqParse';
import App from './src/components/App';
import movieDb from './routers/movieDb'
import mlabDb from './routers/mlabDb'

const app = express();
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/static'));
app.use('/api/moviedb', movieDb);
app.use('/api/mlabdb', mlabDb);

app.get('/*', (req, res)=> {
  let url = req.originalUrl.slice(1);
  if(!url.length) url = 'movie/top_rated';
  const store = configStore({
    clientId: req.cookies.clientId
  });
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

  let allDispatch = [reqGenres(), apiRequest(url)];

  if(idMovie) {
    let dbDispatch = [apiDb(`comment?q={"id": "${idMovie}"}&`),
                      apiDb(`rank?q={"id": ${idMovie}}&`)];
    allDispatch = allDispatch.concat(dbDispatch);
  }

  console.log(allDispatch[3]);

  Promise.all(allDispatch.map(store.dispatch))
    .then(renderView)
    .then((html)=> res.end(html))
    .catch((error)=> res.status(404).send('404'));
});

export default app;
