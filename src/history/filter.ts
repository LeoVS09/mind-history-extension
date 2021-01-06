
/** Is page can be tracked and saved */
export const isTrackablePage = (url: string): boolean =>
    !isSpecialPage(url)


const isSpecialPage = (url: string): boolean => url.startsWith('chrome:') || url.startsWith('chrome-extension:')