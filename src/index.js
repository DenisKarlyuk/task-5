import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import configStore from './store/configStore';
import './styles/app.css'
import './styles/normalize.css'

const store = configStore(window.__INITIAL_STATE__);

render(
  <Provider store={ store }>
    <div className="react">
      <App />
    </div>
  </Provider>,
  document.getElementById('root')
);
