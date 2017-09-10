const path = require('path');

module.exports = {
    entry: {
        'renderer': './js/renderer.js',
        'renderer-www': './js/renderer-www.js',
        'renderer-github': './js/renderer-github.js'
    },
    target: 'web',
    output: {
        path: path.resolve(__dirname, '../jkpluta-cordova/www/js'),
        filename: '[name].js'
    }
}
