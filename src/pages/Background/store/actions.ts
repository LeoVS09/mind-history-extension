import { createAction } from "@reduxjs/toolkit";
import { PageData } from "../../../history";

export const setCurrentPage = createAction<string>('SET_CURRENT_PAGE')
export const openPage = createAction<{ url: string, time: number }>('OPEN_PAGE')
export const savePageData = createAction<{ url: string, page: PageData }>('SAVE_PAGE_DATA')