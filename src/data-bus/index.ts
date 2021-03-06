import { PageVisit } from "../history"
import { ExtensionSettings } from "../settings"
import { PageDataDictanory } from "../types"

export enum MessageTypes {
    ACTUAL_PAGE_STORE = 'ACTUAL_PAGE_STORE',
    CHANGE_SETTINGS = 'CHANGE_SETTINGS',
}

export interface ActualPageStorePayload {
    pages: PageDataDictanory
    history: Array<PageVisit>
    settings: ExtensionSettings
}

export interface ChangeSettingsPayload {
    settings: ExtensionSettings
}

export interface DataBusMessage<T = any> {
    type: MessageTypes
    payload: T
}