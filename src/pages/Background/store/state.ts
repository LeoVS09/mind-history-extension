import { PageVisitModel } from "../../../domain"
import { ExtensionSettings, initialSettings } from "../../../settings"
import { PageDataDictanory } from "../../../types"

export interface PagesState {
    current?: string
    history: Array<PageVisitModel>
    settings: ExtensionSettings
}

export const initialState: PagesState = {
    history: [],
    pages: {},
    settings: initialSettings
}