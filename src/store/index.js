import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import template from './modules/template';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    template
  },
  getters
});

export default store;
