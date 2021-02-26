import qs from 'query-string'

export interface OpenPageOptions {
    index?: number
}

export class Router {
    /** Will create graph tab page with given index, but not show it */
    createGraphPage(nodeUrl: string, index?: number): void {
        const url = chrome.runtime.getURL("graph.html")
        chrome.tabs.create({
            url: nodeUrl ? `${url}?${qs.stringify({ node: nodeUrl })}` : url,
            index,
            active: false, // will create page, but not set tab as active
            selected: false,
        })
    }

    /** Will create options tab and show it to the user*/
    openOptionsPage = () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("options.html") })
    }

}
