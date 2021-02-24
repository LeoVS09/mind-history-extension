import qs from 'query-string'
import { IRouter } from './pages/Background/closeOldPages/interfaces'

export interface OpenPageOptions {
    index?: number
}

export class Router implements IRouter {
    createGraphPage(nodeUrl: string, index?: number): void {
        const url = chrome.runtime.getURL("graph.html")
        chrome.tabs.create({
            url: nodeUrl ? `${url}?${qs.stringify({ node: nodeUrl })}` : url,
            index,
            active: false, // will create page, but not set tab as active
            selected: false,
        })
    }
    openOptionsPage = () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("options.html") })
    }

}
