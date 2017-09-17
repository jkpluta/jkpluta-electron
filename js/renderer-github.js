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
function authorize(title, func) {
    $('#auth-title').text(title);
    $('#auth-edit').modal({});
    $('#auth-apply').off();
    $('#auth-apply').click(function () {
        var username = $('#auth-username').val();
        var password = $('#auth-password').val();
        var token = $('#auth-token').val();
        func(username.toString(), password.toString(), token.toString());
        return true;
    });
}
exports.authorize = authorize;
jkp.sharedObj().authorize = authorize;
function showAlert(text, kind) {
    if (jkp.sharedObj().showAlert == null)
        return;
    jkp.sharedObj().showAlert(text, kind);
}
function clearAlert() {
    if (jkp.sharedObj().clearAlert == null)
        return;
    jkp.sharedObj().clearAlert();
}
function showError(error) {
    if (typeof error === "object") {
        if (error.response != null && error.response.status != null) {
            var status = error.response.status;
            if (status == 0)
                error = "Nie można nawiązać połączenia";
            else if (status == 400)
                error = "Nieprawidłowe zapytanie";
            else if (status == 401) {
                writeToSettings("auth_token", null);
                error = "Nieautoryzowany dostęp";
            }
            else if (status == 500)
                error = "Wewnętrzny błąd serwera; proszę spróbować później";
        }
    }
    showAlert(error, "danger");
}
function commit(content, name) {
    showAlert("Przygotowanie...", "info");
    var github = null;
    var auth_token = readFromSettings("auth_token");
    if (auth_token == null || auth_token == 'null') {
        clearAlert();
        authorize('Logowanie do GitHub', function (username, password, token) {
            if (token !== '') {
                writeToSettings("auth_token", token);
                commit(content, name);
            }
            else {
                if (username === '' || password === '') {
                    showError("Nie wprowadzono nazwy użytkownika lub hasła");
                    return;
                }
                $.ajax({
                    url: 'https://api.github.com/authorizations',
                    method: "POST",
                    dataType: "json",
                    crossDomain: true,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({ "scopes": ["user", "repo", "gist"], "note": "jkpluta-electron-".concat(new Date().toISOString()) }),
                    cache: false,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Accept", "application/vnd.github.v3+json");
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
                        if (jqXHR.status == 0) {
                            github = new GitHub({ username: username, password: password });
                            gitHubCommit(github, content, name);
                        }
                        else if (jqXHR.status == 401)
                            showError("Błędna nazwa użytkownika lub hasło");
                        else
                            showError(status.substring(0, 1).toUpperCase() + status.substring(1) + ': ' + jqXHR.status.toString() + ' "' + error + '"');
                    }
                });
            }
        });
    }
    else {
        github = new GitHub({ token: auth_token });
        gitHubCommit(github, content, name);
    }
}
exports.commit = commit;
jkp.sharedObj().commit = commit;
function gitHubCommit(github, content, name) {
    showAlert("GitHub...", "info");
    var repo = github.getRepo("jkpluta", "jkpluta.github.io");
    repo.getRef("heads/master", function (error, result) {
        if (error != null)
            showError(error);
        else {
            var shaLatestCommit = result.object.sha;
            repo.getCommit(shaLatestCommit, function (error, result) {
                if (error != null)
                    showError(error);
                else {
                    var shaBaseTree = result.sha;
                    repo.createTree([{ "path": name, "mode": "100644", "type": "blob", "content": content }], shaBaseTree, function (error, result) {
                        if (error != null)
                            showError(error);
                        else {
                            var shaNewTree = result.sha;
                            repo.commit(shaLatestCommit, shaNewTree, "jkpluta-electron", function (error, result) {
                                if (error != null)
                                    showError(error);
                                else {
                                    var shaNewCommit = result.sha;
                                    repo.updateHead("heads/master", shaNewCommit, true, function (error, result) {
                                        if (error != null)
                                            showError(error);
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
exports.gitHubCommit = gitHubCommit;
//# sourceMappingURL=renderer-github.js.map