"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jkp = require("./jkp-utils");
function loadUrl(url) {
    window.location = "./" + url.substring(1) + ".html";
    return true;
}
exports.loadUrl = loadUrl;
function readFromSettings(name) {
    if (jkp.sharedObj().settings == null)
        jkp.sharedObj().settings = {};
    return jkp.sharedObj().settings[name];
}
exports.readFromSettings = readFromSettings;
function writeToSettings(name, value) {
    if (jkp.sharedObj().settings == null)
        jkp.sharedObj().settings = {};
    window.settings[name] = value;
}
exports.writeToSettings = writeToSettings;
jkp.sharedObj().loadUrl = loadUrl;
jkp.sharedObj().readFromSettings = readFromSettings;
jkp.sharedObj().writeToSettings = writeToSettings;
//# sourceMappingURL=renderer-www.js.map