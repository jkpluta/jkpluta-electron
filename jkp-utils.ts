if ((<any>window).jkpSharedObj == null)
    (<any>window).jkpSharedObj = {}
export function version(): string
{
    return "0.1.0.0"
}
export function sharedObj(): any
{
    return (<any>window).jkpSharedObj;
}
