// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const $ = require('jquery')
const electron = require('electron')

module.exports.runAjax = runAjax = function(sel, base, href) {
  $(sel).html('<img src="./img/spinner.gif">')
  $.ajax({
    url: base + href,
    cache: false,
    success: function(html) {
      updateAjax(sel, base, html)
    },
    error: function(xhr, status, error) {
      $(sel).html('<img src="./img/error.png"> <b>' + status + '</b> <i>' + error + "</i>")
    }
  })
}

module.exports.updateAjax = updateAjax = function(sel, base, html) {
  $(sel).html(html);
  $(sel).find('a').click(function() {
    loadURL($(this).attr('href'))
    return false
  })
}

module.exports.loadURL = loadURL = function(url) {
  electron.remote.getGlobal('sharedObj').loadURL(url)
  return false
}

$(document).ready(function() {
  $("a").click(function() {
    loadURL($(this).attr('href'))
    return false
  })
})
