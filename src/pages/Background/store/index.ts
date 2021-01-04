import { configureStore } from '@reduxjs/toolkit'
import { pagesReducer } from './reducer'
import * as persistence from './persistence'

export * as actions from './actions'

export const store = configureStore({
    reducer: pagesReducer,
    preloadedState: persistence.retrive()
})

store.subscribe(() => {
    persistence.save(store.getState())
})
