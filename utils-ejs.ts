import ejs = require('ejs');
import fs = require('fs');
import path = require('path');

export function ejsToHtml(target)
{
    var ejsPages = JSON.parse(fs.readFileSync(path.join(__dirname, 'utils-ejs.json'), 'utf8'))
    console.log(ejsPages)

    var opts = { root: __dirname, cache: false, filename: path.join(__dirname, ',') };
    for(var ejsName in ejsPages) {
        console.log('-->')
        console.log(ejsName)
        var ejsPage = ejsPages[ejsName]
        var src = ejsPage.template + '.ejs';
        var dst = path.join(__dirname, target, ejsName) + '.html';
        var tmplt = fs.readFileSync(src, 'utf8')
        var html = ejs.render(tmplt, ejsPage, opts)

        fs.writeFileSync(dst, html, { encoding: 'utf-8'})
    }
}
