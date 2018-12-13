import weex from 'weex-vue-render'
import Vue from 'vue'
import parse from 'url-parse'
import App from './App.vue'

import store from '../../store'
// import contacts from '../../store/modules/contacts'

if (typeof weex.init === 'function') weex.init(Vue)

weex.config.zpfe = weex.config.zpfe || {}
weex.config.zpfe.query = parse(weex.config.bundleUrl, true).query

// store.registerModule('contacts', contacts)
Vue.prototype.$store = store
Vue.prototype.$eventBus = new Vue({})

function createApp() {
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
