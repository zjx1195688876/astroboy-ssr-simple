/**
 * 默认配置文件
 */
const path = require('path');

const ROOT_PATH = process.cwd();

module.exports = {
  'ssr-plugin': {
    bundlePath: path.join(ROOT_PATH, '/static/build/server/vue-ssr-server-bundle.json'), // vue-ssr-server-bundle.json的路径
    templatePath: path.join(ROOT_PATH, '/app/views/index.html'), // 服务端渲染的模版文件路径
    clientManifestPath: path.join(ROOT_PATH, '/static/build/server/vue-ssr-client-manifest.json'), // vue-ssr-client-manifest.json的路径
    degradePath: path.join(ROOT_PATH, '/static/build/degrade/pages/index.degrade.html') // 降级为SPA的文件
  },

};
