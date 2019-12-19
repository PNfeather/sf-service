<template>
  <div name='resourcePick' class="fillcontain">
    <div class="title">
      <titleBack :title="backTitle" customBack @back="back"></titleBack>
    </div>
    <div class="template fillcontain">
      <section class="functional">
        <div class="title" v-show="s3">
          <span v-text="title"></span>
        </div>
        <div class="search" v-show="s2">
          <a-input v-model="templateName" class="input" placeholder="请输入资源名称"/>
          <a-button type="primary" @click="searchResource">搜索</a-button>
        </div>
      </section>
      <section class="imgArea" ref="imgArea">
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
  </div>
</template>

<script type='text/babel'>
  import { reviewBook, getBookList } from '@/api/tBook';
  import timeLimit from '@/tools/timeLimit';
  import titleBack from '@C/titleBack.vue';
  export default {
    name: 'taskStart',
    data () {
      let query = this.$route.query;
      return {
        fromName: query.fromName, // 页面来源
        pageType: query.pageType || 'resourceChoiceList', // resourceChoiceList图文资源库选择页，templateChoiceList模板选择页
        choiceType: query.choiceType, // 单选或多选判断
        dataType: query.dataType, // 选择所需要传数据方式
        currentBook: null,
        resourceList: [], // 资源列表
        selectedList: [], // 已选择模板数组
        fullDataList: [], // 全数据需求存储
        templateName: '',
        pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
        templateChoiceList: [], // 模板选择列表
        skip: 0,
        limit: 10,
        currentPage: 1,
        count: 0,
        pageTypeConfig: {
          resourceChoiceList: { // resourceChoiceList图文资源库选择页
            backMethod: 'giveUp',
            pageInitMethod: 'getSourceList'
          },
          templateChoiceList: { // templateChoiceList模板选择页
            title: 'currentBookTitle',
            backMethod: 'goResourceChoiceList',
            pageInitMethod: 'getTemplatePage'
          }
        }
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
        return (this.pageType === 'resourceChoiceList' ? ('返回' + this.fromName) : '返回资源列表');
      },
      s2 () { // resourceChoiceList图文资源库选择页
        return (this.pageType === 'resourceChoiceList');
      },
      s3 () { // templateChoiceList模板选择页
        return (this.pageType === 'templateChoiceList');
      }
    },
    watch: {
      pageType () {
        timeLimit(this[this.currentPageConfig.pageInitMethod]);
      }
    },
    methods: {
      clearArr (arr) { // 不改变数组指正清空数组
        arr.splice(0, arr.length);
      },
      back () {
        this[this.currentPageConfig.backMethod]();
      },
      giveUp () { // 放弃选择资源
        this.$router.go(-1);
      },
      goResourceChoiceList () { // 页面切换到资源列表
        this.pageType = 'resourceChoiceList';
      },
      goTemplateChoiceList (item) { // 页面切换到模板选择列表
        this.currentBook = item;
        this.pageType = 'templateChoiceList';
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
        let isFull = (this.dataType === 'fullData');
        if (this.choiceType === 'radio') {
          this.selectedList = [item.id];
          isFull && (this.fullDataList = [item]);
        } else {
          let index = this.selectedList.indexOf(item.id);
          if (index > -1) {
            this.selectedList.splice(index, 1);
            isFull && this.fullDataList.splice(index, 1);
          } else {
            this.selectedList.push(item.id);
            isFull && this.fullDataList.push(item);
          }
        }
      },
      sureChoice () {
        if (!this.selectedList.length) {
          return this.$message.warn('请选择资源');
        }
        this.dataType === 'fullData' ? this.$store.dispatch('changeResourceChoiceList', this.fullDataList) : this.$store.dispatch('changeResourceChoiceList', this.selectedList);
        this.$router.go(-1);
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
      }
    },
    components: {
      titleBack
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'resourcePick']{
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
      }
      .imgArea{
        overflow-y: scroll;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin-top: 30px;
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
