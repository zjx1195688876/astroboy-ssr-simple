const BaseController = require('BaseController');

class RenderController extends BaseController {
  async getHtml(ctx) {
    const html = await ctx.renderSSR();
    ctx.body = html;
  }
}

module.exports = RenderController;
