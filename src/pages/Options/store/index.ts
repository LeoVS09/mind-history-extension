import { configureStore } from "@reduxjs/toolkit"
import { OptionsState } from "./state"
import { optionsReducer } from "./reducers"

export * as actions from "./actions"

export const store = configureStore<OptionsState>({
    reducer: optionsReducer
})
