
import { IPagePersistence, IVistsPersistence } from "../buildHistory/interfaces"
import { PageModel, PageModelDictanory } from "../domain"
import { computeOldTrees, GetOldTreesOptions } from "./computeOldTrees"
import { IBrowserApiService } from "./interfaces"


export class PagesHistory {
    constructor(
        private readonly pagesDb: IPagePersistence,
        private readonly visitsDb: IVistsPersistence,
        private readonly browser: IBrowserApiService,
    ) { }

    async tryCloseOldPages(urls: Array<string>, {
        currentTime = (new Date()).getTime(),
        ...restOptions
    }: GetOldTreesOptions) {
        // TODO: reafactor whole method
        let [openInBrowser, openInDatabase] = await Promise.all([
            this.pagesDb.getAll(urls),
            this.pagesDb.getAllOpen()
        ])
        // mark them as open, if they was known as closed
        openInBrowser = openInBrowser.map(page => ({
            ...page,
            isOpen: true,
        }))

        const allPages = [...openInBrowser, ...openInDatabase]

        const knownPages: PageModelDictanory = {}
        // Save only unique pages
        allPages.forEach(page => knownPages[page.url] = page)

        const oldestPage = getOldestPage(Object.values(knownPages))
        if (!oldestPage) {
            // TODO: fix
            console.warn('Cannot find oldest page for close pages')
            return
        }
        const history = await this.visitsDb.get(oldestPage.openedAt!, currentTime)

        const old = computeOldTrees(knownPages, history, { ...restOptions, currentTime })
        console.log('old trees:', old)

        const current = this.browser.getCurrentPageUrl()
        const updatedPages: Array<PageModel> = []

        for (const rootUrl of Object.keys(old)) {
            const nodes = old[rootUrl]
                .map(({ id }) => id)

            if (current && nodes.includes(current)) {
                // Prevent acidental close tree whch currently used
                continue
            }

            const closedPages = nodes
                // Not use tree nodes for search, for not accidentally mix data models
                .map(url => knownPages[url])
                .filter(page => !!page)
                .map(page => ({ ...page!, isOpen: false }))

            updatedPages.push(...closedPages)

            this.replaceTabsWithGraph(rootUrl, nodes)
        }
    }

    async replaceTabsWithGraph(rootUrl: string, nodes: Array<string>) {
        const closedTabs = await this.browser.closePages(nodes)

        if (!closedTabs.length) {
            // If nothing was closed, then not need open graph for it
            return
        }

        let index = 0

        // Will set new tab at index of first closed tab
        const [smallestIndex] = closedTabs
            .map(tab => tab.index)
            .filter(index => index !== undefined)
            .sort()

        index = smallestIndex !== undefined ? smallestIndex : index

        this.browser.createGraphPage(rootUrl, index)
    }


}

function getOldestPage(pages: Array<PageModel>): PageModel | undefined {
    const [oldestPage] = pages
        .filter(({ openedAt }) => !!openedAt)
        .sort((a, b) => a.openedAt! - b.openedAt!)

    return oldestPage
}

