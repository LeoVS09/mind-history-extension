import { ChangeSettingsPayload, DataBusMessage, MessageTypes } from "../../data-bus"
import { store, actions } from "./store"

const currentStateMessage = (): DataBusMessage => ({
    type: MessageTypes.ACTUAL_PAGE_STORE,
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

        port.onMessage.addListener((message: DataBusMessage) => {
            if (message.type === MessageTypes.CHANGE_SETTINGS) {
                const { payload: { settings } } = message as DataBusMessage<ChangeSettingsPayload>
                store.dispatch(actions.setSettings(settings))
            }
        })
    })
}
