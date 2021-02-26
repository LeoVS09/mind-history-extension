import { HistoryBuilder } from "../../../buildHistory"
import { PageModel } from "../../../domain"
import * as browser from "../../../browser"

export class TabsStateProducer {
    constructor(
        private readonly historyBuilder: HistoryBuilder
    ) { }

    async updateOpenPages() {
        const tabs = await browser.tabs.getAllTabs()

        const pages = tabs.map<PageModel>(tab => ({
            url: (tab.url || tab.pendingUrl) as string,
            title: tab.title,
            favIconUrl: tab.favIconUrl,
            isOpen: true
        }))
            .filter(({ url }) => !!url)

        console.log('Found', tabs.length, 'open tabs, start update...')

        this.historyBuilder.updateCurrentlyOpenPages(pages)
    }
}