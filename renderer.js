// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const $ = require('jquery')
const electron = require('electron')
const url = require('url')
window.jQuery = window.$ = $

let iconSize = 16

module.exports.updateAjax = updateAjax = function(sel, base, html) {
  $(sel).html(html);
  $(sel).find('a').click(function() {
    loadURL($(this).attr('href'))
    return false
  })
}

module.exports.startAjax = startAjax = function(sel, spnr, base, href, func) {
  if (spnr != null)
    $(spnr).html('<img src="./img/spinner.gif">')
  $.ajax({
    url: base + href,
    cache: false,
    success: function(html) {
      $(spnr).html('')
      func(sel, base, html)
    },
    error: function(xhr, status, error) {
      if (spnr != null) 
        $(spnr).html('<img src="./img/error.png"> <b>' + status + '</b> <i>' + error + "</i>")
    }
  })
}

module.exports.updateBookmarks = updateBookmarks = function(sel, base, html) {
  $(sel).html(html)
  prepareBookmarks($(sel))
}

module.exports.prepareBookmark = prepareBookmark = function(element) {
  var src = null
  var text = element.text()
  if (element.attr('ICON_URI') != null)
    src = element.attr('ICON_URI')
  else
    if (element.attr('ICON') != null)
      src = element.attr('ICON')
  if (src != null) {
    element.html('<img src="' + src + '" width="' + iconSize.toString() + '" height="' + iconSize.toString() + '" alt="' + text + '" class="jkp"><span class="jkp"> </span>' + text)
  }
}

module.exports.prepareBookmarks = prepareBookmarks = function(element) {
  element.find('a').click(function() {
    // loadURL($(this).attr('href'))
    return false
  })

        $('#drag-file').css('border', 'solid 1px orange')

        $('#drag-file').on('dragover', () => {
            return false;
        })

        $('#drag-file').on('dragleave', () => {
            return false;
        })

        $('#drag-file').on('dragend', () => {
            return false;
        })

        $('#drag-file').on('drop', function(e) {

            alert(typeof e.originalEvent)

            e.preventDefault();

            var data = e.originalEvent.dataTransfer.items
            for(var i = 0; i < data.length; i++) {
              alert (data[i].type)
              if (data[i].type === 'text/uri-list') {
                data[i].getAsString(function(s) {
                  alert(s)
                })
              }
            }

            return false;
        })
        
        $('#drag-file').css('border', 'solid 1px red')
        $('h3').attr('draggable', true)
  
/*
  element.find('a').draggable({
    revert: 'invalid',
    cursor: "move"
  })
  element.find('h3').draggable({
    revert: 'invalid',
    cursor: "move"
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
*/

  element.find('a[icon_uri], a[icon]').each(function() {
    prepareBookmark($(this))
  })
  element.find('h1').after('<button title="Zmień..." class="jkp edit-folder btn btn-sm btn-outline-primary"><span class="fa fa-pencil-square-o"></span></button> <button title="Dodaj folder..." class="jkp add-folder btn btn-sm btn-outline-success"><span class="fa fa-plus-square-o"></span></button>')
  element.find('h3').after('<button title="Zmień..." class="jkp edit-folder btn btn-sm btn-outline-primary"><span class="fa fa-pencil-square-o"></span></button> <button title="Usuń folder" class="jkp remove-folder btn btn-sm btn-outline-danger"><span class="fa fa-times-rectangle-o"></span></button> <button title="Dodaj folder..." class="jkp create-folder btn btn-sm btn-outline-success"><span class="fa fa-plus-square-o"></span></button><button title="Odśwież folder..." class="jkp refresh-folder btn btn-sm btn-outline-warning"><span class="fa fa-check-square-o"></span></button> <button title="Dodaj zakładkę..." class="jkp add-link btn btn-sm btn-outline-success"><span class="fa fa-plus"></span></button>')
  element.find('.edit-folder').click(function() {
    var folder = $(this).siblings('h1, h3').first()
    $('#folder-name').val(folder.text())
    $('#folder-edit').modal({})
    $('#folder-apply').off()
    $('#folder-apply').click(function() {
      $('#folder-apply').off()
      folder.text($('#folder-name').val())
      return true
    })
  })
  element.find('.remove-folder').click(function() {
    var folder = $(this).siblings('h1, h3').first()
    folder.parent().remove()
  })
  element.find('.create-folder').click(function() {
    var exfolder = $(this).siblings('h3').first()
    $('#folder-name').val('')
    $('#folder-edit').modal({})
    $('#folder-apply').off()
    $('#folder-apply').click(function() {
      $('#folder-apply').off()
      exfolder.parent().before('<dt><h3></h3><dl><p></dl><p></dt>')
      var folder = exfolder.parent().prev().children('h3').first()
      folder.text($('#folder-name').val())
      prepareBookmarks(folder.parent())
      return true
    })
  })
  element.find('.refresh-folder').click(function() {
    var folder = $(this).siblings('h3').first()
    folder.parent().children('dl').first().children('dt').each(function() {
      var link = $(this).children('a').first()
      if (link != null)
        findFavicon(link, null, link.attr('href'))
    })
  })
  element.find('.add-folder').click(function() {
    var exfolder = $(this).siblings('h1').first()
    $('#folder-name').val('')
    $('#folder-edit').modal({})
    $('#folder-apply').off()
    $('#folder-apply').click(function() {
      $('#folder-apply').off()
      exfolder.parent().children('dl').first().append('<dt><h3></h3><dl><p></dl><p></dt>')
      var folder = exfolder.parent().children('dl').first().children('dt').last().children('h3').first()
      folder.text($('#folder-name').val())
      prepareBookmarks(folder.parent())
      return true
    })
  })
  element.find('.add-link').click(function() {
    var folder = $(this).siblings('h1, h3').first()
    $('#link-name').val('')
    $('#link-address').val('')
    $('#link-edit').modal({})
    $('#link-apply').off()
    $('#link-apply').click(function() {
      $('#link-apply').off()
      folder.parent().children('dl').first().append('<dt><a></a>')
      var link = folder.parent().children('dl').first().children('dt').last().children('a').first()
      link.attr('href', $('#link-address').val())
      if ($("#link-favicon").is(":visible"))
        link.attr('icon_uri', $('#link-favicon').attr('src'))
      link.text($('#link-name').val())
      prepareBookmarks(link.parent())
      return true
    })
  })
  element.find('a').after(' <button title="Zmień..." class="jkp edit-link btn btn-sm btn-outline-primary"><span class="fa fa-pencil"></span></button> <button title="Usuń zakładkę" class="jkp remove-link btn btn-sm btn-outline-danger"><span class="fa fa-times"></span></button> <button title="Dodaj zakładkę..." class="jkp create-link btn btn-sm btn-outline-success"><span class="fa fa-plus"></span></button>')
  element.find('.edit-link').click(function() {
    var link = $(this).siblings('a').first()
    $('#link-name').val(link.text())
    $('#link-address').val(link.attr('href'))
    $('#link-edit').modal({})
    $('#link-apply').off()
    $('#link-apply').click(function() {
      $('#link-apply').off()
      link.attr('href', $('#link-address').val())
      if ($("#link-favicon").is(":visible"))
        link.attr('icon_uri', $('#link-favicon').attr('src'))
      link.text($('#link-name').val())
      prepareBookmark(link)
      return true
    })
  })
  element.find('.remove-link').click(function() {
    var link = $(this).siblings('a').first()
    link.parent().remove()
  })
  element.find('.create-link').click(function() {
    var exlink = $(this).siblings('a').first()
    $('#link-name').val('')
    $('#link-address').val('')
    $('#link-edit').modal({})
    $('#link-apply').off()
    $('#link-apply').click(function() {
      $('#link-apply').off()
      exlink.parent().before('<dt><a></a>')
      link = exlink.parent().prev().children('a').first()
      link.attr('href', $('#link-address').val())
      if ($("#link-favicon").is(":visible"))
        link.attr('icon_uri', $('#link-favicon').attr('src'))
      link.text($('#link-name').val())
      prepareBookmarks(link.parent())
      return true
    })
  })
  element.find('dd, hr').after(' <button title="Usuń element" class="jkp remove-tag btn btn-sm btn-outline-danger"><span class="fa fa-times-circle"></span></button>')
  element.find('.remove-tag').click(function() {
    $(this).prev().remove()
    $(this).remove()
  })
}

