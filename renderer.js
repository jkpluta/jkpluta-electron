// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const $ = require('jquery')
const electron = require('electron')
window.jQuery = window.$ = $

module.exports.updateAjax = updateAjax = function(sel, base, html) {
  $(sel).html(html);
  $(sel).find('a').click(function() {
    loadURL($(this).attr('href'))
    return false
  })
}

module.exports.startAjax = startAjax = function(sel, spnr, base, href, func) {
  $(spnr).html('<img src="./img/spinner.gif">')
  $.ajax({
    url: base + href,
    cache: false,
    success: function(html) {
      $(spnr).html('')
      func(sel, base, html)
    },
    error: function(xhr, status, error) {
      $(spnr).html('<img src="./img/error.png"> <b>' + status + '</b> <i>' + error + "</i>")
    }
  })
}

module.exports.updateBookmarks = updateBookmarks = function(sel, base, html) {
  $(sel).html(html);
  $(sel).find('a').click(function() {
    // loadURL($(this).attr('href'))
    return false
  })

  $('#bookmarks a').draggable({
    revert: true
  })
  $('#bookmarks h3').draggable({
    revert: true
  })
  
  $('#bookmarks a').parent().droppable({
    accept: 'a, h3',
    greedy: true,
    drop: dropOnItem
  })
  $('#bookmarks a').parent().parent().parent().droppable({
    accept: 'a, h3',
    greedy: true,
    drop: dropOnItems
  })

  var links = $('#icons a[icon]')
  for (var i = 0; i < links.length; i++) {
    var link = links.eq(i)
    link.html('<img src="' + link.attr('ICON') + '" alt="' + link.text() + '" title="' + link.text() + '"><span> </span>' + link.text())
  }
  $('h1').after('<button id="save">Zapisz</button>')
  $('#save').click(function() {
    var fs = require('fs');
    try { 
      fs.writeFileSync('c:\\temp\\temp-icons.html', document.documentElement.outerHTML, 'utf-8')
    }
    catch(e) { 
      alert('Błąd zapisu do pliku!')
    }
  })
}

function dropOnItem( event, ui ) {
  $(this).before(ui.draggable.parent())
  ui.draggable.draggable('option', 'revert', false)
  ui.draggable.css('left', '')
  ui.draggable.css('top', '')
}

function dropOnItems( event, ui ) {
  if (ui.draggable.prop('tagName') === 'A') {
    $(this).children('dl').first().children('dt').last().after(ui.draggable.parent())
  }
  if (ui.draggable.prop('tagName') === 'H3') {
    $(this).before(ui.draggable.parent())
  }
  ui.draggable.draggable('option', 'revert', false)
  ui.draggable.css('left', '')
  ui.draggable.css('top', '')
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
