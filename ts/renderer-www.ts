import * as jkp from "./jkp-utils"
export function loadUrl(url: string): boolean
{
    (<any>window).location = "./" + url.substring(1) + ".html";
    return true;
}
export function readFromSettings(name: string): any 
{
    if (jkp.sharedObj().settings == null)
        jkp.sharedObj().settings = {};
    return jkp.sharedObj().settings[name];
}
export function writeToSettings(name: string, value: any) {
    if (jkp.sharedObj().settings == null)
        jkp.sharedObj().settings = {};
    (<any>window).settings[name] = value
}
jkp.sharedObj().loadUrl = loadUrl
jkp.sharedObj().readFromSettings = readFromSettings
jkp.sharedObj().writeToSettings = writeToSettings