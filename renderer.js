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
  $(sel).html(html)
  prepareBookmarks($(sel))
}

module.exports.prepareBookmarks = prepareBookmarks = function(element) {
  element.find('a').click(function() {
    // loadURL($(this).attr('href'))
    return false
  })

  element.find('a').draggable({
    revert: true
  })
  element.find('h3').draggable({
    revert: true
  })
  
  element.find('a').parent().droppable({
    accept: 'a, h3',
    greedy: true,
    drop: dropOnItem
  })
  element.find('dl').parent().droppable({
    accept: 'a, h3',
    greedy: true,
    drop: dropOnItems
  })

  var links = element.find('#bookmarks a[icon]')
  for (var i = 0; i < links.length; i++) {
    var link = links.eq(i)
    link.html('<img src="' + link.attr('ICON') + '" alt="' + link.text() + '" title="' + link.text() + '"><span> </span>' + link.text())
  }
  element.find('h1, h3').after('<button title="Zmień..." class="jkp edit-folder btn btn-sm btn-outline-primary"><span class="fa fa-pencil-square-o"></span></button> <button title="Usuń folder" class="jkp remove-folder btn btn-sm btn-outline-danger"><span class="fa fa-times-rectangle-o"></span></button> <button title="Dodaj folder..." class="jkp create-folder btn btn-sm btn-outline-success"><span class="fa fa-plus-square-o"></span></button>')
  element.find('.edit-folder').click(function() {
    var folder = $(this).siblings('h1, h3').first()
    $('#folder-name').val(folder.text())
    $('#folder-edit').modal({})
    $('#folder-apply').click(function() {
      folder.text($('#folder-name').val())
      $('#folder-apply').off()
      return true
    })
  })
  element.find('.remove-folder').click(function() {
    var folder = $(this).siblings('h1, h3').first()
    folder.parent().remove()
  })
  element.find('.create-folder').click(function() {
    var folder = $(this).siblings('h1, h3').first()
    $('#folder-name').val('')
    $('#folder-edit').modal({})
    $('#folder-apply').click(function() {
      folder.parent().before('<dt><h3>' + $('#folder-name').val() + '</h3><dl><p></dl><p></dt>')
      $('#folder-apply').off()
      prepareBookmarks(folder.parent().prev())
      return true
    })
  })
  element.find('a').after(' <button title="Zmień..." class="jkp edit-link btn btn-sm btn-outline-primary"><span class="fa fa-pencil"></span></button> <button title="Usuń zakładkę" class="jkp remove-link btn btn-sm btn-outline-danger"><span class="fa fa-times"></span></button> <button title="Dodaj zakładkę..." class="jkp create-link btn btn-sm btn-outline-success"><span class="fa fa-plus"></span></button>')
  element.find('.edit-link').click(function() {
    var link = $(this).siblings('a').first()
    $('#link-name').val(link.text())
    $('#link-address').val(link.attr('href'))
    $('#link-edit').modal({})
    $('#link-apply').click(function() {
      link.text($('#link-name').val())
      link.attr('href', $('#link-address').val())
      $('#link-apply').off()
      return true
    })
  })
  element.find('.remove-link').click(function() {
    var link = $(this).siblings('a').first()
    link.parent().remove()
  })
  element.find('.create-link').click(function() {
    var link = $(this).siblings('a').first()
    $('#link-name').val('')
    $('#link-address').val('')
    $('#link-edit').modal({})
    $('#link-apply').click(function() {
      link.parent().before('<dt><a href="' + $('#link-address').val() + '">' + $('#link-name').val() + '</a>')
      $('#link-apply').off()
      prepareBookmarks(link.parent().prev())
      return true
    })
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

module.exports.commit = commit = function(content, name) {
  electron.remote.getGlobal('sharedObj').commit(content, name, function(func) {
    $('#auth-edit').modal({})
    $('#auth-apply').click(function() {
      func($('#auth-username').val(), $('#auth-password').val())
      $('#auth-apply').off()
      return true
    })
  })
}

$(document).ready(function() {
  $("a").click(function() {
    loadURL($(this).attr('href'))
    return false
  })
})
