import { tabs } from "../../browser"
import { NotHavePermissionError } from "./errors"
import { store, actions } from "./store"
import { now } from "./time"

export function registerOnVisitPageHook() {
    if (!chrome.history)
        throw new NotHavePermissionError('history', 'access visited pages urls')

    chrome.history.onVisited.addListener(async event => {
        console.log('onVisited', event.url)
        if (!event.url) {
            console.warn('not have url in visited event', event)
            return
        }

        getPageVisists({ url: event.url })
            .then(results => {
                const visit = results[results.length - 1]
                const time = visit.visitTime

                console.log('getVisits', event.url, 'at', time, 'on type', visit.transition)
                store.dispatch(actions.savePageData({ url: event.url!, time, page: { lastAccessTime: time } }))
            })

        // On visited called allways, on new page loads
        // instead of onActivated, which not called when we load new page on same tab
        // so need change current tab
        const tab = await tabs.getActive()
        const url = tab.url || tab.pendingUrl
        const time = now()
        if (url) {
            store.dispatch(actions.savePageData({
                url,
                // page wasn't opened at this time,
                // but better save at least this moment, 
                // if creation time not exists
                time,
                page: {
                    title: tab.title,
                    favIconUrl: tab.favIconUrl,
                    lastAccessTime: time
                }
            }))
        }

        if (tab.status === 'loading') {
            console.log('onVisited Active tab is changed to loading page, with url', url, tab)

            if (url)
                store.dispatch(actions.setCurrentPage(url))

            return
        }
        console.log('onVisited Active page changed to', tab.title, 'with url', tab.url, tab)

        if (!tab.url) {
            console.warn('onVisited Active tab not have url')
            return
        }

        store.dispatch(actions.setCurrentPage(tab.url))

    })
    console.log('chrome.history.onVisited hook registered')
}

export const getPageVisists = (details: chrome.history.Url): Promise<chrome.history.VisitItem[]> =>
    new Promise((resolve) =>
        chrome.history.getVisits(details, resolve)
    )
