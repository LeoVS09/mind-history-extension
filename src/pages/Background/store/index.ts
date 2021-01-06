import { configureStore } from '@reduxjs/toolkit'
import { initialState, pagesReducer } from './reducer'
import * as persistence from './persistence'

import * as actions from './actions'

export {
    actions
}

export const store = configureStore({
    reducer: pagesReducer,
    preloadedState: { ...initialState, ...persistence.retrive() }
})

store.subscribe(() => {
    persistence.save(store.getState())
})
