const user = {
  state: {
    name: '',
    orgId: ''
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_ORGID: (state, orgId) => {
      state.orgId = orgId;
    }
  },

  actions: {
    // 获取用户信息
  }
};

export default user;
