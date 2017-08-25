"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron = require("electron");
var jkp = require("./jkp-utils");
function loadUrl(url) {
    electron.remote.getGlobal('sharedObj').mainWindowLoad(url);
    return true;
}
exports.loadUrl = loadUrl;
function commit(content, name, func) {
    electron.remote.getGlobal('sharedObj').mainWindowCommit(content, name, func);
    return true;
}
exports.commit = commit;
jkp.sharedObj().loadUrl = loadUrl;
jkp.sharedObj().commit = commit;
//# sourceMappingURL=renderer-electron.js.map