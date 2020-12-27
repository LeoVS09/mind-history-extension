import { getTabGrantedData } from "./types/access";
import { isLoaded } from "./types/guards";
import { store, actions } from "./store";

export function registerOnTabOpenHook() {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (!isLoaded(changeInfo)) {
            return // TODO: check is possible to get required data before loading complete
        }
        const { title } = getTabGrantedData(tab)


        console.log(`Tab "${title}" has been loaded.`);
    })

    chrome.tabs.onActivated.addListener(({ tabId, windowId }) => {
        chrome.tabs.get(tabId, tab => {
            console.log('Active page changed to', tab.title, 'with url', tab.url, tab);

            if (!tab.url) {
                console.warn('Active tab not have url')
                return
            }

            store.dispatch(actions.setCurrentPage({
                url: tab.url,
                title: tab.title,
                favIconUrl: tab.favIconUrl
            }))
        })

    })

}


