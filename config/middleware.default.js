const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '../');

module.exports = {
  'astroboy-static': {
    priority: 1,
    enable: true,
    options: {
      root: path.join(ROOT_PATH, '/static/local')
    }
  },
  'mock': {
    priority: 100,
    enable: true,
    path: path.join(ROOT_PATH, '/app/middlewares/mock')
  }
}