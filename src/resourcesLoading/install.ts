import { onResponseListener } from "./onResponse"

export function installUnblockers(tabId: number) {
    // TODO: check is uninstall can cause uninstall from other tabs
    uninstallUnblockers()

    const extra = ['blocking', 'responseHeaders']
    if (/Firefox/.test(navigator.userAgent) === false)
        extra.push('extraHeaders')


    chrome.webRequest.onHeadersReceived.addListener(onResponseListener, {
        tabId,
        urls: ['<all_urls>']
    },
        extra
    )
}

export function uninstallUnblockers() {
    chrome.webRequest.onHeadersReceived.removeListener(onResponseListener)
}