function dropOnItem( event, ui ) {
  $(this).before(ui.draggable.parent())
  ui.draggable.css('left', '')
  ui.draggable.css('top', '')
}

function dropOnItems( event, ui ) {
  if (ui.draggable.prop('tagName') === 'A') {
    $(this).children('dl').first().append(ui.draggable.parent())
  }
  if (ui.draggable.prop('tagName') === 'H3') {
    $(this).before(ui.draggable.parent())
  }
  ui.draggable.css('left', '')
  ui.draggable.css('top', '')
}

module.exports.findFavicon = findFavicon = function(sel, spnnr, href) {
  if ($(sel).prop('tagName') == 'IMG')
    $(sel).hide()

  var url = new URL(href)
  startAjax(sel, spnnr, url.origin, url.pathname, updateFavicon)
}

module.exports.updateFavicon = updateFavicon = function(sel, base, html) {
  var dom = $.parseHTML(html, null, false)
  var src = null
  if (src == null) {
    for(i = 0; i < dom.length; i++) {
      if (dom[i].nodeName.toUpperCase() === 'LINK') {
        if (dom[i].rel.toLowerCase() === "shortcut icon") {
          src = dom[i].getAttribute('href')
        }
      }
    }
  }
  if (src == null) {
    for(i = 0; i < dom.length; i++) {
      if (dom[i].nodeName.toUpperCase() === 'LINK') {
        if (dom[i].rel.toLowerCase() === "icon") {
          src = dom[i].getAttribute('href')
        }
      }
    }
  }
  if (src == null) {
    src = '/favicon.ico'
  }
  if (src != null) {
    if (src.indexOf('//') >= 0) {
      if(src.startsWith('//')) {
        src = (new URL(base)).protocol.concat(src)
      }
    } else {
      if (src.startsWith('/'))
        src = base.concat(src)
      else
        src = base.concat('/').concat(src)
    }
    if ($(sel).prop('tagName') == 'IMG') {
      $(sel).attr('src', src)
      $(sel).show()
    }
    if ($(sel).prop('tagName') == 'A') {
      $(sel).attr('ICON_URI', src)
      prepareBookmark($(sel))
    }
  }
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

module.exports.init = init = function(size) {
  iconSize = size
}

$(document).ready(function() {
  $("a").click(function() {
    loadURL($(this).attr('href'))
    return false
  })
  $('.modal').on('shown.bs.modal', function () {
    $(this).find('[autofocus]').focus();
  })
})
