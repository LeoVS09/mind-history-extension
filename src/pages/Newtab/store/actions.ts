import { createAction } from "@reduxjs/toolkit";
import { PageVisit } from "../../../history";
import { PageDataDictanory } from "../../../types";

export const setPageDictionary = createAction<PageDataDictanory>('SET_PAGE_DICTIONARY');
export const setHistory = createAction<Array<PageVisit>>('SET_HISTORY');