/**
 * Websocket Helpers
 * @author John Mars <jmars@deeplocal.com>
 */

// ========= LIBS =========
import hagen from "hagen";

// ========= HELPERS =========

/**
 * Sends a message to a websocket.
 * @param {string} ws - The socket to which the message is sent.
 * @param {string} type - What type of message is being sent. This is parsed by the receiving side.
 * @param {string} body - The body of the message.
 */
export function sendWebsocketMessage(ws, type, body) {
    // if the socket is open, send the message
    if (ws.readyState === 1) {
        ws.send(JSON.stringify({ type, body }));
    } else {
        hagen.log(
            `WS`,
            `Message could not be sent; the destination WebSocket is not open.`
        );
    }
}

/**
 * Parse a message from a websocket.
 * @param {string} message - The stringified JSON message to parse.
 */
export function parseWebsocketMessage(message) {
    const msg = JSON.parse(message);

    return msg;
}

/**
 * Say HELLO to a websocket
 * @param {string} ws - The socket to which the message is sent.
 */
export function sayHello(ws) {
    sendWebsocketMessage(ws, `HELLO`, `Hello!`);
}
