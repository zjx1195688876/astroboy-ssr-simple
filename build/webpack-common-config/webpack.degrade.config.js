const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const config = require('../webpack.config');
const { ROOT_PATH } = require('./utils');

const STATIC_PATH = config.static ? config.static : path.join(ROOT_PATH, '/static/build');
const VIEW_PATH = config.views ? config.views : path.join(ROOT_PATH, '/app/views');

const isProd = process.env.NODE_ENV === 'prod';

module.exports = merge(baseConfig, {
  entry: {
    app: path.join(ROOT_PATH, '/client/main.js'),
  },
  output: {
    path: config.static ? path.join(config.static, '/degrade/js/') : path.join(ROOT_PATH, '/static/build/degrade/js/'),
    publicPath: '/degrade/js/',
    filename: isProd ? '[name].[chunkhash].js' : '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `${STATIC_PATH}/degrade/pages/index.degrade.html`, // 降级的html静态文件
      template: `${VIEW_PATH}/index.html`,
      title: '\u200E',
    })
  ]
});
