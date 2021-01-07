import { DataBusMessage, ActualPageStorePayload, MessageTypes } from "../../data-bus"
import { store, actions } from "./store"

export const connectToDataBus = () => {
    const port = chrome.runtime.connect({
        name: "Graph page"
    })

    port.onMessage.addListener((msg: DataBusMessage) => {
        console.log("message recieved" + msg)
        if (msg.type === MessageTypes.ACTUAL_PAGE_STORE) {
            const { payload: { pages, history } } = msg as DataBusMessage<ActualPageStorePayload>
            store.dispatch(actions.setHistory(history))
            store.dispatch(actions.setPageDictionary(pages))
        }

    })
}