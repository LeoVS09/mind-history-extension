import { PageVisit } from "../../../history"
import { ExtensionSettings, initialSettings } from "../../../settings"
import { PageDataDictanory } from "../../../types"

export interface PagesState {
    current?: string
    history: Array<PageVisit>
    pages: PageDataDictanory
    // TODO: allow to change settings
    settings: ExtensionSettings
}

export const initialState: PagesState = {
    history: [],
    pages: {},
    settings: initialSettings
}