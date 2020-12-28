import { PageData, PageVisit } from "../history";
import { PageDataDictanory } from "../types";

export enum MessageTypes {
    GET_PAGE_STORE = 'GET_PAGE_STORE'
}

export interface GetPageStoreResponsePayload {
    pages: PageDataDictanory
    history: Array<PageVisit>
}

export interface DataBusMessage<T = any> {
    type: MessageTypes
    payload: T
}