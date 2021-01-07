import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'
import './data-bus'
import './index.scss'
import { store } from './store'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  window.document.querySelector('#app-container')
)