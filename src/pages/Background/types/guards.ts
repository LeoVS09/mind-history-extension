
// changeInfo.status
// Tab can be not loaded and not in loading state,
// changeInfo.status can not exists in that case.
export const isLoaded = (changeInfo: chrome.tabs.TabChangeInfo) => changeInfo.status === 'complete'
export const isLoading = (changeInfo: chrome.tabs.TabChangeInfo) => changeInfo.status === 'loading'

// Can be fired on search in google, but also firse "link"
export const isOnFormSubmit = (transition: string) =>
    transition === 'form_submit'

export const isByLink = (transition: string) =>
    transition === 'link'

export const isFromSearchBar = (transition: string) =>
    ['typed', 'generated', 'keyword', 'keyword_generated'].includes(transition)

