active 项目模板

### 项目结构

```js
├── components           // 公用组件
├── router
|        ├── index.js
|        └── modules
|            ├── v1.js   //版本v1的路由
|            └── v2.js   //版本v2的路由
├── v1
|    ├── index           //版本v1 的首页
|    |    ├── components //组件
|    |    └── Index.vue  //版本v1 页面
|    ├── other           //版本v1 其他页面
|    └── planA           //版本v1 planA
├── v2
|    ├── index           //版本v2 的首页
|    └── other
├── ChildPage.vue        //承载不同版本的空页面
├── App.vue
├── index.js
└── index.server.js

```

> vuex 使用demo 详情见 `pages/template/v1/index/Index.vue` 文件
> router 的`modules` 配置使用 详情见 `pages/template/router/modules/v1.js` 文件