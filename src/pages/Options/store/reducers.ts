import { createReducer } from "@reduxjs/toolkit"
import { initialState, OptionsState } from "./state"
import * as actions from "./actions"
import { sendNewSettings } from "../data-bus"

export const optionsReducer = createReducer<OptionsState>(initialState, {
    [actions.changeSettings.type]: (state, { payload }: ReturnType<typeof actions.changeSettings>) => {
        state.settings = payload
        sendNewSettings(state.settings)
    },
    [actions.setLoadedSettings.type]: (state, { payload }: ReturnType<typeof actions.setLoadedSettings>) => {
        state.isLoading = false
        state.settings = payload
    }
})