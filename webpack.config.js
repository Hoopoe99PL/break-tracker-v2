const path = require('path')
const webpack = require('webpack')

const config = {
  entry: path.join(__dirname, './src/js/client.js'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './public/js/')
  },
  devtool: 'source-map'
}

module.exports = config