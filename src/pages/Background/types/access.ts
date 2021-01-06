import { NotHavePermissionError } from "../errors"

export function getTabGrantedData(tab: chrome.tabs.Tab) {
    if (!tab.title) 
        throw new NotHavePermissionError('tabs', 'access tabs titles and urls')
    

    return {
        title: tab.title,
        url: tab.url,
        pendingUrl: tab.pendingUrl,
        favIconUrl: tab.favIconUrl,
    }
}
