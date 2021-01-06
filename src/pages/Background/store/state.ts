import { PageVisit } from "../../../history"
import { PageDataDictanory } from "../../../types"

export interface PagesState {
    current?: string
    history: Array<PageVisit>
    pages: PageDataDictanory
    // TODO: allow to change settings
    settings: {
        /** Define how long old search graph can be not accessable, before it will be closed */
        pageExirationTime: number
    }
}

export const initialState: PagesState = {
    history: [],
    pages: {},
    settings: {
        pageExirationTime: 2 * 60 * 60 * 1000 // 2 hours in ms 
    }
}