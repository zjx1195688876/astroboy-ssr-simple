const H5BaseController = require('@youzan/iron-base/app/controllers/base/H5BaseController');

class RenderController extends H5BaseController {
  async getHtml(ctx) {
    const html = await ctx.renderSSR();
    ctx.body = html;
  }
}

module.exports = RenderController;
