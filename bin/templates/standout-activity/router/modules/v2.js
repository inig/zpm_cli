/*
 * @Company: 智联招聘
 * @Author: pan.changzh
 * @Date: 2018-11-20 16:20:12
 * @LastEditors: pan.changzhi
 * @LastEditTime: 2019-02-14 10:02:01
 * @version: 0.0.0
 * @Description:
 */
import ChildPage from '../../ChildPage'
import index from '../../v2/index/Index.vue'
import other from '../../v2/other/Index.vue'

export default [
  {
    path: '/v2',
    component: ChildPage,
    children: [
      {
        path: '/',
        name: 'v2 index',
        meta: {
          title: 'v2 index'
        },
        component: index
      },
      {
        path: 'child',
        name: 'v2 child',
        meta: {
          title: 'v2 child'
        },
        component: other
      }
    ]
  }
]
