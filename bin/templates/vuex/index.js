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
 * Created by liangshan on 2017/7/19.
 */
import weex from 'weex-vue-render'
import Vue from 'vue'
import parse from 'url-parse'
import App from './index.vue'
import store from './store'
import * as filters from './filters'
import mixins from './mixins'

global.Vue = Vue
try {
  require('./plugins/index')
} catch (err) { }

if (typeof weex.init === 'function') weex.init(Vue)

weex.config.zpfe = weex.config.zpfe || {}
weex.config.zpfe.query = parse(weex.config.bundleUrl, true).query

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// register global mixins.
Vue.mixin(mixins)

if (!global.$$APP_NAME$$) {
  global.$$APP_NAME$$ = {}
}
global.$$APP_NAME$$.eventHub = new Vue()

/**
 * 通过key获取value，忽略key首字母的大小写
 * @param key
 * @param obj
 * @returns {*}
 */
Vue.prototype.$getValueByKey = function (key, obj) {
  let _upper = key.replace(/^[a-zA-Z]/, item => item.toUpperCase())
  if (obj.hasOwnProperty(_upper)) {
    return obj[_upper]
  }
  let _lower = key.replace(/^[a-zA-Z]/, item => item.toLowerCase())
  if (obj.hasOwnProperty(_lower)) {
    return obj[_lower]
  }
  return ''
}

Vue.prototype.adjustWeb = function (s) {
  let deviceInfo = weex.config.env
  let _s = 0
  if (deviceInfo.platform.toLowerCase() === 'web') {
    _s = s / deviceInfo.dpr
  } else {
    _s = s
  }
  return _s
}

Vue.prototype.getScreenHeight = function () {
  const { env } = weex.config;
  return env.deviceHeight / env.deviceWidth * 750;
}

Vue.prototype.weexReportEvt = async function (params) {
  // AppDataUtil.weexReportEvt(params)
}

Vue.config.errorHandler = err => {
  console.log(err.message)
}

new Vue(Vue.util.extend({ el: '#root', store }, App))
