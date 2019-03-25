# 1. 目录结构
```
- build
- static
- app
  |- controller
  |- service
  |- extends // 内置对象扩展
  |- routers
  |- views // ssr的模版文件
  |- server.js // 统一启动server
- client
  |- components
  |- store
  |- pages
  |- App.vue
  |- main.js // 仅降级为客户端渲染的时候才用到
  |- router.js
  |- utils
  |- mixin
-.ssr
  |- app.js // 统一入口
  |- entry-server.js
  |- entty-client.js
- package.json
- README.md
```


## 2. 本地开发
### 1. SPA SSR:

```
纯SSR：

npm run dev // 启动server服务
npm run build-dev:client // 监听静态文件的修改 --watch
npm run build-dev:server // 监听静态文件的修改 --watch


降级为CSR：
npm run dev:degrade // 启动server服务
npm run build-dev:degrade // 监听静态文件的修改 --watch

```

### 2. MUTI SSR:

```
纯SSR：

npm run dev // 启动server服务
npm run build-dev // 监听静态文件的修改 --watch


降级为CSR：
npm run dev:degrade // 启动server服务
npm run build-dev:degrade // 监听静态文件的修改 --watch

```

## 3. 新增mock的middleware，使得SSR环境下，node的请求转发也能被拦截到
```
middleware目录：app/middlewares/mock.js

使用：config/middleware.default.js
'mock': {
  priority: 100,
  enable: true,
  path: path.join(ROOT_PATH, '/app/middlewares/mock')
}

在项目根目录新增mock文件夹,mock数据读取规则：
/edu/getTeacherInfo.json -> mock/edu/getTeacherInfo.json

```

## 4. 需要ssr-plugin生效，需要在config.default.js配置路径信息，因为plugin读取相关路径(ssr-plugin可以整合SPA和MUTI的情况)
```
// SSR SPA
'ssr-plugin': {
  bundlePath: path.join(ROOT_PATH, '/static/build/server/vue-ssr-server-bundle.json'), // vue-ssr-server-bundle.json的路径
  templatePath: path.join(ROOT_PATH, '/app/views/index.html'), // 服务端渲染的模版文件路径
  clientManifestPath: path.join(ROOT_PATH, '/static/build/server/vue-ssr-client-manifest.json'), // vue-ssr-client-manifest.json的路径
  degradePath: path.join(ROOT_PATH, '/static/build/degrade/pages/index.degrade.html') // 降级为SPA的文件
}

// SSR MUTI
'ssr-plugin': {
  bundlePath: path.join(ROOT_PATH, '/static/build/server'), // vue-ssr-server-bundle.json的路径, dir
  templatePath: path.join(ROOT_PATH, '/app/views/index.html'), // 服务端渲染的模版文件路径
  clientManifestPath: path.join(ROOT_PATH, '/static/build/server'), // vue-ssr-client-manifest.json的路径, dir
  degradePath: path.join(ROOT_PATH, '/static/build/degrade') // 降级为SPA的文件, dir
}
```
