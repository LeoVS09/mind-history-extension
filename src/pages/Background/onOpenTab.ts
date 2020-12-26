import { getTabGrantedData } from "./types/access";
import { isLoaded } from "./types/guards";

export function registerOnTabOpenHook() {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (!isLoaded(changeInfo)) {
            return // TODO: check is possible to get required data before loading complete
        }
        const { title } = getTabGrantedData(tab)


        console.log(`Tab "${title}" has been loaded.`);
    })
    console.log('tabs.onUpdated hook registered')

}


