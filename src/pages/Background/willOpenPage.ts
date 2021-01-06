import { NotHavePermissionError } from "./errors"
import { isByLink } from "./types/guards"
import { store, actions } from "./store"
import { getCurrentTab } from "./browser/tabs"

export function registerOnWillOpenPageHook() {
    if (!chrome.webNavigation) 
        throw new NotHavePermissionError('webNavigation', 'see user page transtions')
    

    chrome.webNavigation.onBeforeNavigate.addListener(async event => {
        console.log('onBeforeNavigate to ' + event.url, 'in tab', event.tabId, 'at', new Date(event.timeStamp))
        const tab = await getCurrentTab()
        console.log('Was start opening page', event.url, 'from tab with url', tab.url || tab.pendingUrl, 'and title', tab.title, 'at', new Date(event.timeStamp), tab)
    })

    chrome.webNavigation.onCommitted.addListener(event => {
        console.log('onCommitted to ' + event.url, 'in tab', event.tabId, 'at', new Date(event.timeStamp), 'transition type', event.transitionType)
        if (isByLink(event.transitionType)) {
            store.dispatch(actions.openPage({
                url: event.url,
                time: event.timeStamp
            }))
        }
    })

    chrome.webNavigation.onCompleted.addListener(event => {
        console.log('onCompleted to ' + event.url, 'in tab', event.tabId, 'at', new Date(event.timeStamp))
    })

    chrome.webNavigation.onCreatedNavigationTarget.addListener(event => {
        console.log('onCreatedNavigationTarget to ' + event.url, 'in tab', event.tabId, 'at', new Date(event.timeStamp))
    })
}