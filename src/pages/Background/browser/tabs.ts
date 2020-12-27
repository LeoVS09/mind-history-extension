
export const getCurrentTab = (): Promise<chrome.tabs.Tab> => new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, tabs => {
        if (!tabs.length) {
            reject(new Error("Cannot retrive current tab"));
            return;
        }

        const [tab] = tabs;
        console.log('Currnet tab is', tab.url || tab.pendingUrl, 'and title', tab.title, 'with status', tab.status, tab);
        resolve(tab);
    });
})