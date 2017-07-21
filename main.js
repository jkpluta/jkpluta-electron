const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const ejs = require('ejs')
const fs = require('fs')
const storage = require('electron-json-storage')
const ejse = require('ejs-electron')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let settings = {
  servers: []
}

ejse.options({ root: __dirname })

storage.get('settings', function(error, data) {
  if (error) throw error;
  if (typeof data.servers !== "undefined")
    settings.servers = data.servers
});

function createWindow () {

  global.sharedObj = { loadURL: loadURL, addServer: addServer, removeServer: removeServer }
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 900, height: 620, title: 'jkp', icon: path.join(__dirname, 'JkpGuardViewer.ico')})

  loadPage('index', null, null)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  const {app, Menu} = require('electron')

  const template = [
    {
      role: 'file',
      label: 'Plik',
      submenu: [
        {role: 'quit', label: "Zakończ"}
      ]
    },
    {
      label: 'Edycja',
      submenu: [
        {role: 'undo', label: 'Cofnij' },
        {role: 'redo', label: 'Ponów' },
        {type: 'separator'},
        {role: 'cut', label: 'Wytnij' },
        {role: 'copy', label: 'Kopiuj' },
        {role: 'paste', label: 'Wklej' },
        {role: 'delete', label: 'Usuń' },
        {role: 'selectall', label: 'Zaznacz wszystko' }
      ]
    },
    {
      label: 'Widok',
      submenu: [
        {role: 'reload', label: 'Odśwież' },
        {role: 'forcereload', label: 'Wymuś odświżenie' },
        {role: 'toggledevtools', label: 'Narzędzia deweloperskie' },
        {type: 'separator'},
        {role: 'resetzoom', label: 'Normalna wielkość' },
        {role: 'zoomin', label: 'Powiększ' },
        {role: 'zoomout', label: 'Pomniejsz' },
        {type: 'separator'},
        {role: 'togglefullscreen', label: 'Pełny ekran' }
      ]
    },
    {
      label: 'Strony',
      submenu: [
        {
          label: 'Główna',
          click () { loadURL('#main') }
        }
        /*,
        {
          label: 'Zadania',
          click () { loadURL('#guard-items') }
        },
        {
          label: 'Usługi',
          click () { loadURL('#service-items') }
        },
        {
          label: 'Błędy i ostrzeżenia',
          click () { loadURL('#warn-items') }
        },
        {
          label: 'Dzienniki',
          click () { loadURL('#log-items') }
        },
        {
          label: 'Serwery',
          click () { loadURL('#server-items') }
        }
        */
      ]
    },
    {
      role: 'help',
      label: 'Pomoc',
      submenu: [
        {
          label: 'O programie',
          click () { loadURL('#about') }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    })

  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function renderPage(browserWindow, template, title, data)
{
  ejse.data({
    title: title,
    data: data,
    servers: settings.servers
  })
  browserWindow.loadURL(path.join(__dirname, template + '.ejs'))
}

function getTitle() {
  return 'Jan K. Pluta'
}

function loadPage(template, title, data)
{
  fullTitle = getTitle()
  if (title !== null)
    fullTitle += ' | ' + title

  renderPage(mainWindow, template, fullTitle, data)
}

function showAbout() {
  var dialog = new BrowserWindow({width: 700, height: 500, frame: false, modal: true, skipTaskbar: true, })
  dialog.on('blur', function() {
    dialog.close()
  })
  renderPage(dialog, 'about', getTitle(), 'about?ajax=yes')
}

function loadURL(url) {
  if (url === '#main')
    loadPage('index', null, null)
  else if (url === '#info')
    loadPage('info', 'Informacje', null)
  else if (url === '#bookmarks')
    loadPage('bookmarks', 'Zakładki', null)
  else if (url === '#about')
    showAbout()
  else
    mainWindow.loadURL(url)
}

function addServer(host, port) {
  settings.servers.push({ host: host, port: port })
  storage.set('settings', settings, function(error) {
    if (error) throw error;
  });
}

function removeServer(host, port) {
  for(var i = 0; i < settings.servers.length; i++) {
    server = settings.servers[i]
    if (server.host === host && server.port === port)
    {
      settings.servers.splice(i, 1)
      break;
    }
  }
  storage.set('settings', settings, function(error) {
    if (error) throw error;
  });
}
