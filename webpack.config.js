const path = require('path');

module.exports = {
  entry: {
    'renderer': './renderer.js'
  },
  target: 'electron-renderer',
  output: {
    path: path.resolve(__dirname, './webpack'),
    filename: '[name].js'
  }
};