/**
 * Manages websocket connections.
 * @author John Mars <jmars@deeplocal.com>
 */

// ========= LIBS =========
import WebSocket from "ws";
import hagen from "hagen";
import {
    sendWebsocketMessage,
    parseWebsocketMessage,
    sayHello,
} from "../../common/libs/websocket.helpers";

// ========= INITIALIZATION =========

// connect as the ws-server to the browser ws-client
hagen.log(`WS`, `Connecting to Client`);
const socket = new WebSocket.Server({
    port: process.env.SOCKET_PORT,
});

// ========= COMMUNICATION =========
// when the connection to the Browser is opened
let wsToBrowser;
socket.on(`connection`, (ws) => {
    wsToBrowser = ws;

    // say hello to the client
    hagen.log(
        `WS`,
        `The client connected. Saying HELLO @ ${Date.now()}!`
    );
    sayHello(ws);

    // whenever a message is received from the client
    ws.on(`message`, (message) => {
        const msg = parseWebsocketMessage(message);

        switch (msg.type) {
            case `HELLO`:
                hagen.log(
                    `WS`,
                    `Client said HELLO back @ ${Date.now()}!`
                );
                break;
            default:
                break;
        }
    });
});

/**
 * Send a MSG message to the client
 * @param {string} message
 */
export function sendMessageToClient(message) {
    hagen.log(`WS`, `Sending to Browser: ${message}`);
    sendWebsocketMessage(wsToBrowser, `MSG`, message);
}
