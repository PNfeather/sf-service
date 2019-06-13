import {login, serviceList} from '@/api/user';
import { message } from 'ant-design-vue';
import router from '@/router';
import storage from '@/tools/storage';

const user = {
  state: {
    userInfo: storage.get('userInfo') || {},
    serviceList: storage.get('serviceList') || []
  },

  mutations: {
    SET_USERINFO: (state, data) => {
      state.userInfo = data;
    },
    SET_SERVICELIST: (state, data) => {
      state.serviceList = data;
    }
  },

  actions: {
    // 获取用户信息
    login ({commit}, values) {
      login({
        account: values.account,
        password: values.password
      }).then(res => {
        let data = res.data;
        if (data.code == '0') {
          storage.set('userInfo', data.data);
          commit('SET_USERINFO', data.data);
          serviceList().then(response => {
            let reData = response.data;
            if (reData.code == '0') {
              storage.set('serviceList', reData.data);
              commit('SET_SERVICELIST', reData.data);
            } else {
              message.error(data.message);
            }
          });
          message.success('登录成功');
          router.push('/manage');
        } else {
          message.error(data.message);
        }
      });
    }
  }
};

export default user;
