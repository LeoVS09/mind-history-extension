import { store, actions } from "./store"
import { now } from "./time"

// TODO: set tab as closed when user close tab

export function registerOnTabOpenHook() {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        store.dispatch(actions.tryCloseOldPages())

        if (process.env.DEBUG)
            console.debug("chrome.tabs.onUpdated", tabId, changeInfo, tab)

        if (changeInfo.url) {
            store.dispatch(actions.savePageData({
                url: changeInfo.url,
                time: now(),
                page: { title: changeInfo.title, favIconUrl: changeInfo.favIconUrl }
            }))
        }

        const url = tab.url || tab.pendingUrl
        const { title, favIconUrl } = tab
        console.log(`Tab "${title || url}" updated.`)

        if (!url) {
            console.warn("Tab updated, but not have url")
            return
        }
        store.dispatch(actions.savePageData({ url, page: { title, favIconUrl }, time: now() }))
    })

    chrome.tabs.onActivated.addListener(({ tabId, windowId }) => {
        const time = now()
        chrome.tabs.get(tabId, tab => {
            if (process.env.DEBUG)
                console.debug("chrome.tabs.onActivated", tabId, tab)

            const url = tab.url || tab.pendingUrl
            console.log('onActivated Active page changed to', tab.title, 'with url', url, tab)

            if (!url) {
                console.warn('onActivated Active tab not have url')
                return
            }
            store.dispatch(actions.savePageData({
                url,
                time,
                page: {
                    title: tab.title,
                    favIconUrl: tab.favIconUrl,
                    lastAccessTime: time
                }
            }))

            if (tab.status === 'loading') {
                // called when start load new page in new tab    
                console.log('onActivated Active tab is changed to loading page, with url', url, tab)
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