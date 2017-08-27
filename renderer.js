"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
window.$ = window.jQuery = $;
var Popper = require("popper.js");
window.Popper = Popper;
require("bootstrap");
var markdown = require("markdown").markdown;
var jkp = require("./jkp-utils");
var iconSize = 16;
var base_url = "https://jkpluta.github.io";
function startAjax(sel, spnr, base, href, func) {
    if (spnr != null)
        $(spnr).html('<img src="./img/spinner.gif">');
    $.ajax({
        url: base + href,
        cache: false,
        success: function (html) {
            $(spnr).html('');
            func(sel, base, html);
        },
        error: function (xhr, status, error) {
            if (spnr != null)
                $(spnr).html('<img src="./img/error.png"> <b>' + status + '</b> <i>' + error + "</i>");
        }
    });
}
exports.startAjax = startAjax;
function start(sel, spnr, href, func) {
    if (spnr != null)
        $(spnr).html('<img src="./img/spinner.gif">');
    $.ajax({
        url: base_url + href,
        cache: false,
        success: function (html) {
            $(spnr).html('');
            func(sel, html);
        },
        error: function (xhr, status, error) {
            if (spnr != null)
                $(spnr).html('<img src="./img/error.png"> <b>' + status + '</b> <i>' + error + "</i>");
        }
    });
}
exports.start = start;
function updateMain(sel, html) {
    var dom = $(html);
    dom.find('#header').remove();
    $(sel).html(dom);
    $(sel).find('a').click(function () {
        loadUrl($(this).attr('href'));
        return false;
    });
}
exports.updateMain = updateMain;
function startMain(href) {
    start("#main", "#spnnr", href, updateMain);
}
exports.startMain = startMain;
window.startMain = startMain;
function updateBookmarks(sel, html) {
    $(sel).html(html);
    $("a[icon_uri]").removeAttr('icon_uri');
    prepareBookmarks($(sel));
}
exports.updateBookmarks = updateBookmarks;
function startBookmarks(href, size) {
    iconSize = size;
    $('#save').click(function () {
        saveBookmarks('<%- data %>');
    });
    $('#refresh').click(function () {
        clearAlert();
        start("#bookmarks", "#bookmarks", href, updateBookmarks);
    });
    $('#link-edit').on('show.bs.modal', function () {
        $('#link-favicon').removeAttr('src');
        $('#link-favicon').hide();
    });
    $('#link-edit').on('shown.bs.modal', function () {
        $(this).find('[autofocus]').focus();
        findFavicon('#link-favicon', '#link-spinner', $('#link-address').val().toString());
    });
    $('#link-address').on('blur', function () {
        findFavicon('#link-favicon', '#link-spinner', $('#link-address').val().toString());
    });
    start('#bookmarks', '#bookmarks', href, updateBookmarks);
}
exports.startBookmarks = startBookmarks;
window.startBookmarks = startBookmarks;
function prepareBookmark(element) {
    var src = null;
    var text = element.text();
    if (element.attr('ICON_URI') != null)
        src = element.attr('ICON_URI');
    else if (element.attr('ICON') != null)
        src = element.attr('ICON');
    if (src != null)
        element.html('<img src="' + src + '" width="' + iconSize.toString() + '" height="' + iconSize.toString() + '" alt="" class="jkp"><span class="jkp"> </span>' + text);
}
exports.prepareBookmark = prepareBookmark;
function prepareBookmarks(element) {
    element.find('a').attr('draggable', "false");
    element.find('a').click(function () {
        // loadURL($(this).attr('href'))
        return false;
    });
    $('dt').off();
    $('dt').attr('draggable', "true");
    $('dt').on('dragover', function (e) {
        var oe = e.originalEvent;
        if (draggable != null) {
            var parent = this;
            while (draggable !== parent && parent != null)
                parent = parent.parentElement;
            if (draggable !== parent)
                e.preventDefault();
        }
        else {
            if (oe.dataTransfer != null)
                e.preventDefault();
        }
        e.stopPropagation();
    });
    $('dt').on('drop', function (e) {
        var oe = e.originalEvent;
        e.preventDefault();
        e.stopPropagation();
        if (draggable != null) {
            var parent = this;
            while (draggable !== parent && parent != null)
                parent = parent.parentElement;
            if (draggable !== parent)
                if ($(this).children('h1, h3').length > 0 && $(draggable).children('h1, h3').length == 0)
                    $(this).children('dl').first().append($(draggable));
                else
                    $(this).before($(draggable));
            $(draggable).css('left', '');
            $(draggable).css('top', '');
        }
        else {
            if (oe.dataTransfer != null) {
                var droppable = this;
                var url = oe.dataTransfer.getData('text/uri-list');
                var title = oe.dataTransfer.getData('vivaldi/x-title');
                if (title == null || title === '')
                    title = url;
                var link = null;
                if ($(this).children('h1, h3').length > 0)
                    link = $('<dt><a></a>').appendTo($(droppable).find('dl:first')).children('a:first');
                else
                    link = $('<dt><a></a>').insertBefore($(droppable)).children('a:first');
                link.attr('href', url);
                link.text(title);
                prepareBookmarks(link.parent());
                findFavicon(link, null, link.attr('href'));
            }
        }
        draggable = null;
    });
    $('dt').on('dragstart', function (e) {
        e.stopPropagation();
        if (draggable == null)
            draggable = this;
        clearAlert();
    });
    $('dt').on('dragend', function (e) {
        e.stopPropagation();
        draggable = null;
    });
    var draggable = null;
    element.find('a[icon_uri]').each(function () {
        prepareBookmark($(this));
    });
    element.find('h1').after('<button title="Zmień..." class="jkp edit-folder btn btn-sm btn-outline-primary"><span class="fa fa-pencil-square-o"></span></button><button title="Odśwież folder..." class="jkp refresh-folder btn btn-sm btn-outline-warning"><span class="fa fa-check-square-o"></span></button> <button title="Dodaj folder..." class="jkp add-folder btn btn-sm btn-outline-success"><span class="fa fa-plus-square-o"></span></button>');
    element.find('h3').after('<button title="Zmień..." class="jkp edit-folder btn btn-sm btn-outline-primary"><span class="fa fa-pencil-square-o"></span></button> <button title="Usuń folder" class="jkp remove-folder btn btn-sm btn-outline-danger"><span class="fa fa-times-rectangle-o"></span></button> <button title="Dodaj folder..." class="jkp create-folder btn btn-sm btn-outline-success"><span class="fa fa-plus-square-o"></span></button><button title="Odśwież folder..." class="jkp refresh-folder btn btn-sm btn-outline-warning"><span class="fa fa-check-square-o"></span></button> <button title="Dodaj zakładkę..." class="jkp add-link btn btn-sm btn-outline-success"><span class="fa fa-plus"></span></button>');
    element.find('a').after(' <button title="Zmień..." class="jkp edit-link btn btn-sm btn-outline-primary"><span class="fa fa-pencil"></span></button> <button title="Usuń zakładkę" class="jkp remove-link btn btn-sm btn-outline-danger"><span class="fa fa-times"></span></button> <button title="Dodaj zakładkę..." class="jkp create-link btn btn-sm btn-outline-success"><span class="fa fa-plus"></span></button>');
    element.find('dd, hr').after(' <button title="Usuń element" class="jkp remove-tag btn btn-sm btn-outline-danger"><span class="fa fa-times-circle"></span></button>');
    element.find('.edit-folder').click(function () {
        var folder = $(this).siblings('h1,h3:first');
        $('#folder-name').val(folder.text());
        $('#folder-edit').modal({});
        $('#folder-apply').off();
        $('#folder-apply').click(function () {
            $('#folder-apply').off();
            folder.text($('#folder-name').val().toString());
            return true;
        });
    });
    element.find('.remove-folder').click(function () {
        $(this).parent().remove();
    });
    element.find('.create-folder').click(function () {
        var parent = $(this).parent();
        $('#folder-name').val('');
        $('#folder-edit').modal({});
        $('#folder-apply').off();
        $('#folder-apply').click(function () {
            $('#folder-apply').off();
            var folder = $('<dt><h3></h3><dl><p></dl><p></dt>').insertBefore(parent).children('h3:first');
            folder.text($('#folder-name').val().toString());
            prepareBookmarks(folder.parent());
            return true;
        });
    });
    element.find('.refresh-folder').click(function () {
        $(this).parent().find('dl:first>dt').each(function () {
            var link = $(this).children('a:first');
            if (link != null)
                findFavicon(link, null, link.attr('href'));
        });
    });
    element.find('.add-folder').click(function () {
        var parent = $(this).parent();
        $('#folder-name').val('');
        $('#folder-edit').modal({});
        $('#folder-apply').off();
        $('#folder-apply').click(function () {
            $('#folder-apply').off();
            var folder = $('<dt><h3></h3><dl><p></dl><p></dt>').appendTo(parent.find('dl:first')).children('h3:first');
            folder.text($('#folder-name').val().toString());
            prepareBookmarks(folder.parent());
            return true;
        });
    });
    element.find('.add-link').click(function () {
        var parent = $(this).parent();
        $('#link-name').val('');
        $('#link-address').val('');
        $('#link-edit').modal({});
        $('#link-apply').off();
        $('#link-apply').click(function () {
            $('#link-apply').off();
            var link = $('<dt><a></a>').appendTo(parent.find('dl:first')).children('a:first');
            link.attr('href', $('#link-address').val().toString());
            if ($("#link-favicon").is(":visible"))
                link.attr('icon_uri', $('#link-favicon').attr('src'));
            link.text($('#link-name').val().toString());
            prepareBookmarks(link.parent());
            return true;
        });
    });
    element.find('.edit-link').click(function () {
        var link = $(this).siblings('a').first();
        $('#link-name').val(link.text());
        $('#link-address').val(link.attr('href'));
        $('#link-edit').modal({});
        $('#link-apply').off();
        $('#link-apply').click(function () {
            $('#link-apply').off();
            link.attr('href', $('#link-address').val().toString());
            if ($("#link-favicon").is(":visible"))
                link.attr('icon_uri', $('#link-favicon').attr('src'));
            link.text($('#link-name').val().toString());
            prepareBookmark(link);
            return true;
        });
    });
    element.find('.remove-link').click(function () {
        $(this).parent().remove();
    });
    element.find('.create-link').click(function () {
        var parent = $(this).parent();
        $('#link-name').val('');
        $('#link-address').val('');
        $('#link-edit').modal({});
        $('#link-apply').off();
        $('#link-apply').click(function () {
            $('#link-apply').off();
            var link = $('<dt><a></a>').insertBefore(parent).children('a:first');
            link.attr('href', $('#link-address').val().toString());
            if ($("#link-favicon").is(":visible"))
                link.attr('icon_uri', $('#link-favicon').attr('src'));
            link.text($('#link-name').val().toString());
            prepareBookmarks(link.parent());
            return true;
        });
    });
    element.find('.remove-tag').click(function () {
        $(this).prev().remove();
        $(this).remove();
    });
}
exports.prepareBookmarks = prepareBookmarks;
function saveBookmarks(name) {
    var bookmarks = $('#bookmarks').clone();
    $('.jkp', bookmarks).remove();
    bookmarks.find('[draggable]').removeAttr('draggable');
    bookmarks.find('[class]').removeAttr('class');
    bookmarks.find('[style]').removeAttr('style');
    bookmarks.find('[clicks]').removeAttr('clicks');
    bookmarks.find('[updateurl]').removeAttr('updateurl');
    bookmarks.find('[color]').removeAttr('color');
    bookmarks.find('[icon]').removeAttr('icon');
    var html = bookmarks.html();
    //html = html.replace(/<([^>]+)>\s*<\/\1>/igm, '<$1>'); 
    html = html.replace(/^\s+/igm, '');
    html = html.replace(/\s+$/igm, '');
    html = html.replace(/\n/igm, '\r\n');
    html = html.replace(/<\/?([a-z]+)/ig, function (match) { return match.toUpperCase(); });
    html = html.replace(/<\/(p|dt)>/ig, '');
    html = html.replace(/<p>/ig, '<p>\r\n');
    html = html.replace(/<dl>/ig, '\r\n<DL>');
    html = html.replace(/<\/dl>/ig, '\r\n</DL>');
    html = html.replace(/\r\s+\n/ig, '\r\n');
    html = html.replace(/(href|add_date|last_visit|folded|last_modified)=/ig, function (match) { return match.toUpperCase(); });
    commit(html, name);
}
exports.saveBookmarks = saveBookmarks;
function findFavicon(sel, spnnr, href) {
    if ($(sel).prop('tagName') == 'IMG')
        $(sel).hide();
    var url = new URL(href);
    startAjax(sel, spnnr, url.origin, url.pathname, updateFavicon);
}
exports.findFavicon = findFavicon;
function updateFavicon(sel, base, html) {
    var dom = $.parseHTML(html, null, false);
    var src = null;
    if (src == null) {
        for (var i = 0; i < dom.length; i++) {
            var nd = dom[i];
            if (nd.nodeName.toUpperCase() === 'LINK') {
                if (nd.rel.toLowerCase() === "shortcut icon") {
                    src = nd.getAttribute('href');
                }
            }
        }
    }
    if (src == null) {
        for (var i = 0; i < dom.length; i++) {
            var nd = dom[i];
            if (nd.nodeName.toUpperCase() === 'LINK') {
                if (nd.rel.toLowerCase() === "icon") {
                    src = nd.getAttribute('href');
                }
            }
        }
    }
    if (src == null) {
        src = base + '/favicon.ico';
    }
    if (src.indexOf('//') >= 0) {
        if (src.startsWith('//')) {
            src = (new URL(base)).protocol.concat(src);
        }
    }
    else {
        if (src.startsWith('/'))
            src = base.concat(src);
        else
            src = base.concat('/').concat(src);
    }
    $.get({
        url: src,
        cache: false,
        success: function (html) {
            setFavicon(sel, src);
        },
        error: function (xhr, status, error) {
            removeFavicon(sel);
        }
    });
}
exports.updateFavicon = updateFavicon;
function setFavicon(sel, src) {
    if ($(sel).prop('tagName') == 'IMG') {
        $(sel).attr('src', src);
        $(sel).show();
    }
    if ($(sel).prop('tagName') == 'A') {
        $(sel).attr('ICON_URI', src);
        prepareBookmark($(sel));
    }
}
exports.setFavicon = setFavicon;
function removeFavicon(sel) {
    if ($(sel).prop('tagName') == 'IMG') {
        $(sel).removeAttr('src');
        $(sel).hide();
    }
    if ($(sel).prop('tagName') == 'A') {
        $(sel).removeAttr('ICON_URI');
        $(sel).html($(sel).text());
    }
}
exports.removeFavicon = removeFavicon;
function toHtml(md) {
    return markdown.toHTML(md);
}
exports.toHtml = toHtml;
function startInfo(href) {
    $('#save').click(function () {
        saveInfo('#md');
    });
    $('#refresh').click(function () {
        clearAlert();
        start("#md", "#spnnr", href, updateInfo);
    });
    start("#md", "#spnnr", href, updateInfo);
}
exports.startInfo = startInfo;
window.startInfo = startInfo;
function updateInfo(sel, html) {
    $('#spnnr').text('Informacje');
    var pattern = /<!--((.|[\r\n])*)-->/igm;
    var match = pattern.exec(html.toString());
    if (match != null && match.length >= 2)
        $('#md').val(match[1]);
}
exports.updateInfo = updateInfo;
function saveInfo(sel) {
    var md = $(sel).val().toString();
    var html = "<html>\n<head>\n  <meta charset=\"utf-8\">\n</head>\n<body>\n  <h1>Informacje</h1>\n  " + toHtml(md) + "\n  <!--" + md + "-->\n</body>\n</html>";
    commit(html, 'info.html');
}
exports.saveInfo = saveInfo;
function loadUrl(url) {
    if (jkp.sharedObj().loadUrl == null)
        return false;
    jkp.sharedObj().loadUrl(url);
    return true;
}
exports.loadUrl = loadUrl;
function commit(content, name) {
    if (jkp.sharedObj().commit == null)
        return;
    jkp.sharedObj().commit(content, name, null);
}
exports.commit = commit;
function authenticate(func, error) {
    if (error == null)
        $('#auth-alert').css('display', 'none');
    else {
        $('#auth-alert').text(error);
        $('#auth-alert').css('display', 'block');
    }
    $('#auth-edit').modal({});
    $('#auth-apply').off();
    $('#auth-apply').click(function () {
        func($('#auth-username').val().toString(), $('#auth-password').val().toString());
        return true;
    });
}
exports.authenticate = authenticate;
jkp.sharedObj().authenticate = authenticate;
function showAlert(text, kind) {
    if (kind == null)
        kind = 'info';
    $('#alert').removeClass();
    $('#alert').addClass("alert alert-" + kind);
    $('#alert').text(text);
    $('#alert').parent().parent().css("display", "block");
}
exports.showAlert = showAlert;
jkp.sharedObj().showAlert = showAlert;
window.showAlert = showAlert;
function clearAlert() {
    $('#alert').removeClass();
    $('#alert').text('');
    $('#alert').parent().parent().css("display", "none");
}
exports.clearAlert = clearAlert;
jkp.sharedObj().clearaAlert = clearAlert;
window.clearaAlert = clearAlert;
function showInfo(text) {
    showAlert(text, 'info');
}
exports.showInfo = showInfo;
$(document).ready(function () {
    $("a").click(function () {
        loadUrl($(this).attr('href'));
        return false;
    });
    $('.modal').on('shown.bs.modal', function () {
        $(this).find('[autofocus]').focus();
    });
});
//# sourceMappingURL=renderer.js.map