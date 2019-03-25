/**
 * 插件配置文件
 */
const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '../');

module.exports = {
  'ssr-plugin': {
    enable: true,
    path: path.join(ROOT_PATH, '/plugins/ssr-plugin')
  }
};
