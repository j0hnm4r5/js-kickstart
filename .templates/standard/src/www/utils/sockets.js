// ========= LIBS =========
import * as hagen from "hagen";

// ========= WEBSOCKETS =========
import {
    sendWebsocketMessage,
    parseWebsocketMessage,
} from "../../common/libs/websocket.helpers";

// create a new connection to the server websocket
const socket = new WebSocket(
    `ws://localhost:${process.env.SOCKET_PORT}`
);

// listen for the connection to be opened
socket.addEventListener(`open`, () =>
    hagen.log(`WS`, `Connected to the Server`)
);

// whenever a message is received
socket.addEventListener(`message`, (event) => {
    // parse it into a readable format
    const msg = parseWebsocketMessage(event.data);

    // route it to its correct destination
    switch (msg.type) {
        case `HELLO`:
            hagen.log(
                `WS`,
                `Server said HELLO. Saying HELLO back @ ${Date.now()}!`
            );
            sendWebsocketMessage(
                socket,
                `HELLO`,
                `And Hello to you back, Server!`
            );
            break;

        case `MSG`:
            hagen.log(`WS`, `Received a MSG: ${msg.body}`);
            break;

        default:
            hagen.warn(`WS`, `Unknown message received!`);
            break;
    }
});
