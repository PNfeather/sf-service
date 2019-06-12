<template>
  <div name='manage' class="fillcontain">
    <headTop></headTop>
    <a-layout class="fillcontain">
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
        <a-layout-content class="layout-content">
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
    computed: {
      defaultActive () {
        return this.$route.path.replace('/', '');
      }
    },
    methods: {
      changePage (item) {
        this.$router.push(item.key);
      }
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'manage']{
    padding-top: 60px;
    .iconfont{margin-right: .14rem}
    .layout-content{
      margin: .3rem;
      background: #fff;
      min-height: 280px;
      box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
      border-radius: 2px;
    }
  }
</style>
