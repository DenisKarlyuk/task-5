import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import configStore from '../src/store/configureStore.prod';
import { apiRequest, apiDb } from '../src/action/action';
import { reqGenres } from '../src/action/server';
import App from '../src/components/App';

const app = express();

app.use((req, res)=> {

  let url = req.originalUrl.slice(1);

  if(!url.length) {
    url = 'movie/top_rated';
  }

  let allDispatch = [reqGenres(), apiRequest(url)];
  let idMovie = url.match(/\d+/);

  const store = configStore({
    clientId: req.cookies.clientId
  });

  if(idMovie!==null) {

    let dbDispatch = [
      apiDb('comment', idMovie),
      apiDb('rank', idMovie)
    ];

    allDispatch = allDispatch.concat(dbDispatch);
  }

  Promise.all(allDispatch.map(store.dispatch))
    .then(renderView)
    .then((html)=> res.end(html))
    .catch((error)=> res.status(500).send('500 Internal Server Error'));

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
            <link rel="stylesheet" href="/styles/app.css">
            <link rel="stylesheet" href="/styles/normalize.css">
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
});

export default app;
