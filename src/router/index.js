import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const login = r => require.ensure([], () => r(require('@/page/login/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage/manage')), 'manage');
const missionList = r => require.ensure([], () => r(require('@/page/missionList/missionList')), 'missionList');
const resource = r => require.ensure([], () => r(require('@/page/resource/resource')), 'resource');
const taskManage = r => require.ensure([], () => r(require('@/page/taskManage/taskManage')), 'taskManage');

const routes = [
  {
    path: '/',
    component: login
  },
  {
    path: '/manage',
    component: manage,
    name: '',
    children: [
      {
        path: '',
        component: missionList
      }, {
        path: '/resource',
        component: resource
      }, {
        path: '/taskManage',
        component: taskManage
      }
    ]
  }
];

export default new Router({
  routes,
  strict: process.env.NODE_ENV !== 'production'
});
