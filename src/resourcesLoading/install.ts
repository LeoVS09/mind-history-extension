import { onResponseListener } from "./onResponse"
import { ResourcesUrlGetter } from "./types"

export function installUnblockers(tabId: number, getUrls: ResourcesUrlGetter) {
    // TODO: check is uninstall can cause uninstall from other tabs
    uninstallUnblockers(getUrls)

    const extra = ['blocking', 'responseHeaders']
    if (/Firefox/.test(navigator.userAgent) === false)
        extra.push('extraHeaders')


    chrome.webRequest.onHeadersReceived.addListener(onResponseListener.bind(null, getUrls), {
        tabId,
        urls: ['<all_urls>']
    },
        extra
    )
}

export function uninstallUnblockers(getUrls: ResourcesUrlGetter) {
    chrome.webRequest.onHeadersReceived.removeListener(onResponseListener.bind(null, getUrls))
}