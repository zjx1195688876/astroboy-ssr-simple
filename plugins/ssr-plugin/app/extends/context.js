/**
 * 扩展 Koa Context 对象
 */
const fs = require('fs');

// 降级为客户端渲染
const renderClient = (_this) => {
  let template = '';
  if (!template) {
    const SSR_CONFIG = _this.app.config['ssr-plugin']; // 来自config.default.js
    const { degradePath = '' } = SSR_CONFIG;
    template = fs.readFileSync(degradePath, 'utf-8');
  }

  return template;
};

// 服务端渲染
const render = async (_this) => {
  let html = '';
  const { renderer } = _this.app.ssr;
  const { url = '/' } = _this.req
  while(renderer) {
    try {
      html = await _this.app.ssr.renderData(url, renderer);
    } catch (e) { // 单个流量服务端渲染失败，降级为客户端渲染
      html = renderClient(_this);
    }
    return html;
  }
};
module.exports = {
  async renderSSR() {
    console.log('app.isSSR: ', this.app.isSSR);
    if (this.app.isSSR === false) {
      return await renderClient(this);
    } else {
      return await render(this);
    }
  }
};
