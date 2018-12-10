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
 * Created by liangshan on 2018/7/24.
 */
const KitUtil = (function () {
  const _S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  const _getUUID = function (prefix) {
    return ((prefix || '') + _S4() + _S4() + '-' + _S4() + '-' + _S4() + '-' + _S4() + '-' + _S4() + _S4() + _S4())
  }
  const _typeof = function (obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
  }
  const _isPlainObject = function (obj) {
    return _typeof(obj) === 'object'
  }
  const _isString = function (obj) {
    return typeof (obj) === 'string'
  }
  const _isNonEmptyArray = function (obj = []) {
    return obj && obj.length > 0 && Array.isArray(obj) && typeof obj !== 'undefined'
  }
  const _isObject = function (item) {
    return (item && typeof item === 'object' && !Array.isArray(item))
  }
  const _isEmptyObject = function (obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
  }
  return {
    getUUID: _getUUID,
    isPlainObject: _isPlainObject,
    isString: _isString,
    isNonEmptyArray: _isNonEmptyArray,
    isObject: _isObject,
    isEmptyObject: _isEmptyObject
  }
})()

export default KitUtil
