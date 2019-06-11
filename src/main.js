// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import http from '@/plugins/http';
import store from './store/';
import HeadTop from '@C/headTop';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import VueLazyload from 'vue-lazyload';

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('@IMG/loading.jpg'),
  attempt: 1,
  // the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend']
  listenEvents: [ 'scroll' ]
});

(process.env.BASE_URL == '/api') && process.env.MOCK && require('@/mock');

Vue.use(http.install);

Vue.use(Antd);

Vue.component(HeadTop.name, HeadTop);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
