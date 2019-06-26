<template>
  <div name='missionDetail' class="fillcontain">
    <div class="title">
      <titleBack title="返回任务列表"></titleBack>
    </div>
    <div class="detail">
      <missionContent :workId="workId" v-model="title"></missionContent>
    </div>
    <div class="submitBtn">
      <a-button type="primary" class="submit" @click="goStart">开始制作</a-button>
    </div>
  </div>
</template>

<script type='text/babel'>
  import titleBack from '@C/titleBack.vue';
  import missionContent from '@C/missionContent.vue';
  export default {
    name: 'missionDetail',
    data () {
      let query = this.$route.query;
      return {
        workId: query.workId,
        title: ''
      };
    },
    methods: {
      goStart () {
        this.$router.push({path: 'taskStart', query: {workId: this.workId, pageType: 'missionTemplate', title: this.title}});
      }
    },
    components: {
      titleBack,
      missionContent
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'missionDetail']{
    display: flex;
    flex-direction: column;
    .title{
      flex: 60px 0 0;
    }
    .detail{
      overflow: scroll;
    }
    .submitBtn{
      width: 100%;
      flex: 100px 0 0;
      .fac();
      .submit{
        width: 240px;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
      }
    }
  }
</style>
