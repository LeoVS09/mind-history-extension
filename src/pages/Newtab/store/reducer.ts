import { createReducer } from "@reduxjs/toolkit"
import { PageVisit } from "../../../history"
import { PageDataDictanory } from "../../../types"
import * as actions from "./actions"

export interface PagesStore {
    history: Array<PageVisit>
    pages: PageDataDictanory
}

export const pagesReducer = createReducer<PagesStore>({
    history: [],
    pages: {}
}, {

    [actions.setPageDictionary.type]: (state, { payload: pages }: ReturnType<typeof actions.setPageDictionary>) => {
        state.pages = pages
    },

    [actions.setHistory.type]: (state, { payload: history }: ReturnType<typeof actions.setHistory>) => {
        state.history = history
    }
})
