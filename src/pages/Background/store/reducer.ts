import { createReducer } from "@reduxjs/toolkit"
import { isTrackablePage, PageModel, PageVisitModel } from "../../../domain"
import { toGraphPage } from "../../../routing"
import { closePages } from "../eventProducers/onOpenTab"
import * as actions from "./actions"
import { getOldTrees, GetOldTreesOptions } from "../closeOldPages/computeOldTrees"
import { PagesState, initialState } from "./state"


export const pagesReducer = createReducer<PagesState>(initialState, {

    [actions.setCurrentPage.type]: (state, { payload: url }: ReturnType<typeof actions.setCurrentPage>) => {
        state.current = url
    },

    [actions.openPage.type]: (state, { payload: { url, time } }: ReturnType<typeof actions.openPage>) => {
        onPageOpen(url, time, state.current)
    },

    [actions.savePageData.type]: (state, { payload: { url, page, time } }: ReturnType<typeof actions.savePageData>) => {
        updateDataAboutPage(page)
    },

    [actions.updatePagesVisitsTime.type]: (state, { payload: vistTimes }: ReturnType<typeof actions.updatePagesVisitsTime>): void => {
        updatePagesVistTimes(vistTimes)
    },

    [actions.tryCloseOldPages.type]: (state) => {
        tryCloseOldPages()
    },

    [actions.setOpenPages.type]: ({ pages }, { payload: tabs }: ReturnType<typeof actions.setOpenPages>) => {
        currentlyOpenPages()
    },

    [actions.setSettings.type]: (state, { payload: settings }: ReturnType<typeof actions.setSettings>) => {
        state.settings = settings
    }
})

