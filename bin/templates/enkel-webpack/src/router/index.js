import Vue from 'vue'
import Router from 'vue-router'
import PageRoutes from './PageRoutes.js'

Vue.use(Router)

export const HomeRoutes = {
  path: '/',
  name: 'index',
  meta: {
    title: '首页'
  },
  components: {
    HomeRouter: () => import('../components/HelloWorld.vue')
  }
}

export default new Router({
  mode: 'history',
  routes: [HomeRoutes, ...PageRoutes]
})
