<template>
  <div name='taskStart' class="fillcontain">
    <div class="title">
      <titleBack :title="backTitle" customBack @back="back"></titleBack>
    </div>
    <div class="template fillcontain">
      <section class="functional">
        <div class="title" v-show="s1 || s3 || s4 || s5">今日化学作业模板列表</div>
        <div class="search" v-show="s2">
          <a-input v-model="templateName" class="input" placeholder="请输入资源名称"/>
          <a-button type="primary" @click="searchResource">搜索</a-button>
        </div>
        <div class="btnGroup">
          <a-button type="primary" class="funBtn" :class="{active: showWorkSortNum}" @click="openSort" v-show="s1 || s4">{{!showWorkSortNum ? '排序' : '完成排序'}}</a-button>
          <a-button type="primary" class="funBtn" @click="checkTask" v-show="s1 || s2 || s3">查看作业</a-button>
          <a-button type="primary" class="funBtn" @click="goResourceChoiceList" v-show="s1">资源库</a-button>
          <a-upload
            v-show="s1 || s4"
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
      <section class="imgArea" ref="imgArea">
        <div class="noContent fillcontain" v-if="!templateList.length && (s1 || s4)">
          <img src="~@IMG/noContent.png" alt="">
          <p>请导入或者从资源库选择作业图片</p>
          <p>（单次导入最多99张图片）</p>
        </div>
        <div class="item" v-for="(item, index) in templateList" :key="index" v-if="s1 || s4">
          <div class="delete" @click.stop="deleteTemplate(index)">
            <i class="iconfont iconClose"></i>
          </div>
          <div class="finished">
            <i class="iconfont iconFinished2"></i>
          </div>
          <img :src="item.url" alt="" @click="goMake(item)">
          <p v-show="!showWorkSortNum"><span v-show="item.serialNumber">第{{item.serialNumber}}页</span></p>
          <p v-show="showWorkSortNum"><span>序号:<a-input
            :value="item.workSortNum"
            style="width: 60px;margin-left: 5px;text-align: center;"
            @change="inputChangeScore(item, index, $event)"
            @blur="onBlur(item, index, $event)"
          /></span></p>
        </div>
        <div class="item" v-for="(item, index) in resourceList" :key="index" @click="goTemplateChoiceList(item)" v-if="s2">
          <img src="~@IMG/default.jpg" alt="">
          <p><span>sdfsdfsdf</span></p>
        </div>
        <div class="item" v-for="(item, index) in templateChoiceList" :key="index" @click="choiceTemplate(item)" v-if="s3">
          <div class="choiceIcon">
            <i class="iconfont iconFinished" :class="{'selected': selectedList.includes(item.id)}"></i>
          </div>
          <img src="~@IMG/default.jpg" alt="">
          <p><span>第{{index + 1}}页</span></p>
        </div>
        <div class="item" v-for="(item, index) in templateList" :key="index" v-if="s5">
          <img :src="item.url" alt="">
          <p><span v-show="item.serialNumber">第{{item.serialNumber}}页</span></p>
        </div>
      </section>
      <section class="submitBtn" v-show="s1 || s4">
        <a-button type="primary" class="submit" @click="temSave">暂存</a-button>
        <a-button type="primary" class="submit" @click="submit" :disabled="submitToggle">发布</a-button>
      </section>
      <section class="paginationArea" v-show="s2">
        <a-pagination
          :style="{flex: '100px 0 0', paddingTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'}"
          :pageSizeOptions="pageSizeOptions"
          :total="count"
          :showTotal="total => `共 ${total} 条记录`"
          showSizeChanger
          :defaultPageSize="10"
          v-model="currentPage"
          showQuickJumper
          @change="changePage"
          @showSizeChange="onShowSizeChange">
        </a-pagination>
      </section>
      <section class="submitBtn" v-show="s3">
        <a-button class="submit" @click="goResourceChoiceList">取消</a-button>
        <a-button type="primary" class="submit">确认</a-button>
      </section>
    </div>
    <a-modal
      title="查看作业"
      v-model="visible"
      centered
      class="missionModal"
      @cancel="closeMissionContent"
      width="88%"
      :footer="null">
      <missionContent ref="missionContent" :workId="workId" class="fillcontain"></missionContent>
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
        pageType: query.pageType || 'missionTemplate', // missionTemplate作业模板制作页，resourceChoiceList图文资源库选择页，templateChoiceList模板选择页，resourceMakeStart资源模板制作页,checkTemplate查看模板页
        startUploadToggle: false,
        uploadModal: false,
        totalUpload: 0, // 总上传图片数
        doneUpload: 0, // 已完成上传图片数
        submitToggle: false,
        workId: query.workId,
        visible: false,
        templateList: [], // 模板列表
        resourceList: new Array(20), // 资源列表
        selectedList: [], // 已选择模板数组
        templateName: '',
        pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
        templateChoiceList: [{id: 1}, {id: 2}, {id: 3}, {id: 4}], // 模板选择列表
        skip: 0,
        limit: 10,
        currentPage: 1,
        count: 0,
        pageTypeConfig: {
          missionTemplate: {
            backTitle: '返回任务列表',
            backMethod: 'backTaskList'
          },
          resourceChoiceList: {
            backTitle: '返回模板列表',
            backMethod: 'goMissionTemplate'
          },
          templateChoiceList: {
            backTitle: '返回资源库',
            backMethod: 'goResourceChoiceList'
          },
          resourceMakeStart: {
            backTitle: '返回资源库',
            backMethod: 'backResource'
          },
          checkTemplate: {
            backTitle: '返回资源库',
            backMethod: 'backResource'
          }
        },
        showWorkSortNum: false // 排序开关
      };
    },
    activated () {
      let query = this.$route.query;
      this.pageType = query.pageType;
      this.workId = query.workId;
    },
    computed: {
      currentPageConfig () {
        return this.pageTypeConfig[this.pageType];
      },
      backTitle () {
        return this.currentPageConfig.backTitle;
      },
      uploadPercent () {
        return Math.floor(100 * this.doneUpload / this.totalUpload);
      },
      s1 () { // missionTemplate作业模板制作页
        return (this.pageType === 'missionTemplate');
      },
      s2 () { // resourceChoiceList图文资源库选择页
        return (this.pageType === 'resourceChoiceList');
      },
      s3 () { // templateChoiceList模板选择页
        return (this.pageType === 'templateChoiceList');
      },
      s4 () { // resourceMakeStart资源模板制作页
        return (this.pageType === 'resourceMakeStart');
      },
      s5 () { // checkTemplate查看模板页
        return (this.pageType === 'checkTemplate');
      }
    },
    watch: {
      'templateList.length' () {
        this.templateList.forEach((item, index) => {
          item.workSortNum = index + 1;
          item.serialNumber = index + 1; // todo 待删除
        });
      }
    },
    mounted () {
      this.templateList = JSON.parse(window.localStorage.getItem('templateList')) || []; // todo 待删除
    },
    methods: {
      openSort () {
        this.showWorkSortNum = !this.showWorkSortNum;
      },
      inputChangeScore (item, index, e) {
        const { value } = e.target;
        const reg = /^(0|[1-9][0-9]*)$/;
        if ((!isNaN(value) && reg.test(value)) || value === '') {
          item.workSortNum = value;
          this.templateList.splice(index, 1, item);
        }
      },
      onBlur (item, index, e) {
        if (index + 1 != item.workSortNum) {
          const { value } = e.target;
          let tem = {...item};
          let max = this.templateList.length;
          if (value === '') {
            tem.workSortNum = 1;
          } else if (value - 0 > max) {
            tem.workSortNum = max;
          }
          this.templateList.splice(index, 1);
          this.templateList.splice(tem.workSortNum - 1, 0, tem);
          this.templateList.forEach((item, cIndex) => {
            this.$set(item, 'workSortNum', cIndex + 1);
          });
        }
      },
      closeMissionContent () {
        this.$refs.missionContent.pause();
      },
      back () {
        this[this.currentPageConfig.backMethod]();
      },
      backTaskList () {
        this.$router.push('missionList');
      },
      backResource () {
        this.$router.push('resource');
      },
      goMissionTemplate () { // 页面切换到任务末班
        this.pageType = 'missionTemplate';
      },
      goResourceChoiceList () { // 页面切换到资源列表
        this.pageType = 'resourceChoiceList';
      },
      goTemplateChoiceList () { // 页面切换到模板选择列表
        this.pageType = 'templateChoiceList';
      },
      choiceTemplate (item) {
        let index = this.selectedList.indexOf(item.id);
        if (index > -1) {
          this.selectedList.splice(index, 1);
        } else {
          this.selectedList.push(item.id);
        }
      },
      onShowSizeChange (current, pageSize) {
        this.currentPage = current;
        this.limit = pageSize;
        this.skip = (current - 1) * this.limit;
      },
      changePage (current) {
        this.currentPage = current;
        this.skip = (current - 1) * this.limit;
      },
      searchResource () {
        console.log('搜资源');
      },
      checkTask () {
        this.visible = true;
      },
      startUpload () {
        this.startUploadToggle = true;
      },
      beforeUpload (info) { // 只导入
        getBase64(info, (imageUrl) => {
          this.templateList.push({
            url: imageUrl
          });
          window.localStorage.setItem('templateList', JSON.stringify(this.templateList)); // todo 待删除
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
        this.$store.dispatch('passChooseImg', JSON.stringify(item));
        this.$router.push({path: 'imgAdjust', query: {workId: this.workId}});
      },
      deleteTemplate (index) {
        this.templateList.splice(index, 1);
      },
      submit () {
        console.log('发布');
      },
      temSave () {
        console.log('暂存');
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
        .search{
          flex: 1;
          font-size: 22px;
          color: #333333;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .input{
            width: 220px;
            margin-right: 10px;
          }
        }
        .btnGroup{
          flex: 1;
          .fj(flex-end);
          .active{
            background: #F7BA0A!important;
            border: none!important;
          }
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
          .finished{
            position: absolute;
            top: 0;
            left: 10px;
            i{
              font-size: 45px;
              color: #E46948;
            }
          }
          .delete{
            position: absolute;
            top: 5px;
            right: 5px;
            z-index: 3;
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
          margin: 0 20px;
          width: 240px;
          height: 50px;
          line-height: 50px;
          font-size: 16px;
        }
      }
      .paginationArea{
        width: 100%;
        flex: 100px 0 0;
        .fac();
        flex-direction: column;
      }
    }
  }
</style>
