// 仅运行于服务器
// 服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数
// 此文件负责：1. 服务器端路由匹配(server-side route matching); 2. 数据预取逻辑(data pre-fetching logic)。
import { createApp } from '@ssr/app';

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp(context.cookie || '');
    const url = context.url || '/';
    router.push(url);

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }
      // 对所有匹配的路由组件调用 `asyncData()`
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({ store, url });
        }
      }))
      .then(() => {
        context.state = store.state;
        resolve(app);
      })
      .catch(reject)
    }, reject)
  })
};
