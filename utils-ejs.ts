import ejs = require('ejs');
import fs = require('fs');
import path = require('path');

export function ejsToHtml(target, template, name, data)
{
    var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'utils-ejs.json'), 'utf8'))
    console.log(config)

    var src = template + '.ejs';
    var dst = path.join(target, name) + '.html';
    var opts = { root: __dirname, cache: false, filename: path.join(__dirname, ',') };
    var tmplt = fs.readFileSync(src, 'utf8')
    var html = ejs.render(tmplt, data, opts)
    fs.writeFileSync(dst, html, { encoding: 'utf-8'})
}
