import { PageModel, PageVisitModel } from "../domain"

export interface IPagePersistence {
    createOrUpdate(page: PageModel): Promise<void>
    batchCreateOrUpdate(pages: Array<PageModel>): Promise<void>
    getAll(urls: Array<string>): Promise<Array<PageModel>>
    getAllOpen(): Promise<Array<PageModel>>
}

export interface IVistsPersistence {
    add(visit: PageVisitModel): Promise<void>
    get(from: number, to?: number): Promise<Array<PageVisitModel>>
}
