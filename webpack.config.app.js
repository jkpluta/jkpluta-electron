const path = require('path');

module.exports = [
    {
        entry: {
          'renderer': './renderer.js',
          'renderer-electron': './renderer-electron.js',
        },
        target: 'electron-renderer',
        output: {
            path: path.resolve(__dirname, './app'),
            filename: '[name].js',
            library: 'renderer',
            libraryTarget: 'umd'
        }
    },
    {
        entry: {
            'main': './main.js'
        },
        target: 'electron-main',
        externals: {
            'ejs-electron': 'ejs-electron'
        },
        output: {
            path: path.resolve(__dirname, './app'),
          filename: '[name].js'
        },
        node: {
            jkpEjs: false,
            __dirname: false,
            __filename: false
        }  
    }
];