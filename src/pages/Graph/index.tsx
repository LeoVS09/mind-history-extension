import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { store } from './store'
import App from './App'
import './index.css'
import { connectToDataBus } from './data-bus'
import { unblockResourcesLoading } from '../../resourcesLoading'

const getFaviconsUrls = (): Array<string> => {
    const { pages } = store.getState()
    return Object.keys(pages)
        .map(pageUrl => pages[pageUrl].favIconUrl)
        .filter(url => !!url) as Array<string>
}

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
