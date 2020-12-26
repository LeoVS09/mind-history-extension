import { NotHavePermissionError } from "./errors";

export function registerOnVisitPageHook() {
    if (!chrome.history) {
        throw new NotHavePermissionError('history', 'access visited pages urls')
    }

    chrome.history.onVisited.addListener(event => {
        console.log('page visited', event.url);
        if (!event.url) {
            console.warn('not have url in visited event', event)
            return
        }

        chrome.history.getVisits({ url: event.url }, results => {
            console.log('visited results', results);
        });
    })
    console.log('chrome.history.onVisited hook registered')
}