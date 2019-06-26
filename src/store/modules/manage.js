const manage = {
  state: {
    lastActive: '' // 菜单栏选中位置
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
