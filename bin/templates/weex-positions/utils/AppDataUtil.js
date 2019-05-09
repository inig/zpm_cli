/***
 **                                                          _ooOoo_
 **                                                         o8888888o
 **                                                         88" . "88
 **                                                         (| -_- |)
 **                                                          O\ = /O
 **                                                      ____/`---'\____
 **                                                    .   ' \\| |// `.
 **                                                     / \\||| : |||// \
 **                                                   / _||||| -:- |||||- \
 **                                                     | | \\\ - /// | |
 **                                                   | \_| ''\---/'' | |
 **                                                    \ .-\__ `-` ___/-. /
 **                                                 ___`. .' /--.--\ `. . __
 **                                              ."" '< `.___\_<|>_/___.' >'"".
 **                                             | | : `- \`.;`\ _ /`;.`/ - ` : | |
 **                                               \ \ `-. \_ __\ /__ _/ .-` / /
 **                                       ======`-.____`-.___\_____/___.-`____.-'======
 **                                                          `=---='
 **
 **                                       .............................................
 **                                              佛祖保佑             永无BUG
 **                                      佛曰:
 **                                              写字楼里写字间，写字间里程序员；
 **                                              程序人员写程序，又拿程序换酒钱。
 **                                              酒醒只在网上坐，酒醉还来网下眠；
 **                                              酒醉酒醒日复日，网上网下年复年。
 **                                              但愿老死电脑间，不愿鞠躬老板前；
 **                                              奔驰宝马贵者趣，公交自行程序员。
 **                                              别人笑我忒疯癫，我笑自己命太贱；
 **                                              不见满街漂亮妹，哪个归得程序员？
 */
/**
 * Created by liangshan on 2018/7/6.
 */
/**
 * app相关数据
 * @type {{userInfo, resumeInfo, guideInfo, envInfo, locationInfo, currentCityCode}}
 * @private
 */
