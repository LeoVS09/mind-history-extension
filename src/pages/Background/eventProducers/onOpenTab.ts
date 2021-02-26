import { store, actions } from "../store"
import { now } from "../time"
import * as browser from '../../../browser'
import { HistoryBuilder } from "../../../buildHistory"
import { PagesHistory } from "../../../closeOldPages"

// TODO: set tab as closed when user close tab

export class OpenTabsListener {
    constructor(
        private readonly historyBuilder: HistoryBuilder,
        private readonly pagesHistory: PagesHistory
    ) { }

    register() {
        browser.tabs.onUpdated(this.onUpdated)
        browser.tabs.onActivated(this.onActivated)
    }

    private onUpdated = async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
        const tabs = await browser.tabs.getAllTabs()
        const tabUrls = tabs
            .map(({ url, pendingUrl }) => url || pendingUrl!)
            .filter(url => !!url)

        const { settings: { pageExirationTime } } = store.getState()
        await this.pagesHistory.tryCloseOldPages(tabUrls, { pageExirationTime })

        if (process.env.DEBUG)
            console.debug("chrome.tabs.onUpdated", tabId, changeInfo, tab)

        const url = tab.url || tab.pendingUrl || changeInfo.url
        const { title, favIconUrl } = tab

        if (!url) {
            console.warn("Tab updated, but not have url")
            return
        }

        this.historyBuilder.updateDataAboutPage({
            url,
            title: title || changeInfo.title,
            favIconUrl: favIconUrl || changeInfo.favIconUrl,
            isOpen: true
        })
    }

    private onActivated = async ({ tabId, windowId }: chrome.tabs.TabActiveInfo) => {
        const time = now()
        const tab = await browser.tabs.getTabById(tabId)

        if (process.env.DEBUG)
            console.debug("chrome.tabs.onActivated", tabId, windowId, tab)

        const url = tab.url || tab.pendingUrl
        const { title, favIconUrl } = tab
        if (!url) {
            console.warn('chrome.tabs.onActivated Active tab not have url')
            return
        }

        this.historyBuilder.updateDataAboutPage({
            url,
            title,
            favIconUrl,
            lastAccessedAt: time,
            isOpen: true
        })

        if (tab.status === 'loading') {
            // called when start load new page in new tab    
            console.log('chrome.tabs.onActivated Active tab is changed to loading page, with url', url, tab)
            return
        }

        store.dispatch(actions.setCurrentPage(url))
    }
}