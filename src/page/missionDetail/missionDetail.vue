<template>
  <div name='missionDetail' class="fillcontain">
    <div class="title">
      <titleBack title="返回任务列表">
        <div slot="center" class="taskName fillcontain">
          {{title}}
        </div>
        <div slot="right" class="right-btn-group fillcontain">
          <a-button type="primary" class="funBtn" @click="goResourceChoiceList">资源库导入</a-button>
          <a-upload
            name="file"
            accept="image/*"
            class="taskStart-upload"
            :showUploadList='false'
            :customRequest="customRequest">
            <a-button type="primary" class="funBtn" @click="changeImg">从本地替换</a-button>
          </a-upload>
        </div>
      </titleBack>
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
    created () {
      this.pageInit();
    },
    methods: {
      pageInit () {
        let resourceChoiceList = [...this.$store.getters.resourceChoiceList];
        if (resourceChoiceList.length) {
          console.log('从资源库载入了模板，id为', resourceChoiceList);
          this.$store.dispatch('changeResourceChoiceList', []); // 导入后清空vuex缓存数据
        }
      },
      goStart () {
        this.$router.push({path: 'taskStart', query: {workId: this.workId, pageType: 'missionTemplate', title: this.title}});
      },
      goResourceChoiceList () {
        this.$router.push({path: 'resourcePick', query: { fromName: '作业制作', choiceType: 'radio' }});
      },
      changeImg () {
        console.log('点击上传');
      },
      customRequest (data) { // 自定义上传事件
        console.log(data);
        // const {file} = data;
        // fileUpload({'file': file}).then(res => {
        //   if (res.data.code == 0) {
        //     this.pageImgUrl = res.data.data.url;
        //     this.resetImg();
        //   } else {
        //     this.$message.error(res.data.message);
        //   }
        // });
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
      .taskName{
        .fac();
        font-size: 22px;
        color: #333333;
      }
      .right-btn-group{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .funBtn{
          margin-right: 20px;
        }
      }
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
