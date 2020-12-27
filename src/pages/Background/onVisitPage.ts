import { NotHavePermissionError } from "./errors";

export function registerOnVisitPageHook() {
    if (!chrome.history) {
        throw new NotHavePermissionError('history', 'access visited pages urls')
    }

    chrome.history.onVisited.addListener(event => {
        console.log('onVisited', event.url);
        chrome.tabs
        if (!event.url) {
            console.warn('not have url in visited event', event)
            return
        }

        chrome.history.getVisits({ url: event.url }, results => {
            const visit = results[results.length - 1]
            const time = visit.visitTime && new Date(visit.visitTime)

            console.log('getVisits', event.url, 'at', time, 'on type', visit.transition)

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
        });
    })
    console.log('chrome.history.onVisited hook registered')
}

