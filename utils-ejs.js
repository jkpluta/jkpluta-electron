"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ejs = require("ejs");
var fs = require("fs");
var path = require("path");
function ejsToHtml(target) {
    var ejsPages = JSON.parse(fs.readFileSync(path.join(__dirname, 'utils-ejs.json'), 'utf8'));
    console.log(ejsPages);
    var opts = { root: __dirname, cache: false, filename: path.join(__dirname, ',') };
    for (var ejsName in ejsPages) {
        console.log('-->');
        console.log(ejsName);
        var ejsPage = ejsPages[ejsName];
        var src = ejsPage.template + '.ejs';
        var dst = path.join(__dirname, target, ejsName) + '.html';
        var tmplt = fs.readFileSync(src, 'utf8');
        var html = ejs.render(tmplt, ejsPage, opts);
        fs.writeFileSync(dst, html, { encoding: 'utf-8' });
    }
}
exports.ejsToHtml = ejsToHtml;
//# sourceMappingURL=utils-ejs.js.map