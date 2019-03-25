/**
 * 渲染页面
 */
module.exports = [
  ['GET', '/index1', 'render.RenderController', 'getHtml'],
  ['GET', '/detail', 'render.RenderController', 'getHtml'],
  ['GET', '/master-detail', 'render.RenderController', 'getHtml'],
];
