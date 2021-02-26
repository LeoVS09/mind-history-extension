import { PageModelDictanory, PageVisitModel } from "../domain"
import { ExtensionSettings } from "../settings"

export enum MessageTypes {
    ACTUAL_PAGE_STORE = 'ACTUAL_PAGE_STORE',
    CHANGE_SETTINGS = 'CHANGE_SETTINGS',
}

export interface ActualPageStorePayload {
    pages: PageModelDictanory
    history: Array<PageVisitModel>
    settings: ExtensionSettings
}

export interface ChangeSettingsPayload {
    settings: ExtensionSettings
}

export interface DataBusMessage<T = any> {
    type: MessageTypes
    payload: T
}