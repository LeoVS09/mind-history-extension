import { getTabGrantedData } from "./types/access"
import { isLoaded } from "./types/guards"
import { store, actions } from "./store"

// TODO: set tab as closed when user close tab

export function registerOnTabOpenHook() {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        store.dispatch(actions.tryCloseOldPages())

        if (changeInfo.url) {
            store.dispatch(actions.savePageData({
                url: changeInfo.url,
                page: { title: changeInfo.title, favIconUrl: changeInfo.favIconUrl }
            }))
        }
        if (!isLoaded(changeInfo))
            return

        const { url, title, favIconUrl } = getTabGrantedData(tab)
        console.log(`Tab "${title}" has been loaded.`)

        if (!url) {
            console.warn("Tab loaded, but not have url")
            return
        }
        store.dispatch(actions.savePageData({ url, page: { title, favIconUrl } }))
    })

    chrome.tabs.onActivated.addListener(({ tabId, windowId }) => {
        chrome.tabs.get(tabId, tab => {
            const url = tab.url || tab.pendingUrl
            console.log('onActivated Active page changed to', tab.title, 'with url', url, tab)

            if (!url) {
                console.warn('onActivated Active tab not have url')
                return
            }
            store.dispatch(actions.savePageData({
                url,
                page: {
                    title: tab.title,
                    favIconUrl: tab.favIconUrl,
                    lastAccessTime: new Date().getTime()
                }
            }))

            if (tab.status === 'loading') {
                console.log('onActivated Active tab is changed to loading page, with url', url, tab)
                // called when start load new page in new tab    
                return
            }

            store.dispatch(actions.setCurrentPage(url))
        })

    })
}

export const getTab = (queryInfo: chrome.tabs.QueryInfo) =>
    new Promise<Array<chrome.tabs.Tab>>(resolve =>
        chrome.tabs.query(queryInfo, tabs => resolve(tabs || []))
    )

export const closePages = async (urls: Array<string>) => {
    const tabs = await getTab({ url: urls })
    const tabIds = tabs
        .map(({ id }) => id)
        .filter(id => !!id) as Array<number>

    await removeTabs(tabIds)

    return tabs
}

export const removeTabs = (tabsIds: Array<number>) =>
    new Promise(resolve => {
        chrome.tabs.remove(tabsIds, resolve)
    })