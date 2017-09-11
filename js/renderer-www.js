"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jkp = require("./jkp-utils");
function loadUrl(url) {
    if (url.substring(0, 1) === '#')
        window.location = "./" + url.substring(1) + ".html";
    else
        window.location = url;
    return true;
}
exports.loadUrl = loadUrl;
function readFromSettings(name) {
    if (typeof (Storage) !== "undefined") {
        return localStorage.getItem(name);
    }
    else {
        if (jkp.sharedObj().settings == null)
            jkp.sharedObj().settings = {};
        return jkp.sharedObj().settings[name];
    }
}
exports.readFromSettings = readFromSettings;
function writeToSettings(name, value) {
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem(name, value);
    }
    else {
        if (jkp.sharedObj().settings == null)
            jkp.sharedObj().settings = {};
        jkp.sharedObj().settings[name] = value;
    }
}
exports.writeToSettings = writeToSettings;
jkp.sharedObj().loadUrl = loadUrl;
jkp.sharedObj().readFromSettings = readFromSettings;
jkp.sharedObj().writeToSettings = writeToSettings;
//# sourceMappingURL=renderer-www.js.map