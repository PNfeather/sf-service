import {login, serviceList} from '@/api/user';
import {schoolList, gradeList} from '@/api/baseData';
import { message } from 'ant-design-vue';
import router from '@/router';
import storage from '@/tools/storage';

const user = {
  state: {
    userInfo: storage.get('userInfo') || {},
    serviceList: storage.get('serviceList') || [],
    schoolList: storage.get('schoolList') || [],
    gradeList: storage.get('gradeList') || [],
    subjectList: [
      {name: '全部', id: ''},
      {name: '语文', id: '0'},
      {name: '数学', id: '1'},
      {name: '英语', id: '2'},
      {name: '政治思品', id: '3'},
      {name: '物理', id: '4'},
      {name: '化学', id: '5'},
      {name: '历史', id: '6'},
      {name: '地理', id: '7'},
      {name: '生物', id: '8'},
      {name: '科学', id: '9'},
      {name: '信息技术', id: '10'},
      {name: '其他', id: '11'}
    ]
  },

  mutations: {
    SET_USERINFO: (state, data) => {
      state.userInfo = data;
    },
    SET_SERVICELIST: (state, data) => {
      storage.set('serviceList', data);
      state.serviceList = data;
    },
    SET_SCHOOLLIST: (state, data) => {
      storage.set('schoolList', data);
      state.schoolList = data;
    },
    SET_GRADELIST: (state, data) => {
      storage.set('gradeList', data);
      state.gradeList = data;
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
          // 登录成功客户列表数据缓存
          serviceList().then(response => {
            let reData = response.data;
            if (reData.code == '0') {
              commit('SET_SERVICELIST', reData.data);
            } else {
              message.error(reData.message);
            }
          });
          // 登录成功学校列表数据缓存
          schoolList().then(res => {
            let data = res.data;
            if (data.code == 0) {
              let reData = data.data;
              commit('SET_SCHOOLLIST', reData);
            } else {
              this.$message.error(data.msg);
            }
          }).catch((err) => {
            this.$message.error(err);
          });
          // 登录成功年级列表数据缓存
          gradeList().then(res => {
            let data = res.data;
            if (data.code == 0) {
              let reData = data.data;
              commit('SET_GRADELIST', reData);
            } else {
              this.$message.error(data.msg);
            }
          }).catch((err) => {
            this.$message.error(err);
          });
          message.success('登录成功');
          if (values.autoBack) {
            router.go(-1);
          } else {
            router.push('/manage');
          }
        } else {
          message.error(data.message);
        }
      });
    }
  }
};

export default user;
