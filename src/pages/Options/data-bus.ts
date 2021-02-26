import { DataBusMessage, MessageTypes, ActualPageStorePayload, ChangeSettingsPayload } from "../../eventBus"
import { ExtensionSettings } from "../../settings"
import { store, actions } from "./store"

const port = chrome.runtime.connect({
    name: "Options page"
})

port.onMessage.addListener((msg: DataBusMessage) => {
    console.log("message recieved" + msg)
    if (msg.type === MessageTypes.ACTUAL_PAGE_STORE) {
        const { payload: { settings } } = msg as DataBusMessage<ActualPageStorePayload>
        store.dispatch(actions.setLoadedSettings(settings))
    }
})

export const sendNewSettings = (settings: ExtensionSettings) => {
    const message: DataBusMessage<ChangeSettingsPayload> = {
        type: MessageTypes.CHANGE_SETTINGS,
        payload: { settings }
    }

    port.postMessage(message)
    console.log('Send new state to background', message)
}