import { DataBusMessage, GetPageStoreResponsePayload, MessageTypes } from "../../data-bus";
import { store, actions } from "./store";

export const connectToDataBus = () => {
    const port = chrome.runtime.connect({
        name: "New Tab"
    });

    const msg: DataBusMessage = {
        type: MessageTypes.GET_PAGE_STORE,
        payload: undefined
    }

    port.postMessage(msg);
    port.onMessage.addListener((msg: DataBusMessage) => {
        console.log("message recieved" + msg);
        if (msg.type === MessageTypes.GET_PAGE_STORE) {
            const { payload: { pages, history } } = msg as DataBusMessage<GetPageStoreResponsePayload>
            store.dispatch(actions.setHistory(history))
            store.dispatch(actions.setPageDictionary(pages))
        }

    });
}