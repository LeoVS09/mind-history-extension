import { createAction } from "@reduxjs/toolkit"
import { PageData } from "../../../history"
import { ExtensionSettings } from "../../../settings"

export interface PagesVisistTimeDictianory {
    [url: string]: number
}

export const setCurrentPage = createAction<string>('SET_CURRENT_PAGE')
export const openPage = createAction<{ url: string, time: number }>('OPEN_PAGE')
export const savePageData = createAction<{ url: string, page: PageData }>('SAVE_PAGE_DATA')
export const updatePagesVisitsTime = createAction<PagesVisistTimeDictianory>('UPDATE_PAGES_VISITS_TIME')
export const tryCloseOldPages = createAction('TRY_CLOSE_OLD_PAGES')
export const setOpenPages = createAction<Array<string>>('SET_OPEN_PAGES')
export const setSettings = createAction<ExtensionSettings>('SET_SETTINGS')