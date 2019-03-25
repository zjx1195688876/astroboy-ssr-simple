const H5BaseController = require('@youzan/iron-base/app/controllers/base/H5BaseController');

class BaseNewController extends H5BaseController {
  async init() {
    await super.init();

    // 只有页面请求才需要初始化的数据
    if (!this.ctx.acceptJSON) {
      await Promise.all([
        this.getMpData(),
        this.initPlatform(), // 平台信息 _global.platformInfo
      ]);
      this.initKdtId();
      this.setOldPlatform();
      this.setVisBuyer();
      this.loggerUainfo();
    }
  }

  get buyer() {
    return this.ctx.visBuyer;
  }

  /**
   * 往天网发 ua 设备信息
   */
  loggerUainfo() {
    const ctx = this.ctx;
    const { mobileSystem, platform, platformVersion } = ctx;
    const ua = ctx.headers['user-agent'];

    this.ctx.visLogger.info(`[UA c 端设备信息] [mobileSystem: ${mobileSystem}] - [platform: ${platform}] - [platformVersion: ${platformVersion}] - [ua: ${ua}]`, '', {
      mobileSystem,
      platform,
      platformVersion,
      ua,
    });
  }

  /**
   * global 设置 kdt_id
   */
  initKdtId() {
    const kdtId = this.ctx.kdtId;
    this.ctx.setGlobal('kdt_id', kdtId);
    this.ctx.setState('kdt_id', kdtId);
  }

  /**
   * 获取底部版权公众号信息
   */
  async getMpData() {
    await Promise.all([
      this.initMpData(), // 底部版权信息
      this.initMpAccount(), // 底部版权信息
    ]);
  }

  /**
   * 设置老业务需要的平台信息 global 字段
   */
  setOldPlatform() {
    const ctx = this.ctx;
    const platformInfo = ctx.getState('platformInfo') || {};

    const {
      is_mobile: isMobile,
      platform_version: platformVersion,
      mobile_system: mobileSystem
    } = platformInfo;

    this.ctx.setGlobal('platform', ctx.platform);

    this.ctx.setGlobal('mobile_system', mobileSystem);
    this.ctx.setGlobal('is_mobile', isMobile);
    this.ctx.setGlobal('platform_version', platformVersion);
  }

  /**
   * 设置 visBuyer 字段
   */
  setVisBuyer() {
    this.ctx.setGlobal('visBuyer', this.buyer);
  }

  // 以下可选服务

  /**
   * ACL
   */
  async baseAcl(aclConf) {
    const ctx = this.ctx;
    if (ctx.isWeapp) {
      return;
    }
    const queryStr = Object.assign({
      scenes: 'paidcontent'
    }, aclConf);
    const aclResult = await this.acl(queryStr);

    this.setVisBuyer();

    ctx.visLogger.info('[baseAcl]', '', { result: aclResult });

    ctx.localLog('log', ctx.prettyjson({
      user: ctx.logUserStr,
      name: 'baseAcl',
      args: queryStr,
      res: aclResult
    }));

    return aclResult;
  }

  /**
   * 不展示底部版权区域
   */
  hideFooter() {
    this.ctx.setState('isHideFooter', true);
  }

  /**
   * 打点
   * @param {String} logType
   * @param {*} logId
   */
  setSpm(logType, logId) {
    this.ctx.setGlobal('spm', {
      logType,
      logId
    });
  }

  /**
   * global 设置运行环境
   */
  setRunModeState() {
    // node 环境
    let runMode = '';
    if (process.env.NODE_ENV === 'pre') {
      runMode = 'pre';
    } else if (process.env.NODE_ENV === 'prod') {
      runMode = 'online';
    } else {
      runMode = 'qatest';
    }
    this.ctx.setGlobal('runMode', runMode);
  }

  /**
   * 同步获取 shop footer（默认情况下页面通过接口异步获取）
   */
  async getFooterJson() {
    const kdtId = this.ctx.kdtId;
    const offlineId = this.ctx.offlineId;
    this.validator.required(kdtId, '参数 kdt_id 不能为空');
    const result = await this.callService(
      'shop.ShopFooterService',
      'getFooterInfo',
      kdtId,
      offlineId,
    );

    this.ctx.setGlobal('footer_config', result);
  }
}

module.exports = BaseNewController;
