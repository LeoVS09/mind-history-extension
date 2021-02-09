import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { getFaviconsUrls, store } from './store'
import App from './App'
import './index.css'
import { connectToDataBus } from './data-bus'
import { unblockResourcesLoading } from '../../resourcesLoading'

async function main() {

    try {
        await unblockResourcesLoading(getFaviconsUrls)
    } catch (err) {
        console.warn('Cannot set unblock for favicons', err)
    }

    render(
        <Provider store={store}>
            <App />
        </Provider>,
        window.document.querySelector('#app-container')
    )

    connectToDataBus()
}

main()
