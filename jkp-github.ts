import * as jkp from './jkp-utils'
var GitHubApi = require("github");
function readFromSettings(name: string): any 
{
    if (jkp.sharedObj().readFromSettings == null)
        return null;
    return jkp.sharedObj().readFromSettings(name);
}
function writeToSettings(name: string, value: any): void 
{
    if (jkp.sharedObj().writeToSettings == null)
        return;
    jkp.sharedObj().writeToSettings(name, value);
}
function authenticate(func: (username: string, password: string) => void, error: string): void
{
    if (jkp.sharedObj().authenticate == null)
        return;
    jkp.sharedObj().authenticate(func, error);
}
function showAlert(text: string, kind: string): void
{
    if (jkp.sharedObj().showAlert == null)
        return;
    jkp.sharedObj().showAlert(text, kind);
}
function decodeError(err: any): string 
{
    if (typeof err === 'object') {
        var pattern = /"?message"?: *"([^"]*)"/i;
        var match = pattern.exec(err.toString());
        if (match != null && match.length == 2)
            err = match[1];
    }
    return err;
}
export function commit(content: string, name: string, error: string): void 
{
    var github = new GitHubApi({
        // optional 
        debug: false,
        protocol: "https",
        host: "api.github.com",
        pathPrefix: null,
        headers: {
            "user-agent": "jkpluta" // GitHub is happy with a unique user agent 
        },
        Promise: require('bluebird'),
        followRedirects: false,
        timeout: 5000
    });
    var auth_token = readFromSettings("auth_token")
    if (auth_token == null) {
        authenticate(function (username, password) {
            if (username !== '' && password !== '') {
                github.authenticate({
                    type: "basic",
                    username: username,
                    password: password
                });
            }
            github.authorization.create({
                scopes: ["user", "repo", "gist"],
                note: "jkpluta-electron-".concat(new Date().toISOString()),
                headers: {
                    "X-GitHub-OTP": "two-factor-code"
                }
            }, function (err, res) {
                if (err != null) {
                    commit(content, name, decodeError(err));
                }
                else {
                    if (res != null && res.data != null && res.data.token != null) {
                        auth_token = res.data.token
                        writeToSettings("auth_token", auth_token);
                        commit(content, name, null);
                    }
                }
            });
        }, error);
    }
    else {
        github.authenticate({
            type: "oauth",
            token: auth_token
        });
        github.users.get({}, function (err, res) {
            if (err != null) {
                writeToSettings("auth_token", null);
                commit(content, name, decodeError(err));
            }
            else {
                if (res != null) {
                    gitHubCommit(github, content, name);
                }
            }
        });
    }
}
jkp.sharedObj().commit = commit
export function gitHubCommit(github: any, content: string, name: string): void 
{
    showAlert("GitHub...", "info")
    github.gitdata.getReference({
        owner: "jkpluta",
        repo: "jkpluta.github.io",
        ref: "heads/master"
    }, function (err, res) {
        if (err != null) {
            showAlert(decodeError(err), "error");
            return;
        }
        var SHA_LATEST_COMMIT = res.data.object.sha;
        github.gitdata.getCommit({
            owner: "jkpluta",
            repo: "jkpluta.github.io",
            sha: SHA_LATEST_COMMIT
        }, function (err, res) {
            if (err != null) {
                showAlert(decodeError(err), "error");
                return;
            }
            var SHA_BASE_TREE = res.data.tree.sha;
            github.gitdata.createTree({
                owner: "jkpluta",
                repo: "jkpluta.github.io",
                tree: [
                    {
                        "path": name,
                        "mode": "100644",
                        "type": "blob",
                        "content": content
                    }
                ],
                base_tree: SHA_BASE_TREE
            }, function (err, res) {
                if (err != null) {
                    showAlert(decodeError(err), "error");
                    return;
                }
                var SHA_NEW_TREE = res.data.sha;
                github.gitdata.createCommit({
                    owner: "jkpluta",
                    repo: "jkpluta.github.io",
                    message: "jkpluta-electron",
                    tree: SHA_NEW_TREE,
                    parents: [SHA_LATEST_COMMIT],
                    author: {
                        "name": "Jan K. Pluta",
                        "email": "jkpluta@gmail.com",
                        "date": new Date().toISOString()
                    },
                }, function (err, res) {
                    if (err != null) {
                        showAlert(decodeError(err), "error");
                        return;
                    }
                    var SHA_NEW_COMMIT = res.data.sha;
                    github.gitdata.updateReference({
                        owner: "jkpluta",
                        repo: "jkpluta.github.io",
                        ref: "heads/master",
                        sha: SHA_NEW_COMMIT,
                        force: true
                    }, function (err, res) {
                        if (err == null)
                            showAlert("GitHub - Zmiany zostały zapisane", "success")
                    });
                });
            });
        });
    });
}
