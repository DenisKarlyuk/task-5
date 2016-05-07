import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configStore from './store/configStore';
import App from './components/App';
import './styles/app.css';
import './styles/normalize.css';
import UUID from 'uuid-js';

const store = configStore(window.__INITIAL_STATE__);
let cookieClient = (/\bclientId=/).test(document.cookie);
if(!cookieClient) {
  document.cookie = `clientId=${UUID.create().toString()};path=/;expires=Thu, 01 Jan 9999 00:00:00 GMT`;
}
const ID = document.cookie.replace(/\bclientId=([\d\w -]+).+/, '$1');

render(
  <Provider store={store}>
    <div className="react">
      <App clientId={ID}/>
    </div>
  </Provider>,
  document.getElementById('root')
);
