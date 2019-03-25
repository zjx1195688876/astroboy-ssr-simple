// 降级为客户端渲染，服务端渲染的时候其实用不到这个文件
import Vue from 'vue';
import App from './App.vue';
// 以下公用了服务端渲染的创建router和store实例的方法
import { createRouter } from './router';
import { createStore } from './store';

const store = createStore();
const router = createRouter();

new Vue({
    el: '#degrade-app', // 降级为客户端渲染的容器
    store,
    router,
    render: h => h(App)
});
