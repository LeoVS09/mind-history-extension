import { getTabGrantedData } from "./types/access"
import { isLoaded } from "./types/guards"
import { store, actions } from "./store"

export function registerOnTabOpenHook() {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.url) {
            store.dispatch(actions.savePageData({
                url: changeInfo.url,
                page: { title: changeInfo.title, favIconUrl: changeInfo.favIconUrl }
            }))
        }
        if (!isLoaded(changeInfo)) {
            return
        }
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
            if (tab.status === 'loading') {
                console.log('onActivated Active tab is changed to loading page, with url', tab.pendingUrl, tab)
                // called when start load new page in new tab
                // const url = tab.url || tab.pendingUrl
                // if (url) {
                //     store.dispatch(actions.setCurrentPage(url))
                // }
                return
            }
            console.log('onActivated Active page changed to', tab.title, 'with url', tab.url, tab)

            if (!tab.url) {
                console.warn('onActivated Active tab not have url')
                return
            }

            store.dispatch(actions.setCurrentPage(tab.url))
            store.dispatch(actions.savePageData({
                url: tab.url,
                page: {
                    title: tab.title,
                    favIconUrl: tab.favIconUrl
                }
            }))
        })

    })

}


