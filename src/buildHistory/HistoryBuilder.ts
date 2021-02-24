import { PageModel, isTrackablePage } from "../domain"
import { IPagePersistence, IVistsPersistence } from "./interfaces"

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
        if (!isTrackablePage(page.url))
            return

        await this.pagesDb.createOrUpdate(page)
    }

    async updatePages(pages: PagesDictianory) {
        const pagesUpdates = Object.keys(pages)
            .filter(url => isTrackablePage(url))
            .map(url => pages[url])

        await this.pagesDb.batchCreateOrUpdate(pagesUpdates)
    }

    async updateCurrentlyOpenPages(tabUrls: Array<string>) {
        const openPages = await this.pagesDb.getAllOpen()
        const openPagesUrls = openPages.map(({ url }) => url)

        // Update newly opened pages which was known as closed
        const newlyOpenedPages = tabUrls
            .filter(url => !openPagesUrls.includes(url))
            .map(url => ({
                url,
                isOpen: true
            }))

        const isOpen = (url: string) => tabUrls.includes(url)

        // Update closed pages which was known as opened
        const closedPages = openPages.map(page => ({
            ...page,
            isOpen: isOpen(page.url),
        }))
            .filter(page => !page.isOpen)


        this.pagesDb.batchCreateOrUpdate([...newlyOpenedPages, ...closedPages])
    }
}
