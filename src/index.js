import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configStore from './store/configStore';
import App from './components/App';
import { cookie } from './action/action';
import UUID from 'uuid-js';

const store = configStore(window.__INITIAL_STATE__);

if(!store.getState().clientId){
  document.cookie = `clientId=${UUID.create().toString()};path=/;expires=Thu, 01 Jan 9999 00:00:00 GMT`;
  
  const ID = document.cookie.replace(/\bclientId=([\d\w -]+).+/, '$1');

  store.dispatch(cookie(ID))
}

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
