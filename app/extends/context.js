/**
 * 扩展 Koa Context 对象
 */
const prettyjson = require('prettyjson');

const ENV = process.env.NODE_ENV;

/**
 * 工具方法，向vislogger注入更多信息
 * @param {*} context ctx上下文
 * @param {*} params log params
 */
const appendParams = (context, params) => {
  const {
    kdtId, buyerId, originalUrl, firstXff, body
  } = context;
  let [msg, e, extra] = params || [];
  // 只接受string
  msg = JSON.stringify({
    kdtId, buyerId, originalUrl, firstXff, msg
  });
  extra = { extra, body };
  return [msg, e, extra];
};

module.exports = {
  // 返回 url 列表
  get appUrl() {
    return {
      vis: 'https://h5.youzan.com/wscvis'
    };
  },

  get visBuyer() {
    const {
      buyer = {},
      fans_id: fansId = 0,
      fans_type: fansType = 0,
      youzan_fans_id: youzanFansId = 0,
      fans_nickname: fansNickname = '',
      fans_picture: fansPicture = '',
      verify_weixin_openid: openId,
      platform = {},
      user = {}
    } = this.getLocalSession();

    return {
      nobody: this.sessionId,
      buyerId: this.buyerId,
      buyerPhone: buyer.mobile || '',
      fansId,
      youzanFansId,
      fansType,
      fansNickname, // 第三方体系下的用户名（微信
      fansPicture, // 第三方体系下的头像（微信
      buyerNickname: buyer.nick_name || '', // 有赞体系下的用户名（手机号登录
      buyerPicture: buyer.avatar || '', // 有赞体系下的头像（手机号登录
      openId,
      // 聚合字段：统一从这两个字段取头像和用户名，确保对前端统一
      // https://doc.qima-inc.com/pages/viewpage.action?pageId=103221541
      finalAvatar: platform.platform_avatar || user.avatar || '',
      finalUsername: platform.platform_nickname || user.nickname || '',
    };
  },

  get visLogger() {
    return {
      info: (...params) => {
        return this.logger.info(...appendParams(this, params));
      },
      warn: (...params) => {
        return this.logger.warn(...appendParams(this, params));
      },
      debug: (...params) => {
        return this.logger.debug(...appendParams(this, params));
      },
      error: (...params) => {
        return this.logger.error(...appendParams(this, params));
      },
    };
  },

  get logUserStr() {
    const {
      finalUsername: username, finalAvatar: avatar, fansId, fansType, buyerPhone, nobody: sessionId
    } = this.visBuyer;
    return `kdtId: ${this.kdtId} buyerId: ${this.visBuyer.buyerId} username: ${username} avatar: ${avatar} fansId: ${fansId} fansType: ${fansType} phone: ${buyerPhone} sessionId: ${sessionId}`;
  },

  /**
   * 用于开发环境格式化 json 对象
   * @param {Object} json
   */
  prettyjson(json) {
    const isPrd = ENV === 'prod' || ENV === 'pre';

    // 预发和生产环境过滤非 error 等级的 log
    if (isPrd) {
      return json;
    }

    // 若传入的 level 不合法，默认使用 log 方法
    try {
      return prettyjson.render(json);
    } catch (err) {
      return json;
    }
  },
};
