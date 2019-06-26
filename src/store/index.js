import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import template from './modules/template';
import getters from './getters';
import manage from './modules/manage';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    template,
    manage
  },
  getters
});

export default store;
