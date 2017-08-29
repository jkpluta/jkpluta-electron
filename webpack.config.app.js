const path = require('path');

module.exports = [
    {
        entry: {
          'renderer': './js/renderer.js',
          'renderer-electron': './js/renderer-electron.js',
          'renderer-github': './js/renderer-github.js',
        },
        target: 'electron-renderer',
        output: {
            path: path.resolve(__dirname, './app/js'),
            filename: '[name].js',
            library: 'renderer',
            libraryTarget: 'umd'
        }
    },
    {
        entry: {
            'main': './js/main.js'
        },
        target: 'electron-main',
        externals: {
            'ejs-electron': 'ejs-electron'
        },
        output: {
            path: path.resolve(__dirname, './app/js'),
            filename: '[name].js'
        },
        node: {
            __dirname: false,
            __filename: false
        }  
    }
];