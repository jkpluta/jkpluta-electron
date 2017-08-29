const path = require('path');

module.exports = {
    entry: {
        'renderer': './js/renderer.js',
        'renderer-node': './js/renderer-node.js',
        'renderer-github': './js/renderer-github.js'
    },
    target: 'web',
    output: {
        path: path.resolve(__dirname, './www/js'),
        filename: '[name].js'
    }
}
