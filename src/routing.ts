import qs from 'query-string'

export interface OpenPageOptions {
    index?: number
    selected?: boolean
}


export const toGraphPage = (nodeUrl?: string, { index, selected }: OpenPageOptions = {}) => {
    const url = chrome.runtime.getURL("graph.html")
    chrome.tabs.create({
        url: nodeUrl ? `${url}?${qs.stringify({ node: nodeUrl })}` : url,
        index,
        active: selected,
        selected
    })
}

export const toOptionsPage = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("options.html") })
}