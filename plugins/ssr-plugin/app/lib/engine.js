// 为context挂载ssr render方法，这个可以抽离为单独的plugin
const fs = require('fs');
const { createBundleRenderer } = require('vue-server-renderer');
const LRU = require('lru-cache');

const createRenderer = (bundle, options) => {
  return createBundleRenderer(bundle, Object.assign({}, options, {
    runInNewContext: false
  }));
};

class Engine {
  constructor(app) {
    this.app = app;
    this.config = this.app.config;
  }

  get renderer() {
    if (this.createRenderer) {
      return this.createRenderer;
    }
    const SSR_CONFIG = this.config['ssr-plugin']; // 来自config.default.js
    const { bundlePath, templatePath, clientManifestPath } = SSR_CONFIG;
    const bundle = require(bundlePath);
    const template = fs.readFileSync(templatePath, 'utf-8');
    const clientManifest = require(clientManifestPath);
    this.createRenderer = createRenderer(bundle, {
      template,
      clientManifest,
      cache: LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15
      })
    });
    return this.createRenderer;
  }

  renderData(url) {
    const context = { url };
    return new Promise( (resolve, reject) => {
      this.renderer.renderToString(context, (err, html) => {
        if (err) {
          return reject(err);
        }
        resolve(html);
      });
    })
  }
}

module.exports = Engine;