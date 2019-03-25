import Vue from 'vue';
import Router from 'vue-router';

// 代码分割
const Index = () => import('./pages/Index.vue');
const Detail = () => import('./pages/Detail.vue');
const MasterDetail = () => import('./pages/master-detail/index.vue');

const routes = [
  {
    path: '/index1',
    name: 'index',
    component: Index
  },
  { 
    path: '/detail',
    name: 'detail',
    component: Detail
  },
  { 
    path: '/master-detail',
    name: 'master-detail',
    component: MasterDetail
  },
];

Vue.use(Router);

export function createRouter () {
  const router = new Router({
    mode: 'history',
    routes
  });

  return router;
};
