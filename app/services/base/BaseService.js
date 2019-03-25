const IronBaseService = require('@youzan/iron-base/app/services/base/IronBaseService');
const get = require('lodash/get');
const isPlainObject = require('lodash/isPlainObject');
const BusinessServiceError = require('@youzan/iron-base/app/services/base/BusinessServiceError');
const ParamsError = require('../../exceptions/ParamsError');
const HttpError = require('../../exceptions/HttpError');
const ServiceError = require('../../exceptions/ServiceError');

class BaseService extends IronBaseService {
  get FINDSTAFFROLE_SERVICE() {
    return 'com.youzan.sam.service.StaffServiceV2';
  }

  get SHOP_CONFIG_SERVICE() {
    return 'com.youzan.owl.api.ShopConfigService';
  }

  /**
   * 获取知识付费店铺配置信息（本次针对小程序ios封杀白名单）
   * @param params.kdtId
   */
  async getWeappConfig(params) {
    const result = await this.invoke(this.SHOP_CONFIG_SERVICE, 'getWeappConfig', [params]);
    return result;
  }

  /**
   * 获取店铺设置等信息
   * @param {String} kdtId
   * getShopConfigs keys 值来自 php paidcontent controller
   */
  async getShopConfigAndTeamStatus(kdtId) {
    let [shopConfig = {}, teamStatus = {}] = await Promise.all([
      this.callService(
        'iron-base/shop.ShopConfigService',
        'getShopConfigs',
        kdtId,
        ['is_web_im_in_goods',
          'is_web_im_in_order',
          'show_shop_btn',
          'show_buy_btn',
          'background_color',
          'design_setting',
          'customer_blacklist_switch',
          'guarantee_show_style_type', 'freight_insurance',
          'is_youzan_secured',
          'record_buyer_gps']
      ),
      this.callService(
        'iron-base/shop.TeamStatusService',
        'getTeamStatus',
        kdtId
      )
    ]);

    shopConfig = Object.assign(shopConfig, {
      is_web_im_in_goods: +(shopConfig.is_web_im_in_goods) === 1 && +(teamStatus.show_wsc_web_im) === 1 ? '1' : '0'
    });
    return [shopConfig, teamStatus];
  }

  /**
   * 获取管理员状态
   */
  async getAdminStatus(kdtId) {
    const buyer = this.ctx.getGlobal().buyer || {};
    if (!buyer.id) return false;

    const params = {
      kdtId,
      adminId: buyer.id,
      biz: 'wsc'
    };
    const roleStatus = await this.invoke(
      this.FINDSTAFFROLE_SERVICE,
      'findStaffRole',
      [params]
    );
    if (roleStatus && roleStatus[0]) return true;
    return false;
  }

  /**
   * owl Api调用
   */
  async owlApiCall(ajaxOptions, config) {
    let baseUrl = this.getConfig('OWL_API');
    ajaxOptions.url = `${baseUrl}${ajaxOptions.url}`;
    const ret = await this.ajax(ajaxOptions, config);
    return ret;
  }

  /**
   * [重写]标准 Ajax 调用
   * @param {Object} ajaxOptions
   * @param {Object} config
   */
  async ajax(ajaxOptions, config) {
    let result;
    let ajaxOptionsStr = '';

    if (ajaxOptions && ajaxOptions.method && ['put', 'post'].indexOf(ajaxOptions.method.toLowerCase()) > -1) {
      ajaxOptions.contentType = 'application/json; charset=utf-8';
    }

    try {
      ajaxOptionsStr = JSON.stringify(ajaxOptions);
    } catch (error) {
      this.ctx.visLogger.error('[ajax] 调用 传入的 option 有误', error);
      this.ctx.localLog('error', error);
    }

    // 如果不把请求进行 try，会触发全局的 fail 中间件，导致异常不能在这里进行处理
    try {
      result = await this.httpCall(ajaxOptions, config);
    } catch (error) {
      this.ctx.visLogger.warn('[ajax error]', error, {
        args: ajaxOptionsStr,
        res: error
      });
      this.ctx.localLog('warn', this.ctx.prettyjson({
        user: this.ctx.logUserStr,
        name: 'ajax',
        args: ajaxOptionsStr,
        res: error
      }));

      if (error.response) {
        throw new HttpError(error.response.status, get(error, 'response.data.error', '请求错误'));
      } else if (error.request) {
        throw new HttpError('9999', '网络超时');
      } else {
        throw new ServiceError('500', error.message);
      }
    }

    this.ctx.visLogger.info('[ajax]', '', {
      args: ajaxOptionsStr,
      res: result
    });
    this.ctx.localLog('log', this.ctx.prettyjson({
      user: this.ctx.logUserStr,
      name: 'ajax',
      args: ajaxOptionsStr,
      res: result
    }));

    if (result.code === 200 && result.success) {
      return result.data;
    }
    if (result.code === 0) {
      return result.data;
    }
    if (result.code === 404) {
      throw new ParamsError(11013, result.message);
    }
    throw new BusinessServiceError(10003, result.message, ajaxOptions);
  }

  /**
   * 重写invoke调用，统一处理返回数据、日志记录（logger）
   * @param {Object} ajaxOptions
   * @param {Object} config
   */
  async owlInvoke(serviceName, methodName, args, options = {}) {
    // 如果第二个参数是一个数组，说明业务调用服务的时候省略了服务名，则默认使用 Service 的 SERVICE_NAME
    if (Array.isArray(methodName)) {
      options = args || {};
      args = methodName;
      methodName = serviceName;
      serviceName = this.SERVICE_NAME;
    }
    try {
      const result = await super.invoke(serviceName, methodName, args, options);

      this.ctx.visLogger.info(`[invoke] ${serviceName}.${methodName}`, '', {
        result,
        args,
        options
      });
      this.ctx.localLog('log', this.ctx.prettyjson({
        user: this.ctx.logUserStr,
        name: 'invoke',
        args: `${serviceName}.${methodName}`,
        res: {
          result,
          args,
          options
        }
      }));

      if (isPlainObject(result) && result.code === -100 && result.success === false) {
        throw new BusinessServiceError(result.code, '请求失败', {
          serviceName,
          methodName,
          args
        });
      }
      return result;
    } catch (error) {
      this.ctx.visLogger.warn(`[invoke error] ${serviceName}.${methodName}`, error, {
        args,
        options
      });
      throw error;
    }
  }
}

module.exports = BaseService;
