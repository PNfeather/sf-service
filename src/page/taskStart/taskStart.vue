<template>
  <div name='taskStart' class="fillcontain">
    <div class="title">
      <titleBack :title="backTitle" customBack @back="back"></titleBack>
    </div>
    <div class="template fillcontain">
      <section class="functional">
        <div class="title" v-show="s1 || s3 || s4 || s5 || s6">
          <span v-text="title"></span>
          <div class="edit" v-show="s4" @click="goEditResource">
            <i class="iconfont iconEdit"></i>
          </div>
        </div>
        <div class="search" v-show="s2">
          <a-input v-model="templateName" class="input" placeholder="请输入资源名称"/>
          <a-button type="primary" @click="searchResource">搜索</a-button>
        </div>
        <div class="btnGroup">
          <a-button type="primary" class="funBtn" :class="{active: showWorkSortNum}" @click="openSort" v-show="s1 || s4">{{!showWorkSortNum ? '排序' : '完成排序'}}</a-button>
          <a-button type="primary" class="funBtn" @click="checkTask" v-show="s1 || s2 || s3 || s6">查看作业</a-button>
          <a-button type="primary" class="funBtn" @click="goResourceChoiceList" v-show="s1">资源库</a-button>
          <a-upload
            v-show="s1 || s4"
            name="file"
            :multiple="true"
            accept="image/*"
            class="taskStart-upload"
            :showUploadList='false'
            :customRequest="customRequest">
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
        <div class="item" v-for="(item, index) in templateList" :key="item.id || index" v-if="s1 || s4">
          <div class="delete" @click.stop="deleteTemplate(item, index)">
            <i class="iconfont iconClose"></i>
          </div>
          <div class="finished" v-show="item.finished">
            <i class="iconfont iconFinished2"></i>
          </div>
          <div class="img">
            <img crossOrigin="anonymous" v-imgLazy='`${$CJIMGURL + item.url + $OSSIMGADJUSTMINI}`' alt="" @click="goMake(item)">
          </div>
          <p v-show="!showWorkSortNum"><span v-show="item.serialNumber">第{{item.serialNumber}}页</span></p>
          <p v-show="showWorkSortNum && item.finished"><span>序号:<a-input
            :value="item.serialNumber"
            style="width: 60px;margin-left: 5px;text-align: center;"
            @change="inputChangeScore(item, index, $event)"
            @focus="cacheOldSort(item.serialNumber)"
            @blur="onBlur(item)"
          /></span></p>
        </div>
        <div class="item" v-for="(item, index) in resourceList" :key="item.id || index" @click="goTemplateChoiceList(item)" v-if="s2">
          <div class="img">
            <img crossOrigin="anonymous" v-imgLazy='`${$CJIMGURL + item.coverUrl + $OSSIMGADJUSTMINI}`' alt="">
          </div>
          <p><span>{{item.name}}</span></p>
        </div>
        <div class="item" v-for="(item, index) in templateChoiceList" :key="item.id || index" @click="choiceTemplate(item)" v-if="s3">
          <div class="choiceIcon">
            <i class="iconfont iconFinished" :class="{'selected': selectedList.includes(item.id)}"></i>
          </div>
          <div class="finished">
            <i class="iconfont iconFinished2"></i>
          </div>
          <div class="img">
            <img crossOrigin="anonymous" v-imgLazy='`${$CJIMGURL + item.url + $OSSIMGADJUSTMINI}`' alt="">
          </div>
          <p><span>第{{item.serialNumber}}页</span></p>
        </div>
        <div class="item" v-for="(item, index) in templateList" :key="item.id || index" v-if="s5 || s6">
          <div class="img" @click="openPreview(index)">
            <img crossOrigin="anonymous" v-imgLazy='`${$CJIMGURL + item.url + $OSSIMGADJUSTMINI}`' alt="">
          </div>
          <p><span v-show="item.serialNumber">第{{item.serialNumber}}页</span></p>
        </div>
      </section>
      <section class="submitBtn" v-show="s1 || s4">
        <a-button type="primary" class="submit" @click="submit" :disabled="showWorkSortNum">发布</a-button>
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
        <a-button type="primary" class="submit" @click="sureChoice">确认</a-button>
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
      :title='`模板预览${totalCurrent}`'
      v-model="templatePreviewToggle"
      centered
      class="previewModal"
      width="96%"
      :footer="null">
      <templatePreview :defaultIndex="previewIndex" :open="templatePreviewToggle" :imgList="previewList" v-model="totalCurrent"></templatePreview>
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
  import {reviewBook, getBookTemplate, releaseBook, getBookList, upadataTemplateSerialNum} from '@/api/tBook';
  import {deleteTemplatePage} from '@/api/tPage';
  import {uploadImgTemplate, deleteTemplateImg} from '@/api/uploadImgTemplate';
  import {getWorkTemplate, putWork, postWorkTemplate, deleteWrokTemplate} from '@/api/works';
  import timeLimit from '@/tools/timeLimit';
  import titleBack from '@C/titleBack.vue';
  import missionContent from '@C/missionContent.vue';
  import templatePreview from '@C/templatePreview.vue';
  import {fileUpload} from '@/api/fileUpload';
  import getBase64 from '@/tools/getBase64';
  export default {
    name: 'taskStart',
    data () {
      let query = this.$route.query;
      return {
        pageType: query.pageType || 'missionTemplate', // missionTemplate作业模板制作页，resourceChoiceList图文资源库选择页，templateChoiceList模板选择页，resourceMakeStart资源模板制作页,checkTemplate查看模板页,checkWork查看作业
        startUploadToggle: false,
        uploadModal: false,
        templatePreviewToggle: false,
        totalUpload: 0, // 总上传图片数
        doneUpload: 0, // 已完成上传图片数
        workId: query.workId, // 根据不同情况获取当前id
        visible: false,
        currentBook: null,
        templateList: [], // 模板列表
        resourceList: [], // 资源列表
        selectedList: [], // 已选择模板数组
        previewIndex: 0, // 图片预览初始图片下标
        previewList: [], // 图片预览数组
        totalCurrent: '0 / 0',
        templateName: '',
        pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
        templateChoiceList: [], // 模板选择列表
        skip: 0,
        limit: 10,
        currentPage: 1,
        count: 0,
        resourceMakeStartTitle: '',
        resourceTemplateCoverInfo: {}, // 资源模板封面信息
        checkTemplateTitle: '',
        missionTemplateTitle: query.title,
        pageTypeConfig: {
          missionTemplate: { // missionTemplate作业模板制作页
            backTitle: '返回任务列表',
            title: 'missionTemplateTitle',
            backMethod: 'backTaskList',
            pageInitMethod: 'getWorkTemplate'
          },
          resourceChoiceList: { // resourceChoiceList图文资源库选择页
            backTitle: '返回模板列表',
            backMethod: 'goMissionTemplate',
            pageInitMethod: 'getSourceList'
          },
          templateChoiceList: { // templateChoiceList模板选择页
            backTitle: '返回资源库',
            title: 'currentBookTitle',
            backMethod: 'goResourceChoiceList',
            pageInitMethod: 'getTemplatePage'
          },
          resourceMakeStart: { // resourceMakeStart资源模板制作页
            backTitle: '返回资源库',
            title: 'resourceMakeStartTitle',
            backMethod: 'backResource',
            pageInitMethod: 'getBookTemplate'
          },
          checkTemplate: { // checkTemplate查看模板页
            backTitle: '返回资源库',
            title: 'checkTemplateTitle',
            backMethod: 'backResource',
            pageInitMethod: 'getReviewBook'
          },
          checkWork: { // checkWork查看作业
            backTitle: '返回任务列表',
            title: 'missionTemplateTitle',
            backMethod: 'backTaskList',
            pageInitMethod: 'getWorkCheckTemplate'
          }
        },
        showWorkSortNum: false, // 排序开关
        maxSortNum: 1, // 排序最大值
        oldSortNum: '', // 正在改变序号项的原序号
        imagePopupList: [], // 图片上传队列
        imageUploadList: [] // 图片上传数组
      };
    },
    created () {
      timeLimit(this[this.currentPageConfig.pageInitMethod]);
    },
    computed: {
      currentPageConfig () {
        return this.pageTypeConfig[this.pageType];
      },
      title () {
        return this[this.currentPageConfig.title] + '模板列表';
      },
      currentBookTitle () {
        return this.currentBook.name;
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
      },
      s6 () { // checkWork查看作业
        return (this.pageType === 'checkWork');
      }
    },
    watch: {
      uploadModal (val) {
        if (!val) { // 关闭上传弹框，若存在imageUploadList则将图片上传后端模板
          if (this.imageUploadList.length) {
            this.uploadImgTemplate();
          }
        } else {
          if (this.imagePopupList.length) {
            this.popupUpload();
          }
        }
      },
      pageType () {
        timeLimit(this[this.currentPageConfig.pageInitMethod]);
      }
    },
    methods: {
      clearArr (arr) { // 不改变数组指正清空数组
        arr.splice(0, arr.length);
      },
      uploadImgTemplate () { // 从导入图片成为模板
        let params = {
          'templateFiles': [...this.imageUploadList]
        };
        this.s1 && Object.assign(params, {workId: this.workId});
        this.s4 && Object.assign(params, {templateBookId: this.workId});
        uploadImgTemplate(params).then(res => {
          let data = res.data;
          if (data.code == 0) {
            let reData = data.data;
            this.templateList.push(...reData);
          } else {
            this.$message.error(data.message);
          }
        });
      },
      openPreview (index) {
        this.templatePreviewToggle = true;
        this.previewIndex = index;
        this.previewList = [...this.templateList];
      },
      openSort () {
        this.showWorkSortNum = !this.showWorkSortNum;
      },
      cacheOldSort (val) { // 记录改变前序号
        this.oldSortNum = val;
      },
      inputChangeScore (item, index, e) {
        const { value } = e.target;
        const reg = /^([1-9][0-9]*)$/;
        if (value > this.maxSortNum) {
          return this.$message.error('序号不能超过' + this.maxSortNum);
        }
        if ((!isNaN(value) && reg.test(value)) || value === '') {
          item.serialNumber = value;
          this.templateList.splice(index, 1, item);
        }
      },
      onBlur (item) {
        if (item.serialNumber === '') {
          item.serialNumber = this.oldSortNum;
          return this.$message.error('序号不能为空');
        }
        let type = (this.s4 ? 'book' : 'work');
        timeLimit(() => {
          upadataTemplateSerialNum(this.workId, type, {
            'templatePageSerialNumbers': [
              {
                'id': item.id,
                'serialNumber': item.serialNumber
              }
            ]
          }).then(res => {
            let data = res.data;
            if (data.code == 0) {
              this[this.currentPageConfig.pageInitMethod]();
            } else {
              this.$message.error(data.message);
            }
          });
        });
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
      goMissionTemplate () { // 页面切换到任务模板
        this.pageType = 'missionTemplate';
      },
      goResourceChoiceList () { // 页面切换到资源列表
        this.pageType = 'resourceChoiceList';
      },
      goTemplateChoiceList (item) { // 页面切换到模板选择列表
        this.currentBook = item;
        this.pageType = 'templateChoiceList';
      },
      goEditResource () { // 编辑资源封面信息
        this.$router.push({path: 'startNewResource', query: {type: 'edit', workId: this.workId, resourceTemplateCoverInfo: JSON.stringify(this.resourceTemplateCoverInfo)}});
      },
      getWorkCheckTemplate () {
        getWorkTemplate(this.workId).then(res => {
          let data = res.data;
          if (data.code == 0) {
            let reData = data.data;
            this.clearArr(this.templateList);
            this.templateList = [...reData.templatePages];
          } else {
            this.$message.error(data.message);
          }
        });
      },
      getReviewBook () {
        reviewBook(this.workId).then(res => {
          let data = res.data;
          if (data.code == 0) {
            let reData = data.data;
            this.checkTemplateTitle = reData.name;
            this.clearArr(this.templateList);
            this.templateList = [...reData.templatePages];
          } else {
            this.$message.error(data.message);
          }
        });
      },
      getBookTemplate () {
        getBookTemplate(this.workId).then(res => {
          let data = res.data;
          if (data.code == 0) {
            let reData = data.data;
            this.resourceMakeStartTitle = reData.name;
            this.resourceTemplateCoverInfo.name = reData.name;
            this.resourceTemplateCoverInfo.coverUrl = reData.coverUrl;
            this.clearArr(this.templateList);
            reData.templatePages && (this.maxSortNum = reData.templatePages.length);
            this.templateList = [...reData.templatePages.map((item) => {
              item.finished = true;
              return item;
            }), ...reData.templateImages];
          } else {
            this.$message.error(data.message);
          }
        });
      },
      getWorkTemplate () {
        getWorkTemplate(this.workId).then(res => {
          let data = res.data;
          if (data.code == 0) {
            let reData = data.data;
            this.clearArr(this.templateList);
            reData.templatePages && (this.maxSortNum = reData.templatePages.length);
            this.templateList = [...reData.templatePages.map((item) => {
              item.finished = true;
              return item;
            }), ...reData.templateImages];
          } else {
            this.$message.error(data.message);
          }
        });
      },
      getSourceList () {
        getBookList({bookStatus: 1, templateBookName: this.templateName, skip: this.skip, limit: this.limit}).then(res => {
          let data = res.data;
          if (data.code == 0) {
            let reData = data.data;
            this.clearArr(this.resourceList);
            this.count = data.total;
            this.resourceList.push(...reData);
          } else {
            this.$message.error(data.message);
          }
        });
      },
      getTemplatePage () {
        this.clearArr(this.selectedList);
        reviewBook(this.currentBook.id).then(res => {
          let data = res.data;
          if (data.code == 0) {
            let reData = data.data;
            this.clearArr(this.templateChoiceList);
            this.templateChoiceList.push(...reData.templatePages);
          } else {
            this.$message.error(data.message);
          }
        });
      },
      choiceTemplate (item) {
        let index = this.selectedList.indexOf(item.id);
        if (index > -1) {
          this.selectedList.splice(index, 1);
        } else {
          this.selectedList.push(item.id);
        }
      },
      sureChoice () {
        postWorkTemplate(this.workId, this.selectedList).then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.pageType = 'missionTemplate';
          } else {
            this.$message.error(data.message);
          }
        });
      },
      onShowSizeChange (current, pageSize) {
        this.currentPage = current;
        this.limit = pageSize;
        this.skip = (current - 1) * this.limit;
        timeLimit(this[this.currentPageConfig.pageInitMethod]);
      },
      changePage (current) {
        this.currentPage = current;
        this.skip = (current - 1) * this.limit;
        timeLimit(this[this.currentPageConfig.pageInitMethod]);
      },
      searchResource () {
        this.skip = 0;
        this.currentPage = 1;
        timeLimit(this[this.currentPageConfig.pageInitMethod]);
      },
      checkTask () {
        this.visible = true;
      },
      startUpload () {
        this.startUploadToggle = true;
        this.clearArr(this.imagePopupList);
        this.clearArr(this.imageUploadList);
        this.doneUpload = 0;
        this.totalUpload = 0;
      },
      popupUpload () {
        if (!this.uploadModal) return;
        let file = this.imagePopupList.shift();
        getBase64(file, (imageUrl) => {
          let img = document.createElement('img');
          img.src = imageUrl;
          img.onload = () => {
            fileUpload({'file': file}).then(res => {
              if (res.data.code == 0) {
                this.doneUpload += 1;
                let imgUrl = res.data.data.url;
                this.imageUploadList.push({
                  url: imgUrl,
                  width: img.width,
                  height: img.height
                });
                if (this.imagePopupList.length) {
                  this.popupUpload();
                } else if (this.doneUpload === this.totalUpload) {
                  this.uploadModal = false;
                }
              } else {
                this.$message.error(res.data.message);
              }
            });
          };
        });
      },
      customRequest (data) { // 自定义上传事件
        this.resetUpload();
        this.imagePopupList.push(data.file);
      },
      resetUpload () {
        setTimeout(() => { // 将内容添加到微任务，延迟触发
          if (this.startUploadToggle) { // 每次点击导入图片只触发一次弹框打开
            this.startUploadToggle = false;
            this.totalUpload = this.imagePopupList.length;
            if (this.totalUpload > 99) {
              this.$message.error('单次上传不能大于99张');
              this.clearArr(this.imagePopupList);
              this.clearArr(this.imageUploadList);
              this.totalUpload = 0;
              this.uploadModal = false;
            } else {
              this.uploadModal = true;
            }
          }
        });
      },
      computeMaxFinishedSortNum () { // 已完成模板最大序号+1计算
        let currentMaxFinishedSortNum = 1;
        this.templateList.forEach((item) => {
          item.finished && item.serialNumber >= currentMaxFinishedSortNum && (currentMaxFinishedSortNum = item.serialNumber - 0 + 1);
        });
        return currentMaxFinishedSortNum;
      },
      goMake (item) {
        if (!item.importStatus) { // 不是资源库导入
          let query;
          let defaultTemplateSortNum;
          if (item.finished) { // 已完成模板
            defaultTemplateSortNum = item.serialNumber; // 点击已完成末班，默认序号为当前模板序号
            this.$store.dispatch('passTemplate', JSON.stringify(item));
            query = {templatePageId: item.id}; // 模板页ID（存在则在模板制作时需要初始渲染，最后是更新）
            this.$router.push({path: 'frameTemplate', query: query});
          } else { // 导入图片模板
            defaultTemplateSortNum = this.computeMaxFinishedSortNum(); // 点击未完成模板，默认序号为已完成模板最大序号加1
            this.$store.dispatch('passChooseImg', JSON.stringify(item));
            query = {templateImageId: item.id, autoFrame: 'true'}; // 模板图片ID
            this.s1 && Object.assign(query, {workId: this.workId, pageType: 'missionTemplate'}); // 作业进来传作业ID
            this.s4 && Object.assign(query, {templateBookId: item.templateBookId, pageType: 'resourceMakeStart'}); // 资源进来传模板书ID
            this.$router.push({path: 'imgAdjust', query: query});
          }
          this.$store.dispatch('changeDefaultTemplateSortNum', defaultTemplateSortNum);
        } else {
          timeLimit(() => {
            this.$message.warn('资源库导入模板不可编辑');
          }, 1800);
        }
      },
      deleteTemplate (item, index) {
        if (item.importStatus) {
          deleteWrokTemplate(this.workId, item.id).then(res => {
            let data = res.data;
            if (data.code == 0) {
              this.templateList.splice(index, 1);
            } else {
              this.$message.error(data.message);
            }
          });
        } else if (item.finished) {
          deleteTemplatePage({id: item.id}).then(res => {
            let data = res.data;
            if (data.code == 0) {
              this.templateList.splice(index, 1);
            } else {
              this.$message.error(data.message);
            }
          });
        } else {
          deleteTemplateImg({id: item.id}).then(res => {
            let data = res.data;
            if (data.code == 0) {
              this.templateList.splice(index, 1);
            } else {
              this.$message.error(data.message);
            }
          });
        }
      },
      submitWork () {
        putWork(this.workId).then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.$message.success('作业发布成功');
            this.$router.push('missionList');
          } else {
            this.$message.error(data.message);
          }
        });
      },
      submitSource () {
        releaseBook(this.workId).then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.$message.success('资源发布成功');
            this.$router.push('resource');
          } else {
            this.$message.error(data.message);
          }
        });
      },
      submit () {
        this.s1 && this.submitWork();
        this.s4 && this.submitSource();
      }
    },
    components: {
      titleBack,
      missionContent,
      templatePreview
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
  .previewModal{
    width: 96%;
    height: 96%;
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
        padding: 10px!important;
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
      overflow: auto;
      .functional{
        flex: 30px 0 0;
        .fj();
        .title{
          flex: 1;
          font-size: 22px;
          color: #333333;
          display: flex;
          justify-content: flex-start;
          align-content: center;
          .edit{
            display: inline-block;
            width: 30px;
            height: 30px;
            margin-left: 10px;
            .fac();
            .iconfont{
              padding-top: 3px;
              font-size: 24px;
              color: #1890ff;
            }
          }
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
          .selected{
            color: #1690FF;
          }
          .choiceIcon{
            .wh(40px, 40px);
            position: absolute;
            right: 0;
            top: 0;
            z-index: 3;
            .fac();
            i{
              font-size: 26px;
            }
          }
          .finished{
            position: absolute;
            top: 0;
            left: 10px;
            z-index: 1;
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
          .img{
            height: 224px;
            width: 100%;
            img{
              .wh(100%, 100%);
            }
          }
          p{
            height: 50px;
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
