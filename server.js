import path from 'path';
import React from 'react';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config';
import { renderToString } from 'react-dom/server';
import App from './src/components/App';
import { Provider } from 'react-redux';
import { apiRequest } from './src/action/action';
import { reqGenres } from './src/action/server';
import configStore from './src/store/configStore';

const app = express();
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));
app.use(express.static(__dirname + '/static'));
app.use((req, res)=> {

  const store = configStore();

  function renderView() {

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
            <title>Redux Universal Example</title>
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
  store.dispatch(reqGenres())
  .then(()=> store.dispatch(apiRequest('movie/popular?')))
  .then(renderView)
  .then((html)=> res.end(html));
});

export default app;
