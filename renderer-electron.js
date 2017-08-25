"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron = require("electron");
var jkp = require("./jkp-utils");
function loadUrl(url) {
    electron.remote.getGlobal('sharedObj').mainWindowLoad(url);
    return true;
}
exports.loadUrl = loadUrl;
function readFromSettings(name) {
    return electron.remote.getGlobal('sharedObj').mainWindowReadFromSettings(name);
}
exports.readFromSettings = readFromSettings;
function writeToSettings(name, value) {
    electron.remote.getGlobal('sharedObj').mainWindowWriteToSettings(name, value);
}
exports.writeToSettings = writeToSettings;
jkp.sharedObj().loadUrl = loadUrl;
jkp.sharedObj().readFromSettings = readFromSettings;
jkp.sharedObj().writeToSettings = writeToSettings;
//# sourceMappingURL=renderer-electron.js.map