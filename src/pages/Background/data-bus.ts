import { DataBusMessage, MessageTypes } from "../../data-bus";
import { store } from "./store";

export const registerDataBasListener = () => {
    chrome.runtime.onConnect.addListener(port => {
        console.log("Connected", port.name);

        port.onMessage.addListener((msg: DataBusMessage) => {
            console.log("Message from", port.name, 'received', msg);
            if (msg.type === MessageTypes.GET_PAGE_STORE) {
                const response: DataBusMessage = {
                    type: MessageTypes.GET_PAGE_STORE,
                    payload: store.getState()
                }
                port.postMessage(response);
            }

        });
    })
}
