# zpm_cli

### 1. 全局安装zpm_cli
```$xslt
sudo npm install zpm_cli -g
```

### 2. 创建新weex项目
```$xslt
zpm init [, project_template] [, project_name] [, project_path]
```

### 3. 可用模板
###### 模板名 大小写不敏感
```$xslt
default 空白项目
 
vuex    包含vuex的项目
```

### 4. 项目结构

###### 目前脚手架提供了2套模板：default、vuex。
   
##### default模板的目录结构: 
```$xslt
  ├── assets              // 静态资源目录
 
  ├── components          // 组件目录
    
  ├── components          // 组件目录
   
  ├── index.js            // 入口js文件
  
  ├── index.server.js     // 服务端渲染的html
    
  ├── index.vue           // 根vue文件  
```
##### vuex模板的目录结构: 
```$xslt
  ├── assets              // 静态资源目录
 
  ├── components          // 组件目录
      
  ├── store               // vuex目录
  
      └── index.js
      
      └── actions.js
      
      └── getters.js
      
      └── mutation-types.js
      
      └── mutations.js
  
  ├── utils               // 工具目录
  
      └── base-url.js
  
  ├── filters             // 过滤器目录
  
      └── index.js
  
  ├── mixins              // mixins目录
  
      └── index.js
   
  ├── index.js            // 入口js文件
  
  ├── index.server.js     // 服务端渲染的html
    
  ├── index.vue           // 根vue文件
```
