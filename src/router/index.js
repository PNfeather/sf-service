import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const login = r => require.ensure([], () => r(require('@/page/login/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home/home')), 'home');
const missionList = r => require.ensure([], () => r(require('@/page/missionList/missionList')), 'missionList');
const missionDetail = r => require.ensure([], () => r(require('@/page/missionDetail/missionDetail')), 'missionDetail');
const taskStart = r => require.ensure([], () => r(require('@/page/taskStart/taskStart')), 'taskStart');
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
        component: home
      }, {
        path: '/missionList',
        component: missionList
      }, {
        path: '/missionDetail',
        component: missionDetail
      }, {
        path: '/taskStart',
        component: taskStart
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
