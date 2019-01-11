/*
 * @Company: 智联招聘
 * @Author: xuebin.me
 * @Date: 2018-12-12 18:33:24
 * @LastEditors: Leo
 * @LastEditTime: 2019-01-10 11:58:29
 * @version: 0.0.0
 * @Description:
 */
import Vue from 'vue'
import weex from 'weex-vue-render'
import parse from 'url-parse'
import App from './App.vue'

import store from '../../store'
// import contacts from '../../store/modules/contacts'

if (typeof weex.init === 'function') weex.init(Vue)

weex.config.zpfe = weex.config.zpfe || {}
weex.config.zpfe.query = parse(weex.config.bundleUrl, true).query

function createApp() {
  // store.registerModule('contacts', contacts)
  Vue.prototype.$store = store
  Vue.prototype.$eventBus = new Vue({})

  return new Vue(App)
}

if (weex.config.env.platform !== 'Node') {
  App.el = '#root'
  createApp()
}

export default createApp

// let output = App
// if (weex.config.env.platform !== 'Node') {
//   App.el = '#root'
//   output = new Vue(App)
// }
// export default output
