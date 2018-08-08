/**
 * @file Root file for client-side application.
 */

// ========= LIBS =========
import React from "react";
import { render } from "react-dom";
import hagen from "hagen";

// ========= STYLES =========
import "normalize.css"; // normalize browser CSS
import "./index.scss"; // the stylesheet for this page

// ========= UTILS =========
import "./utils/sockets"; // start the websocket connection to the server

// ========= COMPONENTS =========
import App from "./components/App";

// ========= MAIN =========
// log to the console
const sayHello = () => hagen.log(`INDEX`, `Hello, World!`);
sayHello();

// begin rendering the app to the page
render(
    <App ref={(component) => (window.app = component)} />,
    document.querySelector(`#app`)
);
