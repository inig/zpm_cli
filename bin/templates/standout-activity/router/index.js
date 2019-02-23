import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

let router = new Router({
  base: '/', // 应用的基路径
  mode: 'hash', // "hash" (URL hash 模式) | "history"(HTML5 History 模式) | "abstract" (Node.js 环境)
  scrollBehavior (to, from, savedPosition) {
    // 路由切换的滚动行为，只在 HTML5 history 模式下可用
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  routes: [...(r => {
    // 去中心化
    let sourceMap = []
    // eslint-disable-next-line
      let res = r.keys().map(key => {
      let rKey = r(key)
      sourceMap.push(...rKey.default)
      return rKey
    })
    return sourceMap
  })(require.context('./', true, /^\.\/modules\/\w+\.js$/)),
  {
    path: '/',
    redirect: '/v1'
  }
  ]
})

console.log(router)

// 全局路由切换前执行
router.beforeEach((to, from, next) => {
  // #region 路由发生变化修改页面title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // #endregion

  next() // 正常跳转
})

router.afterEach((to, from) => {
  // console.log(to.query)
})

export default router
