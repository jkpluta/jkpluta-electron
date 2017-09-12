import * as electron from "electron";
import * as jkp from "./jkp-utils"
export function loadUrl(url: string): boolean 
{
    electron.remote.getGlobal('sharedObj').mainWindowLoad(url);
    return true;
}
export function readFromSettings(name: string): any 
{
    return electron.remote.getGlobal('sharedObj').mainWindowReadFromSettings(name);
}
export function writeToSettings(name: string, value: any): void 
{
    electron.remote.getGlobal('sharedObj').mainWindowWriteToSettings(name, value);
}
jkp.sharedObj().loadUrl = loadUrl
jkp.sharedObj().readFromSettings = readFromSettings
jkp.sharedObj().writeToSettings = writeToSettings