"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron = require("electron");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var path = require("path");
var url = require("url");
var fs = require("fs");
var storage = require("electron-json-storage");
var ejsElectron = null;
var ejsPages = null;
try {
    ejsPages = JSON.parse(fs.readFileSync(path.join(__dirname, '../html/ejs.json'), 'utf8'));
    ejsElectron = require('ejs-electron');
    ejsElectron.options({ root: __dirname });
}
catch (err) {
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var settings = {
    auth_token: null
};
storage.get('settings', function (error, data) {
    if (error)
        throw error;
    if (typeof data.auth_token !== "undefined")
        settings.auth_token = data.auth_token;
});
var theme = 'dark';
for (var idx in process.argv) {
    var arg = process.argv[idx];
    if (arg.substring(0, 8) === '--theme=')
        theme = arg.substring(8);
}
var icon = '../img/icon.png';
if (process.platform === 'win32')
    icon = '../img/icon.ico';
function createWindow() {
    global.sharedObj = {
        mainWindowLoad: mainWindowLoad,
        mainWindowReadFromSettings: mainWindowReadFromSettings,
        mainWindowWriteToSettings: mainWindowWriteToSettings,
    };
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 900, height: 620, title: 'jkp', icon: path.join(__dirname, icon) });
    loadPage('index');
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
                    click: function () { loadPage('index'); }
                },
                {
                    label: 'Informacje',
                    click: function () { loadPage('info'); }
                },
                {
                    label: 'Ikony',
                    click: function () { loadPage('icons'); }
                },
                {
                    label: 'Zakładki',
                    click: function () { loadPage('bookmarks'); }
                }
            ]
        },
        {
            role: 'help',
            label: 'Pomoc',
            submenu: [
                {
                    label: 'O programie',
                    click: function () { loadPage('about'); }
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
function renderPage(browserWindow, name) {
    var pageName = '../html/' + name + '.html';
    if (ejsPages != null) {
        var ejsPage = ejsPages[name];
        ejsElectron.data({
            title: ejsPage.title,
            data: ejsPage.data,
            base: "..",
            target: "electron",
            theme: theme
        });
        pageName = '../html/' + ejsPage.template + '.ejs';
    }
    var pageUrl = url.format({
        pathname: path.join(__dirname, pageName),
        protocol: 'file:',
        slashes: true
    });
    browserWindow.loadURL(pageUrl);
}
function loadPage(name) {
    if (name === "about") {
        var dialog = new BrowserWindow({ width: 600, height: 200, frame: false, modal: true, skipTaskbar: true, });
        dialog.on('blur', function () {
            dialog.close();
        });
        renderPage(dialog, name);
        return;
    }
    renderPage(mainWindow, name);
}
function mainWindowLoad(url) {
    if (url.startsWith('#'))
        loadPage(url.substring(1));
    else
        mainWindow.loadURL(url);
}
function mainWindowReadFromSettings(name) {
    return settings[name];
}
function mainWindowWriteToSettings(name, value) {
    settings[name] = value;
    storage.set('settings', settings, function (error) {
    });
}
//# sourceMappingURL=main.js.map