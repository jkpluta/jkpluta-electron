const path = require('path');

module.exports = {
    entry: {
        'renderer': './renderer.js',
        'renderer-node': './renderer-node.js',
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, './www'),
        filename: '[name].js',
        library: 'renderer',
        libraryTarget: 'commonjs'
        // libraryTarget: 'umd'
    }
};