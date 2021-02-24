import { PageModel, PageVisitModel } from "../../../../../domain"


/** Database item for store pages */
export interface PageStorageItem extends PouchDB.Core.Document<PageModel> {
    _id: string // normalised url
}

export interface ExistingPageStorageItem extends PageStorageItem {
    _rev: string
}

export interface VisitStorageItem extends PouchDB.Core.Document<PageVisitModel> {
    _id: string // timestamp of creation
    // create indexes for easier find pages from and to which was made requests
}