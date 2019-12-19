import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 登录
const login = r => require.ensure([], () => r(require('@/page/login/login')), 'login');
// 主框架
const manage = r => require.ensure([], () => r(require('@/page/manage/manage')), 'manage');
// 空白页转换路由
const home = r => require.ensure([], () => r(require('@/page/home/home')), 'home');
// 任务列表页
const missionList = r => require.ensure([], () => r(require('@/page/missionList/missionList')), 'missionList');
// 作业详情页
const missionDetail = r => require.ensure([], () => r(require('@/page/missionDetail/missionDetail')), 'missionDetail');
// 作业制作初始页
const taskStart = r => require.ensure([], () => r(require('@/page/taskStart/taskStart')), 'taskStart');
// 资源选择
const resourcePick = r => require.ensure([], () => r(require('@/page/resource/resourcePick')), 'resourcePick');
// 资源库列表
const resource = r => require.ensure([], () => r(require('@/page/resource/resource')), 'resource');
// 新增资源
const startNewResource = r => require.ensure([], () => r(require('@/page/resource/startNewResource')), 'startNewResource');
// 作业管理
const taskManage = r => require.ensure([], () => r(require('@/page/taskManage/taskManage')), 'taskManage');
// 模板制作-图片调整
const imgAdjust = r => require.ensure([], () => r(require('@/page/makeTemplate/imgAdjust')), 'imgAdjust');
// 模板制作-框定题目区
const frameTemplate = r => require.ensure([], () => r(require('@/page/makeTemplate/frameTemplate')), 'frameTemplate');

const routes = [
  {
    path: '/',
    redirect: '/login'
  }, {
    path: '*',
    redirect: '/manage'
  }, {
    path: '/login',
    component: login
  }, {
    path: '/imgAdjust',
    component: imgAdjust
  }, {
    path: '/frameTemplate',
    component: frameTemplate
  }, {
    path: '/manage',
    component: manage,
    name: '',
    children: [
      {
        path: '',
        component: home
      }, {
        path: '/missionList',
        component: missionList,
        meta: {
          keepAlive: true
        }
      }, {
        path: '/missionDetail',
        component: missionDetail
      }, {
        path: '/taskStart',
        component: taskStart
      }, {
        path: '/resourcePick',
        component: resourcePick
      }, {
        path: '/resource',
        component: resource,
        meta: {
          keepAlive: true
        }
      }, {
        path: '/startNewResource',
        component: startNewResource
      }, {
        path: '/taskManage',
        component: taskManage,
        meta: {
          keepAlive: true
        }
      }
    ]
  }
];

export default new Router({
  routes,
  strict: process.env.NODE_ENV !== 'production'
});
