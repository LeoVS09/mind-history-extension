import { createAction } from "@reduxjs/toolkit";
import { Page } from "../../../history";

export const setCurrentPage = createAction<Page>('SET_CURRENT_PAGE')
export const openPage = createAction<{ page: Page, time: number }>('OPEN_PAGE')