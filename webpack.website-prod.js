const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const devConfig = require('./webpack.website-dev.js');

module.exports = merge(devConfig, {
  plugins: [
    new UglifyJsPlugin()
  ]
});
