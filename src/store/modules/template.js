import storage from '@/tools/storage';
const template = {
  state: {
    currentChooseImg: storage.get('currentChooseImg') || {},
    currentEditTemplate: storage.get('currentEditTemplate') || {}
  },

  mutations: {
    SET_CURRENTCHOOSEIMG: (state, data) => {
      state.currentChooseImg = data;
    },
    SET_CURRENTEDITTEMPLATE: (state, data) => {
      state.currentEditTemplate = data;
    }
  },

  actions: {
    passChooseImg ({ commit }, data) {
      storage.set('currentChooseImg', data);
      commit('SET_CURRENTCHOOSEIMG', data);
    },
    passTemplate ({ commit }, data) {
      storage.set('currentEditTemplate', data);
      commit('SET_CURRENTEDITTEMPLATE', data);
    }
  }
};

export default template;