const ZPFE = weex.requireModule('ZPFEAPI')
const modal = weex.requireModule('modal')
const AppDataUtil = (function (ZPFE) {
  /**
   * 用户信息
   * @returns {Promise.<T>}
   * @private
   */
  const _userInfo = function () {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.data({
          user: []
        }, res => {
          // res.user.Uticket = '0FC4CCF62E8B617F76165722A1E03704'
          // res.user.Id = '680921371'
          resolve(res)
        })
      } catch (err) {
        resolve({
          user: {}
        })
      }
    }).catch(() => {
      return {
        user: {}
      }
    })
  }
  /**
   * 简历信息
   * @returns {Promise.<T>}
   * @private
   */
  const _resumeInfo = function () {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.data({
          resume: []
        }, res => {
          resolve(res)
        })
      } catch (err) {
        resolve({
          resume: {}
        })
      }
    }).catch(() => {
      return {
        resume: {}
      }
    })
  }
  /**
   * app引导页数据
   * @returns {Promise.<T>}
   * @private
   */
  const _guideInfo = function () {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.data({
          guide: []
        }, res => {
          resolve(res)
        })
      } catch (err) {
        resolve({
          guide: {}
        })
      }
    }).catch(() => {
      return {
        guide: {}
      }
    })
  }
  /**
   * app环境数据
   * @returns {Promise.<T>}
   * @private
   */
  const _envInfo = function () {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.data({
          env: []
        }, res => {
          resolve(res)
        })
      } catch (err) {
        resolve({
          env: {}
        })
      }
    }).catch(() => {
      return {
        env: {}
      }
    })
  }
  /**
   * 定位信息
   * @returns {Promise.<T>}
   * @private
   */
  const _locationInfo = function () {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.data({
          location: []
        }, res => {
          resolve(res)
        })
      } catch (err) {
        resolve({
          location: {}
        })
      }
    }).catch(() => {
      return {
        location: {}
      }
    })
  }
  /**
   * app缓存的cityCode
   * @returns {Promise.<T>}
   * @private
   */
  const _currentCityCode = function () {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.zpmFn({
          name: 'zpmCurrentCityCode'
        }, res => {
          resolve(res.currentCityCode)
        })
      } catch (err) {
        resolve('')
      }
    }).catch(() => {
      return ''
    })
  }

  /**
   * 跳转至app的某个tab
   * > v7.8.5
   * @param data
   * {
   *    type: '3',
   *    msg: 'severalResumesAndResumeToTop'
   *  }
   * @returns {Promise<any>}
   * @private
   */
  const _goToTab = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.goToTab(data, function (res) {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }
  /**
   * 跳转至app的简历页
   * @param data
   * {
   *    id: ID,
   *    resumeNumber: RESUME_NUMBER,
   *    resumeVersion: RESUME_VERSION,
   *    resumeName: RESUME_NAME,
   *    resumeDisclosureLever: RESUME_DISCLOSURE_LEVER,
   *    enterSource: '20' //智能卡进入生成订单来源
   *  }
   * @returns {Promise<any>}
   * @private
   */
  const _weexToTopResume = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexToTopResume(data, function (res) {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }
  /**
   * 跳转至简历tab
   * @param data
   *  ''
   * @returns {Promise<any>}
   * @private
   */
  const _weexGoToResumeTab = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexGoToResumeTab(data || '', function (res) {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }
  /**
   * 跳转至创建简历
   * @param data
   *  ''
   * @returns {Promise<any>}
   * @private
   */
  const _weexGuideResume = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexGuideResume(data || '', function (res) {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }

  /**
   * 跳转至创建简历, 可传参数 Android
   * @param data
   *  ''
   * @returns {Promise<any>}
   * @private
   */
  const _weexGuideResumeWithParams = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexGuideResumeWithParams(data || '', function (res) {
          resolve(res || {})
        })
      } catch (err) {
        try {
          ZPFE.weexGuideResume(function (res) {
            resolve(res || {})
          })
        } catch (e) {
          reject(new Error(e.message))
        }
      }
    })
  }

  /**
   * 从app获取推荐职位列表
   * @param data
   * @returns {Promise<any>}
   * @private
   */
  const _weexRecommendPosition = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexRecommendPosition(data, function (res) {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }
  /**
   * 跳转至职位详情页
   * @param data
   * {
   *    id: POSITION_ID,
   *    number: attrs.positionNumber,
   *    guid: that.UUID,
   *    pagecode: '5020',
   *    order: Number(attrs.dataIndex),
   *    configSerialId: that.configSerialId,
   *    moduleName: 'APP_HOME_INDEX'
   *  }
   * @returns {Promise<any>}
   * @private
   */
  const _weexJobInfoDetail = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexJobInfoDetail(data, function (res) {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }
  /**
   * 设置APP顶部状态栏的字体颜色
   * data.color可选  light、dark
   * @param data
   * @private
   */
  const _weexStatusBarStyle = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexStatusBarStyle({
          statusBarStyle: (data.color.toLowerCase() === 'light' ? 1 : 0)
        }, function (res) {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }

  /**
   * 跳转至发现频道weex页面
   * @returns {Promise<any>}
   * @private
   */
  /* eslint-disable-next-line camelcase */
  const _fn_zpdOpenUrl = function _fn_zpdOpenUrl (data) {
    return new Promise(resolve => {
      try {
        ZPFE.fn({
          name: 'zpdOpenUrl',
          params: data
        }, res => {
        })
        resolve(true)
      } catch (err) {
        resolve(true)
      }
    })
  }

  /**
   * 跳转至weex或H5页
   * @param data
   * {
   *    url: URL
   * }
   * @returns {Promise<any>}
   * @private
   */
  const _weexGoToWeexOrWebViewByUrl = function (data) {
    return new Promise((resolve, reject) => {
      try {
        if (data.url.toLowerCase().indexOf('//c-m-bucket.zhaopin.cn/next/zpd/') !== -1) {
          /**
           *  拦截发现频道的地址，特殊处理
           */
          _fn_zpdOpenUrl(data)
        } else {
          ZPFE.weexGoToWeexOrWebViewByUrl(data)
        }
        resolve(true)
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }

  /**
   * 跳转至APP的IMPositionList
   * @param data
   *  ''
   * @returns {Promise<any>}
   * @private
   */
  const _weexEnterIMPositionList = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexEnterIMPositionList(data || '', (res) => {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }

  /**
   * 跳转至APP的登录页
   * @param data
   *  ''
   * @returns {Promise<any>}
   * @private
   */
  const _weexGoToLogin = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexGoToLogin(data || '', (res) => {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }
  /**
   * 跳转至 智联优选 页
   * @param data
   * {
   *    key: KEY,
   *    code: CITY_CODE,
   *    usertype: USERTYPE,
   *    longitude: LONGITUDE,
   *    latitude: LATITUDE
   *  }
   * @returns {Promise<any>}
   * @private
   */
  const _weexToYouXuan = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexToYouXuan(data, res => {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }
  /**
   * weex调用原生的数据上报
   * @param data
   * @param-type [Array|Object]
   * @private
   */
  const _weexReportEvt = function (args) {
    return new Promise((resolve, reject) => {
      let reportArgs = args
      let objStr = Object.prototype.toString
      if (objStr.call(args) === '[object Object]') {
        reportArgs = [args]
      }
      try {
        ZPFE.weexReportEvt(reportArgs)
        resolve(true)
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }
  /**
   * weex调用原生 投递职位
   * @param data
   * @private
   */
  const _weexDelivery = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexDelivery(data, res => {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }
  /**
   * weex调用原生 收藏职位
   * @param data
   * @private
   */
  const _weexCollection = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexCollection(data, res => {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }
  /**
   * weex调用原生 取消收藏职位
   * @param data
   * @private
   */
  const _weexCancelCollection = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexCancelCollection(data, res => {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }
  /**
   * weex调用原生 屏蔽公司
   * @param data
   * @private
   */
  const _weexShield = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexShield(data, res => {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }
  /**
   * weex调用原生 跳转至约聊
   * @param data
   * @private
   */
  const _weexYueliao = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexYueliao(data, res => {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }
  /**
   * weex调用原生 打开地图
   * @param data
   *  {
   *    citycode: CITY_CODE,
   *    cityname: CITY_NAME,
   *    address: ADDRESS
   *  }
   * @private
   */
  const _weexStartMap = function (data) {
    return new Promise((resolve, reject) => {
      try {
        ZPFE.weexStartMap(data, res => {
          resolve(res || {})
        })
      } catch (err) {
        reject(new Error(err.message))
      }
    })
  }
  /**
   * 获取APP的网络状态
   * @returns {Promise<any>}
   * @private
   */
  /* eslint-disable-next-line camelcase */
  const _zpmFn_zpmGetCurrentNetworkState = function () {
    return new Promise(async (resolve, reject) => {
      let appEnv = await _envInfo()
      let appVersion = appEnv.env.appversion.replace(/\./g, '')
      if (appVersion >= '783') {
        ZPFE.zpmFn({
          name: 'zpmGetCurrentNetworkState'
        }, res => {
          resolve(res || {})
        })
      } else {
        resolve({})
      }
    })
  }
  /**
   * APP的toast
   * 降级文案 modal.toast
   * @param data
   * {
   *    'iconName': '',
   *    'message': MESSAGE
   *  }
   * @returns {Promise<any>}
   * @private
   */
  /* eslint-disable-next-line camelcase */
  const _fn_toastView = function (data) {
    return new Promise(async (resolve, reject) => {
      let appEnv = await _envInfo()
      let appVersion = appEnv.env.appversion.replace(/\./g, '')
      if (appVersion >= '784') {
        ZPFE.fn({
          'name': 'toastView',
          'params': data
        })
        resolve(true)
      } else {
        modal.toast({
          message: data.message
        })
        resolve(true)
      }
    })
  }
  /**
   * APP的alert
   * 降级文案 modal.confirm
   * @param data
   * {
   *  'title': TITLE,
   *  'okButton': OK_BUTTON_TEXT,
   *  'otherButton': OTHER_BUTTON_TEXT  【Array<String>】: ['下次再说']
   * }
   * @returns {Promise<any>}
   * @private
   */
  /* eslint-disable-next-line camelcase */
  const _fn_alertView = function (data) {
    return new Promise(async (resolve) => {
      let appEnv = await _envInfo()
      let appVersion = appEnv.env.appversion.replace(/\./g, '')
      if (appVersion >= '784') {
        ZPFE.fn({
          'name': 'alertView',
          'params': data
        }, d => {
          resolve(d)
        })
      } else {
        modal.confirm({
          message: data.title,
          okTitle: data.okButton || '确定',
          cancelTitle: data.otherButton ? data.otherButton[0] : '下次再说'
        }, d => {
          resolve({
            alertView: {
              name: d
            }
          })
        })
      }
    })
  }

  /**
   * 获取app状态栏高度
   * @returns {Promise<any>}
   * @private
   */
  const _weexGetStatusBarHeight = function () {
    return new Promise((resolve) => {
      let statusBarHeight = 60
      try {
        ZPFE.weexGetStatusBarHeight(res => {
          if (weex.config.env.platform.toLowerCase() === 'ios') {
            statusBarHeight = res.status_H * 2 + 20
          } else {
            statusBarHeight = res.status_H * 2 / weex.config.env.scale + 20
          }
          resolve(statusBarHeight)
        })
      } catch (err) {
        resolve(60)
      }
    })
  }

  /**
   * 获取最佳雇主第4JD卡信息
   * @returns {Promise<any>}
   * @private
   */
  const _weexReuqestBestEmployerCompanyInfo = function () {
    return new Promise(resolve => {
      try {
        ZPFE.weexReuqestBestEmployerCompanyInfo({}, res => {
          if (typeof res === 'string') {
            resolve(JSON.parse(res))
          } else if (typeof res === 'object') {
            resolve(res)
          } else {
            resolve({})
          }
        })
      } catch (err) {
        resolve({})
      }
    })
  }

  /**
   * 通知native显示最佳雇主弹窗
   * @returns {Promise<any>}
   * @private
   */
  const _weexRequestNativeShowBestEmployDialog = function () {
    return new Promise(resolve => {
      try {
        ZPFE.weexRequestNativeShowBestEmployDialog()
        resolve(true)
      } catch (err) {
        resolve(true)
      }
    })
  }

  /**
   * 关闭最佳雇主（第4个JD卡）
   * @returns {Promise<any>}
   * @private
   */
  const _weexHomeBestEmployerItemCardClosed = function () {
    return new Promise(resolve => {
      try {
        ZPFE.weexHomeBestEmployerItemCardClosed()
        resolve(true)
      } catch (err) {
        resolve(true)
      }
    })
  }

  /**
   * 跳转至 原生的公司详情页面
   * @returns {Promise<any>}
   * @private
   */
  const _zpmCompanyDetail = function (data) {
    return new Promise(resolve => {
      try {
        ZPFE.zpmCompanyDetail(data, res => { })
        resolve(true)
      } catch (err) {
        resolve(true)
      }
    })
  }

  /**
   * 跳转至 原生城市选择页
   * @params
   *    - cityCode
   * @returns {Promise<any>}
   *    - cityCode
   *    - cityName
   *    - cityEnName
   * @private
   */
  const _weexToCitySelectPage = function (data) {
    return new Promise(resolve => {
      try {
        ZPFE.weexToCitySelectPage(data, res => {
          resolve(res)
        })
      } catch (err) {
        resolve({})
      }
    })
  }

  /**
   * 刷新定位
   * @params 
   *    - 
   * @returns {Promise<any>}
   *    - cityCode
   *    - cityName
   *    - cityEnName
   * @private
   */
  const _updateLocation = function () {
    return new Promise(resolve => {
      try {
        ZPFE.fn({
          name: 'ZPMLocation',
          params: {
            type: 'update'
          }
        }, res => {
          resolve(res)
        })
      } catch (err) {
        resolve({})
      }
    })
  }

  return {
    userInfo: _userInfo,
    resumeInfo: _resumeInfo,
    guideInfo: _guideInfo,
    envInfo: _envInfo,
    locationInfo: _locationInfo,
    currentCityCode: _currentCityCode,
    goToTab: _goToTab,
    weexToTopResume: _weexToTopResume,
    weexGoToResumeTab: _weexGoToResumeTab,
    weexGuideResume: _weexGuideResume,
    weexGuideResumeWithParams: _weexGuideResumeWithParams,
    weexRecommendPosition: _weexRecommendPosition,
    weexJobInfoDetail: _weexJobInfoDetail,
    weexStatusBarStyle: _weexStatusBarStyle,
    weexGoToWeexOrWebViewByUrl: _weexGoToWeexOrWebViewByUrl,
    weexEnterIMPositionList: _weexEnterIMPositionList,
    weexGoToLogin: _weexGoToLogin,
    weexToYouXuan: _weexToYouXuan,
    weexReportEvt: _weexReportEvt,
    weexDelivery: _weexDelivery,
    weexCollection: _weexCollection,
    weexCancelCollection: _weexCancelCollection,
    weexShield: _weexShield,
    weexYueliao: _weexYueliao,
    weexStartMap: _weexStartMap,
    zpmFn_zpmGetCurrentNetworkState: _zpmFn_zpmGetCurrentNetworkState,
    fn_toastView: _fn_toastView,
    fn_alertView: _fn_alertView,
    weexGetStatusBarHeight: _weexGetStatusBarHeight,
    fn_zpdOpenUrl: _fn_zpdOpenUrl,
    weexReuqestBestEmployerCompanyInfo: _weexReuqestBestEmployerCompanyInfo,
    weexRequestNativeShowBestEmployDialog: _weexRequestNativeShowBestEmployDialog,
    weexHomeBestEmployerItemCardClosed: _weexHomeBestEmployerItemCardClosed,
    zpmCompanyDetail: _zpmCompanyDetail,
    weexToCitySelectPage: _weexToCitySelectPage,
    updateLocation: _updateLocation
  }
})(ZPFE)

export default AppDataUtil
