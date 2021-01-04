import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { store } from './store'
import App from './App'
import './index.css'
import { connectToDataBus } from './data-bus'

render(
    <Provider store={store}>
        <App />
    </Provider>,
    window.document.querySelector('#app-container')
)

connectToDataBus()