const path = require('path');
const fs = require('fs');
const URL = require('url');
const ROOT_PATH = process.cwd();
const MOCK_PATH = path.join(ROOT_PATH, '/mock');
// 适用于SSR的时候，mock node的请求转发
const isJSON = (url) => {
  return /\.json/.test(url);
}

// 校验是否有对应的mock文件
const mockJson = (ctx) => {
  const pathname = URL.parse(ctx.url).pathname;
  const filePath = path.join(MOCK_PATH, pathname);
  const fileContent = fs.readFileSync(filePath); // 读取到Buffer
  if (fileContent) {
    const json = fileContent.toString('utf8'); // Buffer转成JSON
    ctx.body = json;
    return true;
  }
  return false;
}

module.exports = (options = {}, app) => {
  return async function mock(ctx, next) {
    if (isJSON(ctx.url) && mockJson(ctx)) { // 拦截ajax请求，如果有mock文件夹则返回mock数据
      return;
    }

    await next();
  }
};
