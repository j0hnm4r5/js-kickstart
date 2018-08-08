/**
 * @file Root file for client-side application.
 */

// ========= LIBS =========
import hagen from "hagen"; // a pretty logging library

// ========= STYLES =========
import "normalize.css"; // normalize browser CSS
import "./index.scss"; // the stylesheet for this page

// ========= UTILS =========
import "./utils/sockets"; // start the websocket connection to the server

// ========= MAIN =========
// log to the console
const sayHello = () => hagen.log(`INDEX`, `Hello, World!`);
sayHello();
