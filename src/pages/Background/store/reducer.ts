import { createReducer } from "@reduxjs/toolkit";
import { PageData, PageVisit } from "../../../history";
import { PageDataDictanory } from "../../../types";
import * as actions from "./actions";
export interface PagesStore {
    current?: string
    history: Array<PageVisit>
    pages: PageDataDictanory
}

export const pagesReducer = createReducer<PagesStore>({
    history: [],
    pages: {}
}, {

    [actions.setCurrentPage.type]: (state, { payload: url }: ReturnType<typeof actions.setCurrentPage>) => {
        state.current = url;
    },

    [actions.openPage.type]: (state, { payload: { url, time } }: ReturnType<typeof actions.openPage>) => {
        state.history.push({
            from: state.current,
            to: url,
            time
        });
        printHistory(state.history);
    },

    [actions.savePageData.type]: (state, { payload: { url, page } }: ReturnType<typeof actions.savePageData>) => {
        // Need prevent overriding fields with data, by undefined values
        const oldData = state.pages[url]
        state.pages[url] = {
            title: page.title || oldData?.title,
            favIconUrl: page.favIconUrl || oldData?.favIconUrl,
        }
        console.log('Page data saved', JSON.stringify(state, null, 2))
    }
})

const printHistory = (history: Array<PageVisit>) => {
    const result = []
    for (const visit of history) {
        result.push(`${visit.from} -> ${visit.to} | ${new Date(visit.time)}`)
    }

    console.log(result.join('\n\n '))
}