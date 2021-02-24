import { TabModel } from "../domain"


export interface IBrowserApiService {
    getCurrentPageUrl(): string | undefined
    /** Will try close pages, and return closed */
    closePages(urls: Array<string>): Promise<Array<TabModel>>

    /** Will create graph page, at given index, but not set active for user */
    createGraphPage(highlightPageUrl: string, tabIndex: number): void
}
