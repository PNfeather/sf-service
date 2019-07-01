// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import http from '@/plugins/http';
import '@/tools/directives/imgLazy'; // 图片懒加载指令
import store from './store/';
import Antd from 'ant-design-vue';
import HeadTop from '@C/headTop';
import fcLoading from '@C/fcLoading';
import 'ant-design-vue/dist/antd.css';

(process.env.BASE_URL == '/api') && process.env.MOCK && require('@/mock');

Vue.prototype.$CJIMGURL = process.env.CJIMGURL; // oss图片域名
Vue.prototype.$OSSIMGADJUST = '?x-oss-process=image/auto-orient,1'; // oss图片自动旋正
Vue.prototype.$OSSIMGADJUSTMINI = '?x-oss-process=image/resize,w_200,auto-orient,1'; // oss图片自动旋正并缩略200比例

Vue.use(http.install);

Vue.use(Antd);

Vue.component(HeadTop.name, HeadTop);
Vue.component(fcLoading.name, fcLoading);

let setHtmlFontSize = () => {
  // 1366是设计稿的宽度，当大于1366时采用1366宽度，比例也是除以13.66
  let deviceWidth = document.documentElement.clientWidth > 1440 ? 1440 : document.documentElement.clientWidth;
  document.getElementsByTagName('html')[0].style.cssText = 'font-size:' + deviceWidth / 14.4 + 'px !important';
};

setHtmlFontSize();

if (window.addEventListener) {
  window.addEventListener('resize', function () {
    setHtmlFontSize();
  }, false);
}

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
