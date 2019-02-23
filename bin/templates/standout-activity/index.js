import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '../../store/index'
// import skillTag from '../../store/modules/skillTag' //TODO 动态注册module

import { initApp, mobStatic } from '../../utils'

// #region  注册store
// store.registerModule('contacts', contacts) //TODO 动态注册module
Vue.prototype.$store = store
// #endregion
Vue.prototype.$eventBus = new Vue({})
Vue.prototype.$mobStatic = mobStatic
/**
 * export function
 * 防止ssr时App的单例缓存App
 */
export function createApp () {
  if (typeof window !== 'undefined') {
    App.el = '#root'
    App.router = router
    return new Vue(App)
  } else {
    let root = new Vue(App)
    return root
  }
}

if (typeof window !== 'undefined') createApp()

initApp()
