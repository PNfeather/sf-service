<template>
  <div name='manage' class="fillcontain">
    <headTop></headTop>
    <a-layout class="fillcontain">
      <a-layout>
        <a-layout-sider
          :trigger="null"
          width="140"
          collapsible>
          <a-menu theme="dark" mode="inline" :defaultSelectedKeys="[defaultActive]" :style="{paddingTop: '.18rem'}" @click="changePage">
            <a-menu-item key="missionList">
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
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script type='text/babel'>
  export default {
    data () {
      return {
        defaultActive: this.$route.path.replace('/', '')
      };
    },
    watch: {
      '$route' (val) {
        this.getDefaultActive(val);
      }
    },
    mounted () {
      this.getDefaultActive(this.$route);
    },
    methods: {
      getDefaultActive (val) {
        let active = val.path.replace('/', '');
        (active == 'manage') && (active = 'missionList');
        if (['missionList', 'resource', 'taskManage'].includes(active)) {
          this.defaultActive = active;
        }
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
    padding-top: 60px;
    .iconfont{margin-right: .14rem}
    .sider{
      width: 180px;
    }
    .layout-content{
      margin: .3rem;
      background: #fff;
      min-height: 280px;
      box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
      border-radius: 2px;
    }
  }
</style>
