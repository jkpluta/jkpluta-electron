import * as jkp from "./jkp-utils"
export function loadUrl(url) {
    (<any>window).location = "./" + url.substring(1) + ".html";
    return true;
}
let settings = null
export function readFromSettings(name) {
    return settings[name];
}
export function writeToSettings(name, value) {
    settings[name] = value
}
jkp.sharedObj().loadUrl = loadUrl
jkp.sharedObj().readFromSettings = readFromSettings
jkp.sharedObj().writeToSettings = writeToSettings