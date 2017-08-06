var electron = require('electron');
// Module to control application life.
var app = electron.app;
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow;
var path = require('path');
var url = require('url');
var ejs = require('ejs');
var fs = require('fs');
var storage = require('electron-json-storage');
var ejse = require('ejs-electron');
var GitHubApi = require("github");
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;
var settings = {
    auth_token: null
};
var github;
ejse.options({ root: __dirname });
storage.get('settings', function (error, data) {
    if (error)
        throw error;
    if (typeof data.auth_token !== "undefined")
        settings.auth_token = data.auth_token;
});
function createWindow() {
    global.sharedObj = {
        loadURL: loadURL,
        commit: commit
    };
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 900, height: 620, title: 'jkp', icon: path.join(__dirname, 'icon.ico') });
    loadPage('index', null, null);
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    var template = [
        {
            role: 'file',
            label: 'Plik',
            submenu: [
                { role: 'quit', label: "Zakończ" }
            ]
        },
        {
            label: 'Edycja',
            submenu: [
                { role: 'undo', label: 'Cofnij' },
                { role: 'redo', label: 'Ponów' },
                { type: 'separator' },
                { role: 'cut', label: 'Wytnij' },
                { role: 'copy', label: 'Kopiuj' },
                { role: 'paste', label: 'Wklej' },
                { role: 'delete', label: 'Usuń' },
                { role: 'selectall', label: 'Zaznacz wszystko' }
            ]
        },
        {
            label: 'Widok',
            submenu: [
                { role: 'reload', label: 'Odśwież' },
                { role: 'forcereload', label: 'Wymuś odświżenie' },
                { role: 'toggledevtools', label: 'Narzędzia deweloperskie' },
                { type: 'separator' },
                { role: 'resetzoom', label: 'Normalna wielkość' },
                { role: 'zoomin', label: 'Powiększ' },
                { role: 'zoomout', label: 'Pomniejsz' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Pełny ekran' }
            ]
        },
        {
            label: 'Strony',
            submenu: [
                {
                    label: 'Główna',
                    click: function () { loadURL('#main'); }
                },
                {
                    label: 'Informacje',
                    click: function () { loadURL('#info'); }
                },
                {
                    label: 'Ikony',
                    click: function () { loadURL('#icons'); }
                },
                {
                    label: 'Zakładki',
                    click: function () { loadURL('#bookmarks'); }
                }
            ]
        },
        {
            role: 'help',
            label: 'Pomoc',
            submenu: [
                {
                    label: 'O programie',
                    click: function () { loadURL('#about'); }
                }
            ]
        }
    ];
    /*
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services', submenu: [] },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        });
    }
    */
    electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate(template));
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function renderPage(browserWindow, template, title, data) {
    ejse.data({
        title: title,
        data: data
    });
    browserWindow.loadURL(url.format({
        pathname: path.join(__dirname, template + '.ejs'),
        protocol: 'file:',
        slashes: true
    }));
}
function getTitle() {
    return 'Jan K. Pluta';
}
function loadPage(template, title, data) {
    var fullTitle = getTitle();
    if (title !== null)
        fullTitle += ' | ' + title;
    renderPage(mainWindow, template, fullTitle, data);
}
function showAbout() {
    var dialog = new BrowserWindow({ width: 600, height: 200, frame: false, modal: true, skipTaskbar: true, });
    dialog.on('blur', function () {
        dialog.close();
    });
    renderPage(dialog, 'about', getTitle(), 'about?ajax=yes');
}
function loadURL(url) {
    if (url === '#main')
        loadPage('index', null, null);
    else if (url === '#info')
        loadPage('info', 'Informacje', null);
    else if (url === '#icons')
        loadPage('bookmarks', 'Ikony', 'icons.html');
    else if (url === '#bookmarks')
        loadPage('bookmarks', 'Zakładki', 'bookmarks.html');
    else if (url === '#about')
        showAbout();
    else
        mainWindow.loadURL(url);
}
function commit(content, name, func, error) {
    github = new GitHubApi({
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
    if (settings.auth_token == null) {
        func(function (username, password) {
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
                    commit(content, name, func, err);
                }
                else {
                    if (res != null && res.data != null && res.data.token != null) {
                        settings.auth_token = res.data.token;
                        storage.set('settings', settings, function (error) {
                            if (error)
                                throw error;
                        });
                        commit(content, name, func, null);
                    }
                }
            });
        }, error);
    }
    else {
        github.authenticate({
            type: "oauth",
            token: settings.auth_token
        });
        github.users.get({}, function (err, res) {
            if (err != null) {
                settings.auth_token = null;
                storage.set('settings', settings, function (error) {
                    if (error)
                        throw error;
                });
                commit(content, name, func, err);
            }
            else {
                if (res != null) {
                    gitHubCommit(content, name);
                }
            }
        });
    }
}
function gitHubCommit(content, name) {
    github.gitdata.getReference({
        owner: "jkpluta",
        repo: "jkpluta.github.io",
        ref: "heads/master"
    }, function (err, res) {
        var SHA_LATEST_COMMIT = res.data.object.sha;
        github.gitdata.getCommit({
            owner: "jkpluta",
            repo: "jkpluta.github.io",
            sha: SHA_LATEST_COMMIT
        }, function (err, res) {
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
                    var SHA_NEW_COMMIT = res.data.sha;
                    github.gitdata.updateReference({
                        owner: "jkpluta",
                        repo: "jkpluta.github.io",
                        ref: "heads/master",
                        sha: SHA_NEW_COMMIT,
                        force: true
                    }, function (err, res) {
                    });
                });
            });
        });
    });
}
//# sourceMappingURL=main.js.map