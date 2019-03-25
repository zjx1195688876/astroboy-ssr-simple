const path = require('path');

const isProd = process.env.NODE_ENV === 'prod';

const ROOT_PATH = process.cwd();
const PAGE_PATH = path.join(ROOT_PATH, '/client/pages');
const APP_PATH = path.join(ROOT_PATH, '/app');
const CLIENT_PATH = path.join(ROOT_PATH, '/client');
const SSR_PATH = path.join(ROOT_PATH, '/.ssr');
const STATIC_PATH = isProd ? path.join(ROOT_PATH, '/static/build') : path.join(ROOT_PATH, '/static/local');

module.exports = {
  alias: {
    '@app': APP_PATH,
    '@client': CLIENT_PATH,
    '@ssr': SSR_PATH
  },
  // 以下为可选
  pages: PAGE_PATH,
  views: `${APP_PATH}/views`,
  static: STATIC_PATH,
  ssr: SSR_PATH
};
