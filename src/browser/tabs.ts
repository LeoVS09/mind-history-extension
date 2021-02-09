
/** Get tab which user currently see */
export const getActive = (): Promise<chrome.tabs.Tab> => new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, tabs => {
        if (!tabs.length) {
            reject(new Error("Cannot retrive active tab"))
            return
        }

        const [tab] = tabs
        console.log('Active tab is', tab.url || tab.pendingUrl, 'and title', tab.title, 'with status', tab.status, tab)
        resolve(tab)
    })
})

/** Gets the tab that this script call is being made from. On background will throw exception */
export const getScriptTab = (): Promise<chrome.tabs.Tab> => new Promise((resolve, reject) => {
    chrome.tabs.getCurrent(tab => {
        if (!tab) {
            reject(new Error("Current script not have tab"))
            return
        }

        console.log('Current tab is', tab)
        resolve(tab)
    })
})