import * as electron from  "electron";
import * as jkp from "./jkp-utils"
export function loadUrl(url) {
    electron.remote.getGlobal('sharedObj').mainWindowLoad(url);
    return true;
}
export function commit(content, name, func) {
    electron.remote.getGlobal('sharedObj').mainWindowCommit(content, name, func);
    return true;
}
jkp.sharedObj().loadUrl = loadUrl
jkp.sharedObj().commit = commit