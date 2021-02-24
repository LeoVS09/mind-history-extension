import { IPagePersistence } from "../../../buildHistory/interfaces"
import { mergeUpdates } from "../../../buildHistory/mergePageUpdates"
import { PageModel } from "../../../domain"
import { pouchDB } from "./drivers"
import { ExistingPageStorageItem } from "./drivers/pouchDB"
import { normaliseUrl } from "./uid"

export interface ExistingPagesDictianory {
    [id: string]: ExistingPageStorageItem
}

export class PageDatabasePuchDbAdapter implements IPagePersistence {
    async createOrUpdate(page: PageModel) {
        const id = normaliseUrl(page.url)

        const existing = await pouchDB.pages.get(id)
        if (!existing) {
            await pouchDB.pages.create({
                _id: id,
                ...page
            })
            return
        }

        const merged = mergeUpdates(existing, page)

        await pouchDB.pages.update({
            ...merged,
            _id: existing._id,
            _rev: existing._rev,
        })
    }

    async get(url: string): Promise<PageModel | undefined> {
        const id = normaliseUrl(url)
        return await pouchDB.pages.get(id)
    }

    async getAll(urls: Array<string>): Promise<Array<PageModel>> {
        const ids = urls.map(normaliseUrl)
        return await pouchDB.pages.getAllById(ids)
    }

    async getAllOpen(): Promise<Array<PageModel>> {
        return await pouchDB.pages.getAllOpen()
    }

    async batchCreateOrUpdate(pages: Array<PageModel>) {
        const pagesWithId = pages.map(page => ({
            ...page,
            _id: normaliseUrl(page.url)
        }))

        const existing = await pouchDB.pages.getAllById(pagesWithId.map(({ _id }) => _id))

        const existingDict: ExistingPagesDictianory = {}
        existing.forEach(page => existingDict[page._id] = page)

        const existingPagesId = Object.keys(existingDict)

        const notExists = pagesWithId
            .filter(page => !existingPagesId.includes(page._id))

        const updatesOfExisting = pagesWithId
            .filter(page => existingPagesId.includes(page._id))
            .map(page => mergeUpdates(existingDict[page._id], page))

        await Promise.all([
            notExists.length && pouchDB.pages.batchCreate(notExists),
            updatesOfExisting.length && pouchDB.pages.batchUpdate(updatesOfExisting)
        ])
    }
}

