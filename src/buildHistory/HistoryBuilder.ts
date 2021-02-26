import { PageModel, isTrackablePage } from "../domain"
import { IPagePersistence, IVistsPersistence } from "./interfaces"
import { normaliseUrl, normalisePage } from "../domain"

export interface PagesDictianory {
    [url: string]: PageModel
}

export class HistoryBuilder {
    constructor(
        private readonly pagesDb: IPagePersistence,
        private readonly visitsDb: IVistsPersistence,
    ) { }

    // Important to track page open with current page at moment of event
    // so not use BrowserStateService for recive state dynamically
    async onPageOpen(url: string, time: number, current?: string) {
        url = normaliseUrl(url)
        current = current && normaliseUrl(current)

        if (!isTrackablePage(url))
            return

        await this.pagesDb.createOrUpdate({
            url,
            isOpen: true,
            openedAt: time,
        })

        if (!current || !isTrackablePage(current))
            return

        await this.visitsDb.add({
            from: current,
            to: url,
            time
        })
    }

    async updateDataAboutPage(page: PageModel) {
        page = normalisePage(page)
        if (!isTrackablePage(page.url))
            return

        await this.pagesDb.createOrUpdate(page)
    }

    async updatePages(pages: PagesDictianory) {
        const pagesUpdates = Object.keys(pages)
            .filter(url => isTrackablePage(url))
            .map(url => normalisePage(pages[url]))

        await this.pagesDb.batchCreateOrUpdate(pagesUpdates)
    }

    // will update pages in database which known as open, but currently closed
    // also mark as open pages which known as closed
    // and add new pages
    async updateCurrentlyOpenPages(openPages: Array<PageModel>) {
        openPages = openPages.map(normalisePage)

        const pagesOpenInDB = await this.pagesDb.getAllOpen()

        // Update newly opened pages which was known as closed
        const newlyOpenedPages = openPages
            .filter(({ url }) => !pagesOpenInDB.find(page => page.url === url))
            .map(page => ({
                ...page,
                isOpen: true
            }))

        // Update closed pages which was known as opened
        const restPages = pagesOpenInDB.map(page => {
            const open = openPages.find(({ url }) => page.url === url)
            if (!open) {
                return {
                    ...page,
                    isOpen: false,
                }
            }

            return {
                ...open,
                isOpen: true,
            }
        })


        this.pagesDb.batchCreateOrUpdate([...newlyOpenedPages, ...restPages])
    }
}

