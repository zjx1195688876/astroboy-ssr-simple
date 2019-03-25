const SSR = Symbol('app#ssr');
const Engine = require('../lib/engine');

module.exports = {

  /**
   * ssr environment
   */
  get ssr() {
    if (!this[SSR]) {
      this[SSR] = new Engine(this);
    }
    return this[SSR];
  },

};