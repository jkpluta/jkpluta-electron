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

  global.sharedObj = { 
    loadURL: loadURL, 
    commit: commit 
  }
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 900, height: 620, title: 'jkp', icon: path.join(__dirname, 'icon.ico')})

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
        },
        {
          label: 'Informacje',
          click () { loadURL('#info') }
        },
        {
          label: 'Ikony',
          click () { loadURL('#icons') }
        },
        {
          label: 'Zakładki',
          click () { loadURL('#bookmarks') }
        }
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
  browserWindow.loadURL(url.format({
    pathname: path.join(__dirname, template + '.ejs'),
    protocol: 'file:',
    slashes: true
  }))
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
  else if (url === '#icons')
    loadPage('bookmarks', 'Ikony', 'icons.html')
  else if (url === '#bookmarks')
    loadPage('bookmarks', 'Zakładki', 'bookmarks.html')
  else if (url === '#about')
    showAbout()
  else
    mainWindow.loadURL(url)
}

function commit() {


var fs = require('fs');
try { 
  var content = fs.readFileSync('/home/jkp/GitHub/jkpluta.github.io/test.md', 'utf-8')
  console.log(content)
}
catch(e) { 
  alert('Błąd odczytu z pliku!')
}

var GitHubApi = require("github");

console.log('A')

try {
  var github = new GitHubApi({
    // optional 
    debug: true,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub 
    pathPrefix: null, // for some GHEs; none for GitHub 
    headers: {
        "user-agent": "jkpluta" // GitHub is happy with a unique user agent 
    },
    Promise: require('bluebird'),
    followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects 
    timeout: 5000
  })

  console.log('B')
 
  // TODO: optional authentication here depending on desired endpoints. See below in README. 
  github.authenticate({
    type: "oauth",
    token: process.env.GITHUB_TOKEN
  });
  
  console.log('C')

    github.gitdata.getReference({
      owner: "jkpluta",
      repo: "jkpluta.github.io",
      ref: "heads/master"
    },
    function(err, res) {
      var SHA_LATEST_COMMIT = res.data.object.sha
      console.log('SHA_LATEST_COMMIT: ', SHA_LATEST_COMMIT)
      github.gitdata.getCommit({
        owner: "jkpluta",
        repo: "jkpluta.github.io",
        sha: SHA_LATEST_COMMIT
      },
      function(err, res) {
        var SHA_BASE_TREE = res.data.tree.sha
        console.log('SHA_BASE_TREE: ', SHA_BASE_TREE)
        github.gitdata.createTree({
          owner: "jkpluta",
          repo: "jkpluta.github.io",
          tree: [
            {
              "path": "test.md",
              "mode": "100644",
              "type": "blob",
              "content": content
            }
          ],
          base_tree: SHA_BASE_TREE
        },
        function(err, res) {
          var SHA_NEW_TREE = res.data.sha
          console.log('SHA_NEW_TREE: ', SHA_NEW_TREE)

          github.gitdata.createCommit({
            owner: "jkpluta",
            repo: "jkpluta.github.io",
            message: "API Test",
            tree: SHA_NEW_TREE,
            parents: [ SHA_LATEST_COMMIT ],
            author: {
              "name": "Jan K. Pluta",
              "email": "jkpluta@gmail.com",
              "date": new Date().toISOString()
            },
          },
          function(err, res) {
            var SHA_NEW_COMMIT = res.data.sha
            console.log('SHA_NEW_COMMIT: ', SHA_NEW_COMMIT)
            github.gitdata.updateReference({
              owner: "jkpluta",
              repo: "jkpluta.github.io",
              ref: "heads/master",
              sha: SHA_NEW_COMMIT,
              force: true
            },
            function(err, res) {
            })
          })
        })
      })
    })

  /*
  github.gitdata.createCommit({
    owner: "jkpluta",
    repo: "jkpluta.github.io",
    message: "API Test",
    tree: "String",
    parents: "Array",
    author: "Json",
    committer: "Json"
  },
  function(err, res) {
      console.error(err)
      console.log(JSON.stringify(res))
  })
  */

  console.log('D')

}
catch(err) {
  console.error(err)
}
  
}
