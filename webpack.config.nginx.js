const path = require('path');

var dir = '/var/www/html';

module.exports = {
    entry: {
        'renderer': './js/renderer.js',
        'renderer-www': './js/renderer-www.js',
        'renderer-github': './js/renderer-github.js'
    },
    target: 'web',
    output: {
        path: path.resolve(__dirname, dir + '/js'),
        filename: '[name].js'
    }
}
