const path = require('path');

module.exports = [
  {
    entry: {
      'renderer': './renderer.js'
    },
    target: 'electron-renderer',
    output: {
      path: path.resolve(__dirname, './app'),
      filename: 'renderer.js',
      library: 'renderer',
      libraryTarget: 'umd'
    }
  },
  {
    entry: {
      'main': './main.js'
    },
    target: 'electron-main',
    output: {
      path: path.resolve(__dirname, './app'),
      filename: 'main.js'
    }
  }
];