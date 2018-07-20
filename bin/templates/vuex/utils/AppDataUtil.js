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
  return {
    userInfo: _userInfo,
    resumeInfo: _resumeInfo,
    guideInfo: _guideInfo,
    envInfo: _envInfo,
    locationInfo: _locationInfo,
    currentCityCode: _currentCityCode
  }
})(ZPFE)

export default AppDataUtil
