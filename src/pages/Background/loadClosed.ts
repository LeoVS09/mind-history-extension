import { getTab } from "./onOpenTab"
import { store, actions } from "./store"


export async function updateClosedPages() {
    const { pages } = store.getState()
    const urls = Object.keys(pages)

    const tabs = (await getTab({ url: urls }))
        .map(tab => tab.url || tab.pendingUrl)
        .filter(url => !!url) as Array<string>

    console.log('Found', tabs.length, 'open tabs, related to known pages, tabs:', tabs)

    store.dispatch(actions.setOpenPages(tabs))
}