/**
 * @file A shim in front of `app.js` that gives Node support for ES Modules.
 * @author John Mars <jmars@deeplocal.com>
 */

// add the .env file to process.env
require(`dotenv`).config();

// active support for es modules, and run app.js
// eslint-disable-next-line no-global-assign
require = require(`esm`)(module);
module.exports = require(`./app`);
