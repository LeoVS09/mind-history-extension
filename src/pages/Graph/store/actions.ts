import { createAction } from "@reduxjs/toolkit"
import { PageVisitModel } from "../../../domain"
import { PageDataDictanory } from "../../../types"

export const setPageDictionary = createAction<PageDataDictanory>('SET_PAGE_DICTIONARY')
export const setHistory = createAction<Array<PageVisitModel>>('SET_HISTORY')