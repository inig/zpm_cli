/*
 * @Company: 智联招聘
 * @Author: pan.changzh
 * @Date: 2018-09-28 16:23:27
 * @LastEditors: pan.changzhi
 * @LastEditTime: 2019-02-14 10:00:57
 * @version: 0.0.0
 * @Description:
 */

import ChildPage from '../../ChildPage'

import index from '../../v1/index/Index.vue'
import other from '../../v1/other/Index.vue'
import planA from '../../v1/plan-a/Index.vue'

export default [
  {
    path: '/v1',
    component: ChildPage,
    children: [
      {
        path: '/',
        name: 'v1 index',
        meta: {
          title: 'v1 index'
        },
        component: index
      },
      {
        path: 'child',
        name: 'v1 child',
        meta: {
          title: 'v1 child'
        },
        component: other
      },
      {
        path: 'a',
        name: 'v1 planA',
        meta: {
          title: 'v1 planA'
        },
        component: planA
      }
    ]
  }
]
