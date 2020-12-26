
// changeInfo.status
// Tab can be not loaded and not in loading state,
// changeInfo.status can not exists in that case.
export const isLoaded = (changeInfo: chrome.tabs.TabChangeInfo) => changeInfo.status === 'complete'
export const isLoading = (changeInfo: chrome.tabs.TabChangeInfo) => changeInfo.status === 'loading'

