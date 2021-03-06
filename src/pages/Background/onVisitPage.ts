import { tabs } from "../../browser"
import { NotHavePermissionError } from "./errors"
import { store, actions } from "./store"

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
                store.dispatch(actions.savePageData({ url: event.url!, page: { lastAccessTime: time } }))

                // if (isOnFormSubmit(visit)) {
                //     console.log('User opened page', event.url, ' from form submit at', time)
                //     return
                // }

                // if (isByLink(visit)) {
                //     console.log('User opened page', event.url, ' by link at', time)
                //     return
                // }

                // if (isFromSearchBar(visit)) {
                //     console.log('User opened page', event.url, ' from search bar at', time)
                //     return
                // }
            })

        // On visited called allways, on new page loads
        // instead of onActivated, which not called when we load new page on same tab
        // so need change current tab
        const tab = await tabs.getActive()
        if (tab.status === 'loading') {
            console.log('onVisited Active tab is changed to loading page, with url', tab.pendingUrl, tab)
            const url = tab.url || tab.pendingUrl
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
        store.dispatch(actions.savePageData({
            url: tab.url,
            page: {
                title: tab.title,
                favIconUrl: tab.favIconUrl
            }
        }))
    })
    console.log('chrome.history.onVisited hook registered')
}

export const getPageVisists = (details: chrome.history.Url): Promise<chrome.history.VisitItem[]> =>
    new Promise((resolve) =>
        chrome.history.getVisits(details, resolve)
    )
