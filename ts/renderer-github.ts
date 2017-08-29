import * as jkp from './jkp-utils'
var GitHub = require("github-api");
var jsBase = require('js-base64')
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
function authenticate(func: (username: string, password: string) => void): void
{
    if (jkp.sharedObj().authenticate == null)
        return;
    jkp.sharedObj().authenticate(func);
}
function showAlert(text: string, kind?: string): void
{
    if (jkp.sharedObj().showAlert == null)
        return;
    jkp.sharedObj().showAlert(text, kind);
}
export function commit(content: string, name: string): void 
{
    showAlert("Przygotowanie...", "info")
    var github = null;
    var auth_token = readFromSettings("auth_token")
    if (auth_token == null) {
        authenticate(function (username, password) {
            if (username === '' || password === '') {
                showAlert("Nie wprowadzono nazwy użytkownika lub hasła", "danger");
                return;
            }
            $.ajax({
                url: 'http://api.github.com/authorizations',
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
                    commit(content, name);
                },
                error: function (jqXHR, status, error) {
                    if (jqXHR.status == 401)
                        showAlert("Błędna nazwa użytkownika lub hasło", "danger");
                    else 
                        showAlert(status.substring(0, 1).toUpperCase() + status.substring(1) + ': ' + jqXHR.status.toString() + ' "' + error + '"', "danger");
                    return;
                }
            });
        });
    }
    else {
        github = new GitHub({ token: auth_token });
        const me = github.getUser();
        me.getEmails(function(error, result) {
            if (error != null) {
                if (error.response != null && error.response.status == 401) {
                    writeToSettings("auth_token", null);
                    commit(content, name);
                } else
                    showAlert(error, "danger");
            }
            else 
                gitHubCommit(github, content, name);
        });
    }
}
jkp.sharedObj().commit = commit
export function gitHubCommit(github: any, content: string, name: string): void 
{
    showAlert("GitHub...", "info")
    var repo = github.getRepo("jkpluta", "jkpluta.github.io");
    repo.getRef("heads/master", function(error, result) {
        if (error != null)
            showAlert(error, "danger");
        else {
            var shaLatestCommit = result.object.sha;
            repo.getCommit(shaLatestCommit, function(error, result) {
                if (error != null)
                    showAlert(error, "danger");
                else {
                    var shaBaseTree = result.sha;
                    repo.createTree([ { "path": name, "mode": "100644", "type": "blob", "content": content } ], shaBaseTree, function(error, result) {
                        if (error != null)
                            showAlert(error, "danger");
                        else {
                            var shaNewTree = result.sha;
                            repo.commit(shaLatestCommit , shaNewTree, "jkpluta-electron", function(error, result) {
                                if (error != null)
                                    showAlert(error, "danger");
                                else {
                                    var shaNewCommit = result.sha;
                                    repo.updateHead("heads/master", shaNewCommit , true, function(error, result) {
                                        if (error != null)
                                            showAlert(error, "danger");
                                        else 
                                            showAlert("GitHub - Zmiany zostały zapisane", "success")
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
