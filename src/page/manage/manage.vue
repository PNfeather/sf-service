<template>
  <div name='manage' class="fillcontain">
    <a-layout class="fillcontain">
      <a-layout-header class="header">
        <div class="text">
          <div class="title">闪批作业客服系统</div>
          <div class="name">{{userName}}</div>
        </div>
        <a-dropdown class="logout" :trigger="['click']">
          <div>
            <img :src="defaultImg" alt="">
            <a-icon type="down" />
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;" @click="logout">退出</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-layout-header>
      <a-layout>
        <a-layout-sider
          :trigger="null"
          collapsible>
          <a-menu theme="dark" mode="inline" :defaultSelectedKeys="[defaultActive]" :style="{paddingTop: '.18rem'}" @click="changePage">
            <a-menu-item key="manage">
              <i class="iconfont iconMissionList"></i>
              <span>任务列表</span>
            </a-menu-item>
            <a-menu-item key="resource">
              <i class="iconfont iconResource"></i>
              <span>资源库</span>
            </a-menu-item>
            <a-menu-item key="taskManage">
              <i class="iconfont iconTaskManage"></i>
              <span>作业管理</span>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout-content  :style="{ margin: '.3rem', background: '#fff', minHeight: '280px' }">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script type='text/babel'>
  export default {
    data () {
      return {
        defaultImg: require('@IMG/default.jpg'),
        userName: '******'
      };
    },
    computed: {
      defaultActive () {
        return this.$route.path.replace('/', '');
      }
    },
    methods: {
      logout () {
        console.log('退出登录');
      },
      changePage (item) {
        this.$router.push(item.key);
      }
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'manage']{
    .header{
      background-image: linear-gradient(46deg, #3B60F1 0%, #44B6FA 100%);
      display: flex;
      .text{
        .fj();
        flex: 1;
        color: #FFFFFF;
        .title{
          flex: 1;
          font-size: .2rem;
          float: left;
        }
        .name{
          flex: 1;
          text-align: right;
          font-size: .2rem;
        }
      }
      .logout{
        height: 100%;
        float: right;
        .fj();
        color: #FFFFFF;
        img{
          flex: .4rem 0 0;
          width: .4rem;
          height: auto;
          margin-left: .08rem;
        }
        .anticon{
          flex: .12rem 0 0;
          margin: 0 .05rem;
        }
      }
    }
    .iconfont{margin-right: .14rem}
  }
</style>
