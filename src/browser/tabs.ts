
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

export const getTab = (queryInfo: chrome.tabs.QueryInfo) => new Promise<Array<chrome.tabs.Tab>>(resolve =>
    chrome.tabs.query(queryInfo, tabs => resolve(tabs || []))
)

export const getTabById = (tabId: number) => new Promise<chrome.tabs.Tab>((resolve, reject) => {
    chrome.tabs.get(tabId, tab => {
        if (tab)
            return resolve(tab)

        reject(new Error('Cannot find tab by id'))
    })
})

export const closePages = async (urls: Array<string>) => {
    const tabs = await getTab({ url: urls })
    const tabIds = tabs
        .map(({ id }) => id)
        .filter(id => !!id) as Array<number>

    await removeTabs(tabIds)

    return tabs
}

export const removeTabs = (tabsIds: Array<number>) => new Promise(resolve => {
    chrome.tabs.remove(tabsIds, resolve)
})

export const getAllTabs = () => new Promise<Array<chrome.tabs.Tab>>(resolve =>
    chrome.tabs.query({}, tabs => resolve(tabs || []))
)

// TODO: use rxjs
export const onActivated = (listener: (info: chrome.tabs.TabActiveInfo) => void) =>
    chrome.tabs.onActivated.addListener(listener)

export const onUpdated = (listener: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void) =>
    chrome.tabs.onUpdated.addListener(listener)
