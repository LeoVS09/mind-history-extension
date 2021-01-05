import { configureStore } from '@reduxjs/toolkit'
import { pagesReducer } from './reducer'

export * as actions from './actions'

export const store = configureStore({
    reducer: pagesReducer
})