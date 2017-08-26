"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jkp = require("./jkp-utils");
function loadUrl(url) {
    window.location = "./" + url.substring(1) + ".html";
    return true;
}
exports.loadUrl = loadUrl;
var settings = null;
function readFromSettings(name) {
    return settings[name];
}
exports.readFromSettings = readFromSettings;
function writeToSettings(name, value) {
    settings[name] = value;
}
exports.writeToSettings = writeToSettings;
jkp.sharedObj().loadUrl = loadUrl;
jkp.sharedObj().readFromSettings = readFromSettings;
jkp.sharedObj().writeToSettings = writeToSettings;
//# sourceMappingURL=renderer-node.js.map