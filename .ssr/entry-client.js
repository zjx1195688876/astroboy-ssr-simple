// 仅运行于浏览器
// 客户端 entry 只需创建应用程序，并且将其挂载到 DOM 中
import { createApp } from '@ssr/app';

const { app, router, store } = createApp();

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);

    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false;
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c));
    });
    if (!activated.length) {
      return next();
    }

    Promise.all(activated.map(Component => {
      if (Component.asyncData) {
        return Component.asyncData({ store });
      }
    }))
    .then(() => {
      next();
    }).catch(next)
  })

  if (window.__INITIAL_STATE__) {
    app.$mount('#app');
  }
});
