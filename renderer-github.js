"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jkp = require("./jkp-utils");
var GitHub = require("github-api");
var jsBase = require('js-base64');
function readFromSettings(name) {
    if (jkp.sharedObj().readFromSettings == null)
        return null;
    return jkp.sharedObj().readFromSettings(name);
}
function writeToSettings(name, value) {
    if (jkp.sharedObj().writeToSettings == null)
        return;
    jkp.sharedObj().writeToSettings(name, value);
}
function authenticate(func, error) {
    if (jkp.sharedObj().authenticate == null)
        return;
    jkp.sharedObj().authenticate(func, error);
}
function showAlert(text, kind) {
    if (jkp.sharedObj().showAlert == null)
        return;
    jkp.sharedObj().showAlert(text, kind);
}
function decodeError(err) {
    if (err == null)
        return "";
    if (typeof err === 'object') {
        var pattern = /"?message"?: *"([^"]*)"/i;
        var match = pattern.exec(err.toString());
        if (match != null && match.length == 2)
            err = match[1];
    }
    return err.toString();
}
function commit(content, name, error) {
    var github = null;
    var auth_token = readFromSettings("auth_token");
    if (auth_token == null) {
        authenticate(function (username, password) {
            if (username === '')
                username = '---';
            if (password === '')
                password = '---';
            $.ajax({
                url: 'https://api.github.com/authorizations',
                method: "POST",
                dataType: "json",
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ "scopes": ["user", "repo", "gist"], "note": "jkpluta-electron-".concat(new Date().toISOString()) }),
                cache: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + jsBase.Base64.encode(username + ':' + password));
                    xhr.setRequestHeader("X-Mobile", "false");
                    xhr.setRequestHeader("X-GitHub-OTP", "two-factor-code");
                },
                success: function (data) {
                    auth_token = data.token;
                    writeToSettings("auth_token", auth_token);
                    commit(content, name, null);
                },
                error: function (jqXHR, status, error) {
                    commit(content, name, decodeError(error));
                }
            });
        }, error);
    }
    else {
        github = new GitHub({ token: auth_token });
        var me = github.getUser();
        me.getEmails(function (error, result) {
            if (error != null) {
                writeToSettings("auth_token", null);
                commit(content, name, decodeError(error));
            }
            else {
                gitHubCommit(github, content, name);
            }
        });
    }
}
exports.commit = commit;
jkp.sharedObj().commit = commit;
function gitHubCommit(github, content, name) {
    showAlert("GitHub...", "info");
    try {
        var repo = github.getRepo("jkpluta", "jkpluta.github.io");
        repo.getRef("heads/master", function (error, result) {
            if (error != null)
                showAlert(decodeError(error), "error");
            else {
                var shaLatestCommit = result.object.sha;
                repo.getCommit(shaLatestCommit, function (error, result) {
                    if (error != null)
                        showAlert(decodeError(error), "error");
                    else {
                        var shaBaseTree = result.sha;
                        repo.createTree([{ "path": name, "mode": "100644", "type": "blob", "content": content }], shaBaseTree, function (error, result) {
                            if (error != null)
                                showAlert(decodeError(error), "error");
                            else {
                                var shaNewTree = result.sha;
                                repo.commit(shaLatestCommit, shaNewTree, "jkpluta-electron", function (error, result) {
                                    if (error != null)
                                        showAlert(decodeError(error), "error");
                                    else {
                                        var shaNewCommit = result.sha;
                                        repo.updateHead("heads/master", shaNewCommit, true, function (error, result) {
                                            if (error != null)
                                                showAlert(decodeError(error), "error");
                                            else
                                                showAlert("GitHub - Zmiany zostały zapisane", "success");
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    catch (err) {
        showAlert(err, "error");
    }
}
exports.gitHubCommit = gitHubCommit;
//# sourceMappingURL=renderer-github.js.map