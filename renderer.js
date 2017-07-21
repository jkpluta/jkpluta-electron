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
  $(sel).find("a").click(function() {
    runAjax(sel, base, $(this).attr("href"))
    return false
  })
}

module.exports.loadURL = loadURL = function(url) {
  electron.remote.getGlobal('sharedObj').loadURL(url)
  return false
}

module.exports.removeServer = removeServer = function(sel) {
  host = $(sel).parent().parent().find(":nth-child(1)").html()
  port = $(sel).parent().parent().find(":nth-child(2)").html()
  electron.remote.getGlobal('sharedObj').removeServer(host, port)
  $(sel).parent().parent().remove()
}

module.exports.addServer = addServer = function(sel) {
  host = $(sel).parent().parent().find(":nth-child(1) input").val()
  port = $(sel).parent().parent().find(":nth-child(2) input").val()
  electron.remote.getGlobal('sharedObj').addServer(host, port)
  $(sel).parent().parent().parent().append('<tr><td>' + host + '</td><td>' + port + '</td><td style="text-align:right;"><a class="btn btn-sm btn-default" href="#" role="button" >Usuń</a></td></tr>')
  $(sel).parent().parent().parent().find("tr:last a:last").click(function() {
    destroyServer(this)
    return false
  })
  $(sel).parent().parent().remove()
}

module.exports.destroyServer = destroyServer = function(sel) {
  var tr = $(sel).parent().parent()
  tr.find(":nth-child(1)").css("text-decoration", "line-through")
  tr.find(":nth-child(2)").css("text-decoration", "line-through")
  tr.find("td:last").html('<a class="btn btn-sm btn-danger" href="#" role="button" >OK</a> <a class="btn btn-sm btn-default" href="#" role="button" >Anuluj</a>')
  tr.find("td:last a:first").click(function() {
    removeServer(this)
    return false
  })
  tr.find("td:last :last").click(function() {
    tr.find(":nth-child(1)").css("text-decoration", "inherit")
    tr.find(":nth-child(2)").css("text-decoration", "inherit")
    tr.find("td:last").html('<a class="btn btn-sm btn-default" href="#" role="button" >Usuń</a>')
    tr.find("td:last :last").click(function() {
      destroyServer(this)
      return false
    })
    return false
  })
}

module.exports.createServer = createServer = function(sel) {
  $(sel).parent().parent().parent().append('<tr><td><input type="text"></td><td><input type="text"></td><td style="text-align:right;"><a class="btn btn-sm btn-success" href="#" role="button" >OK</a> <a class="btn btn-sm btn-default" href="#" role="button" >Anuluj</a></td></tr>')
  $(sel).parent().parent().parent().find("tr:last input:first").focus()
  $(sel).parent().parent().parent().find("tr:last a:first").click(function() {
    addServer(this)
    return false
  })
  $(sel).parent().parent().parent().find("tr:last a:last").click(function() {
    $(this).parent().parent().remove()
    return false
  })
}

$(document).ready(function() {
  $("a").click(function() {
    loadURL($(this).attr('href'))
    return false
  })
})
