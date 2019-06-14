<template>
  <div name='taskStart' class="fillcontain">
    <div class="title">
      <titleBack title="返回任务列表" customBack @back="backTaskList"></titleBack>
    </div>
    <div class="template fillcontain">
      <section class="functional">
        <div class="title">今日化学作业模板列表</div>
        <div class="btnGroup">
          <a-button type="primary" class="funBtn" @click="checkTask">查看作业</a-button>
          <a-button type="primary" class="funBtn" @click="goResource">资源库</a-button>
          <a-upload
            name="file"
            :multiple="true"
            accept="image/*"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            class="taskStart-upload"
            :showUploadList='false'
            :beforeUpload="beforeUpload"
            @change="leadImg">
            <a-button type="primary" class="funBtn" @click="startUpload">导入图片</a-button>
          </a-upload>
        </div>
      </section>
      <section class="imgArea">
        <div class="noContent fillcontain" v-if="!templateList.length">
          <img src="~@IMG/noContent.png" alt="">
          <p>请导入或者从资源库选择作业图片</p>
          <p>（单次导入最多99张图片）</p>
        </div>
        <div class="item" v-for="(item, index) in templateList" :key="index" @click="goMake(item)">
          <div class="delete">
            <i class="iconfont iconClose"></i>
          </div>
          <img :src="item.url" alt="">
          <p>第{{index + 1}}页</p>
        </div>
      </section>
      <section class="submitBtn">
        <a-button type="primary" class="submit" @click="submit" :disabled="submitToggle">发布</a-button>
      </section>
    </div>
    <a-modal
      title="查看作业"
      v-model="visible"
      centered
      class="missionModal"
      width="88%"
      :footer="null">
      <missionContent :workId="workId" class="fillcontain"></missionContent>
    </a-modal>
    <a-modal
      v-model="uploadModal"
      centered
      width="450px"
      class="taskStart-uploadModal"
      :footer="null">
      <div class="uploadInfo">
        <a-progress :percent="uploadPercent" status="active" />
        <p>图片上传中（{{doneUpload}}/{{totalUpload}}）…</p>
      </div>
    </a-modal>
  </div>
</template>

<script type='text/babel'>
  import titleBack from '@C/titleBack.vue';
  import missionContent from '@C/missionContent.vue';
  import getBase64 from '@/tools/getBase64';
  export default {
    name: 'taskStart',
    data () {
      let query = this.$route.query;
      return {
        startUploadToggle: false,
        uploadModal: false,
        totalUpload: 0, // 总上传图片数
        doneUpload: 0, // 已完成上传图片数
        submitToggle: false,
        workId: query.workId,
        visible: false,
        templateList: []
      };
    },
    created () {},
    mounted () {},
    computed: {
      uploadPercent () {
        return Math.floor(100 * this.doneUpload / this.totalUpload);
      }
    },
    watch: {},
    methods: {
      backTaskList () {
        this.$router.push('missionList');
      },
      checkTask () {
        this.visible = true;
      },
      goResource () {
        console.log('资源库');
      },
      startUpload () {
        this.startUploadToggle = true;
      },
      beforeUpload (info) { // 只导入
        getBase64(info, (imageUrl) => {
          this.templateList.push({
            url: imageUrl
          });
        });
        return false;
      },
      leadImg (info) { // 导入后直接上传
        if (info.file.status !== 'uploading') {
          // this.startUploadToggle && (this.totalUpload = info.fileList.length) && (this.uploadModal = true) && (this.startUploadToggle = false); // 每次点击导入图片只触发一次弹框打开,手动关闭后，后续上传不渲染
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          this.doneUpload += 1;
          getBase64(info.file.originFileObj, (imageUrl) => {
            this.templateList.push({
              url: imageUrl
            });
          });
          this.uploadModal && (this.$message.success(`${info.file.name} 上传成功`));
          (this.doneUpload === this.totalUpload) && (this.uploadModal = false);
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 上传失败`);
        }
      },
      goMake (item) {
        this.$store.dispatch('passTemplate', JSON.stringify(item));
        this.$router.push('imgAdjust');
      },
      submit () {
        console.log('发布');
      }
    },
    components: {
      titleBack,
      missionContent
    }
  };
</script>
<style lang="less">
  .missionModal{
    width: 88%;
    height: 88%;
    .ant-modal-content{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .ant-modal-header{
        flex: 55px 0 0;
      }
      .ant-modal-body{
        flex: 1;
        overflow-y: scroll;
      }
    }
  }
  .taskStart-uploadModal{
    .uploadInfo{
      height: 190px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 80%;
      margin: 0 auto;
      p{
        margin-top: 36px;
        font-size: 14px;
        color: #333333;
      }
    }
  }
</style>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'taskStart']{
    display: flex;
    flex-direction: column;
    .title{
      flex: 60px 0 0;
    }
    .template{
      padding: 30px;
      flex: 1;
      display: flex;
      flex-direction: column;
      .functional{
        flex: 30px 0 0;
        .fj();
        .title{
          flex: 1;
          font-size: 22px;
          color: #333333;
        }
        .btnGroup{
          flex: 1;
          .fj(flex-end);
          .funBtn{
            margin-left: 14px;
          }
        }
      }
      .imgArea{
        flex: 1;
        overflow-y: scroll;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin-top: 30px;
        .noContent{
          .fac();
          flex-direction: column;
          img{
            height: 185px;
            width: auto;
            margin-bottom: 30px;
          }
          p{
            font-size: 16px;
            color: #999999;
            text-align: center;
          }
        }
        .item{
          margin:0 18px 20px 0;
          flex: 190px 0 0;
          height: 274px;
          display: flex;
          flex-direction: column;
          border: 1px solid #E3EBF1;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          .delete{
            position: absolute;
            top: 5px;
            right: 5px;
            .wh(26px, 26px);
            .fac();
            border-radius: 100%;
            &:after{
              content: '';
              position: absolute;
              top: 2px;
              left: 2px;
              .wh(22px, 22px);
              background-color: #fff;
              border-radius: 100%;
              z-index: 1;
            }
            .iconfont{
              position: relative;
              z-index: 2;
              font-size: 26px;
              color: #E46948;
            }
          }
          img{
            flex: 1;
            width: 100%;
          }
          p{
            flex: 50px 0 0;
            line-height: 50px;
            text-align: center;
            font-size: 16px;
            color: #333333;
          }
        }
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
  }
</style>
