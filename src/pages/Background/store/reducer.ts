import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { Page, PageHistory, PageVisit } from "../../../history";
import { openPage, setCurrentPage } from "./actions";

export interface PagesStore {
    current?: Page
    history: Array<PageVisit> // redux not allow usage of classes
}

export const pagesReducer = createReducer<PagesStore>({
    history: []
}, {
    [setCurrentPage.type]: (state, { payload: page }: ReturnType<typeof setCurrentPage>) => {
        state.current = page;
    },
    [openPage.type]: (state, { payload: { page, time } }: ReturnType<typeof openPage>) => {
        const history = new PageHistory(state.history)
        history.push(page, time, state.current && { ...state.current });
    }
})