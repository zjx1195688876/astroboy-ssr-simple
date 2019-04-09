/**
 * 扩展 Koa Context 对象
 */
const fs = require('fs');

// 降级为客户端渲染
const renderClient = (name, _this) => {
  let template = '';
  const SSR_CONFIG = _this.app.config['ssr-plugin']; // 来自config.default.js
  const { degradePath = '' } = SSR_CONFIG;
  if (/\.html/.test(degradePath)) { // 返回.html文件，则为SPA模式
    if (!template) { // 如果有tempalte文件了，则直接返回，提升性能
      template = fs.readFileSync(degradePath, 'utf-8');
    }
  } else { // 否则为muti page
    // 测试同步读取和异步读取的qps区别
    template = fs.readFileSync(`${degradePath}/pages/${name}.html`, 'utf-8');
  }

  return template;
};
// 服务端渲染
const render = async (name, _this) => {
  let html = '';
  const renderer = _this.app.ssr.renderer(name);
  const { url = '/' } = _this.req
  while(renderer) {
    try {
      html = await _this.app.ssr.renderData(name, url, renderer);
    } catch (e) { // 单个流量服务端渲染失败，降级为客户端渲染
      html = renderClient(name, _this);
    }
    return html;
  }
};

module.exports = {
  async renderSSR(name = '') {
    if (this.app.isSSR === false) {
      return await renderClient(name, this);
    } else {
      return await render(name, this);
    }
  }
};
