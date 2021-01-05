import { DataBusMessage, MessageTypes } from "../../data-bus"
import { store } from "./store"

const currentStateMessage = (): DataBusMessage => ({
    type: MessageTypes.GET_PAGE_STORE,
    payload: store.getState()
})

// Need dependency injection, for correctly connect all data stores
export const registerDataBasListener = () => {
    chrome.runtime.onConnect.addListener(port => {
        console.log("Connected", port.name)

        port.postMessage(currentStateMessage())

        store.subscribe(() => {
            console.log('Send new state')
            port.postMessage(currentStateMessage())
        })
    })
}
