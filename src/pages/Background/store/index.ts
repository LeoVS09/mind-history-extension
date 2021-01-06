import { configureStore } from '@reduxjs/toolkit'
import { pagesReducer } from './reducer'
import * as persistence from './persistence'

import * as actions from './actions'
import { initialState, PagesState } from './state'

export {
    actions
}

export const store = configureStore<PagesState>({
    reducer: pagesReducer,
    preloadedState: { ...initialState, ...persistence.retrive() }
})

store.subscribe(() => {
    persistence.save(store.getState())
})
