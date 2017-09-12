import * as jkp from "./jkp-utils"
export function loadUrl(url: string): boolean
{
    if (url == null || url === '' || url === '#')
        return false;
    if (url.substring(0, 1) === '#')
        (<any>window).location = "./" + url.substring(1) + ".html";
    else
        (<any>window).location = url;
    return true;
}
export function readFromSettings(name: string): any 
{
    if (typeof(Storage) !== "undefined") {
        return localStorage.getItem(name);
    }
    else {
        if (jkp.sharedObj().settings == null)
            jkp.sharedObj().settings = {};
        return jkp.sharedObj().settings[name];
    }
}
export function writeToSettings(name: string, value: any) {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem(name, value);
    }
    else {
        if (jkp.sharedObj().settings == null)
            jkp.sharedObj().settings = {};
        jkp.sharedObj().settings[name] = value;
    }
}
jkp.sharedObj().loadUrl = loadUrl
jkp.sharedObj().readFromSettings = readFromSettings
jkp.sharedObj().writeToSettings = writeToSettings