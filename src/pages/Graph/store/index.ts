import { configureStore } from '@reduxjs/toolkit'
import { pagesReducer } from './reducer'

export * as actions from './actions'

export const store = configureStore({
    reducer: pagesReducer
})

export const getFaviconsUrls = (): Array<string> => {
    const { pages } = store.getState()
    return Object.keys(pages)
        .map(pageUrl => pages[pageUrl].favIconUrl)
        .filter(url => !!url) as Array<string>
}
