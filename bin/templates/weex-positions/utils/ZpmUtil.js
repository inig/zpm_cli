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

const ZpmUtil = (function () {
  const _adjustWeb = function (s) {
    let deviceInfo = weex.config.env
    let _s = 0
    if (deviceInfo.platform.toLowerCase() === 'web') {
      _s = s / deviceInfo.dpr
    } else {
      _s = s
    }
    return _s
  }

  const isEmptyObj = function (obj) {
    var t;
    for (t in obj) {
      return !1
    }
    return !0
  }

  const getDataAttr = function (evt, name) {
    let deviceInfo = weex.config.env
    let allAttrs = {}
    if (deviceInfo.platform.toLowerCase() === 'web') {
      allAttrs = Object.assign({}, evt.target.attrs)
      for (let attr in allAttrs) {
        if (allAttrs.hasOwnProperty(attr)) {
          allAttrs[attr.replace(/(-([a-z]))/g, function (a, b, c) { return c.toUpperCase() })] = allAttrs[attr]
          if (attr.indexOf('-') > -1) {
            delete allAttrs[attr]
          }
        }
      }
    } else {
      allAttrs = Object.assign({}, evt.target.attr)
    }
    let _name = name || ''
    if (_name) {
      _name = _name.replace(/(-([a-z]))/g, function (a, b, c) { return c.toUpperCase() })
      return allAttrs[_name]
    }
    return allAttrs
  }
  const _findIndexByKey = function (key, code, arr) {
    let i = 0
    let outIndex = -1
    for (i; i < arr.length; i++) {
      if (String(arr[i][key]) === String(code)) {
        outIndex = i
        i = arr.length
      }
    }
    return outIndex
  }

  const __S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  function __getUUID (prefix) {
    return (prefix || '') + (__S4() + __S4() + '-' + __S4() + '-' + __S4() + '-' + __S4() + '-' + __S4() + __S4() + __S4())
  }
  return {
    adjustWeb: _adjustWeb,
    isEmptyObj: isEmptyObj,
    getDataAttr: getDataAttr,
    findIndexByKey: _findIndexByKey,
    getUUID: __getUUID
  }
})()

export default ZpmUtil
