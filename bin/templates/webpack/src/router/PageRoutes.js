export default [
  {
    path: '/home',
    name: 'home',
    meta: {
      title: 'home'
    },
    components: {
      HomeRouter: () => import('../components/HelloWorld.vue')
    }
  },
  {
    path: '/home2',
    name: 'home2',
    meta: {
      title: 'home2'
    },
    components: {
      HomeRouter: () => import('../components/HelloWorld.vue')
    }
  },
  {
    path: '/home3',
    name: 'home3',
    meta: {
      title: 'home3'
    },
    components: {
      HomeRouter: () => import('../components/HelloWorld.vue')
    }
  }
]
