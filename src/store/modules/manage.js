const manage = {
  state: {
    lastActive: ''
  },

  mutations: {
    SET_LASTACTIVE: (state, data) => {
      state.lastActive = data;
    }
  },

  actions: {
    changeLastActive ({ commit }, data) {
      commit('SET_LASTACTIVE', data);
    }
  }
};

export default manage;
