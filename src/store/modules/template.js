import storage from '@/tools/storage';
const template = {
  state: {
    currentEditTemplate: storage.get('currentEditTemplate') || {}
  },

  mutations: {
    SET_CURRENTEDITTEMPLATE: (state, data) => {
      state.currentEditTemplate = data;
    }
  },

  actions: {
    passTemplate ({ commit }, data) {
      storage.set('currentEditTemplate', data);
      commit('SET_CURRENTEDITTEMPLATE', data);
    }
  }
};

export default template;
