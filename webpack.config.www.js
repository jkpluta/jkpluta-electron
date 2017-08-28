const path = require('path');

module.exports = {
    entry: {
        'renderer': './renderer.js',
        'renderer-node': './renderer-node.js',
        'renderer-github': './renderer-github.js'
    },
    target: 'web',
    output: {
        path: path.resolve(__dirname, './www'),
        filename: '[name].js'
    }
}
