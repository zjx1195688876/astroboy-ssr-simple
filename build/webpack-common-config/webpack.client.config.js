const merge = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.base.config.js');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const config = require('../webpack.config');

module.exports = merge(baseConfig, {
  entry: path.join(config.ssr, '/entry-client.js'),
  optimization: {
    minimize: true,
    runtimeChunk: {
      name: "manifest"
    },
    splitChunks: {
      chunks: "all",
      minSize: 3000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 5,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        //vue相关框架
        main:{
          test: /[\\/]node_modules[\\/]vue[\\/]/,
          priority: -9,
          name: 'main'
        },
        //除Vue之外其他框架
        vendors: {
          test: /[\\/]node_modules[\\/]?!(vue)[\\/]/,
          priority: -10,
          name: "vendors"
        },
        //业务中可复用的js
        common: {
          test: /[\\/]common[\\/].+\.js$/,
          priority: -11,
          name: "common"
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin({
      filename: `../server/vue-ssr-client-manifest.json`
    })
  ]
})