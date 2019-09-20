<template>
  <div name='frameTemplate' class="fillcontain">
    <headTop></headTop>
    <makeBody :isStepOne="false" @last="lastStep" @finish="openSurePageModal" :showLastBtn="!query.templatePageId">
      <div class="fillcontain" style="overflow: auto">
        <div class="frameTemplateWrapper">
          <div class="topArea">
            <section class="funBtnGroup">
              <div class="btnItem" :class="[item.active ? item.activeClass : '']" v-for="(item, index) in funBtnList" :key="index" @mousedown="addActive(item)" @mouseup="removeActive(item)" @click="item.fun(item)">
                <i class="iconfont" :class="[item.icon]"></i>
                <p>{{item.text}}</p>
              </div>
            </section>
            <section class="handleArea" :style="{width: templateWidth + 'px', height: templateHeight + 'px'}">
              <drawFrame ref="drawFrame" :pickCRD="pickCRD" :isMultipleChoice="isMultipleChoice" @cancelMultipleChoice="cancelMultipleChoice" v-model="divList" @outputColumnNumber="outputColumnNumber" @checkMarkerArea="checkMarkerArea"></drawFrame>
              <img crossOrigin="anonymous" :src="`${$CJIMGURL + currentEditTemplate.url + $OSSIMGADJUST}`" class="fillcontain" alt="">
            </section>
          </div>
          <section class="tableArea frameTemplateTable">
            <a-table :columns="columns" :dataSource="questionList" rowKey="identify" :pagination="false" bordered :rowClassName="rowClassName">
              <template slot="serialNumber" slot-scope="text, record, index">
                <div class='editable-row-operations sort' @click="checkQuestion(record.serialNumber)">
                  {{record.serialNumber}}、
                </div>
              </template>
              <template slot="questionKind" slot-scope="text, record, index">
                <div class='editable-row-operations' style="display: flex;justify-content: space-between">
                  <a-button :class="{'activeBtn': record.currentBtn == 5}" @click="changeScore(record, 5)" style="width: 74px">小题</a-button>
                  <a-button :class="{'activeBtn': record.currentBtn == 10}" @click="changeScore(record, 10)" style="width: 74px">中题</a-button>
                  <a-button :class="{'activeBtn': record.currentBtn == 15}" @click="changeScore(record, 15)" style="width: 74px">大题</a-button>
                </div>
              </template>
              <template slot="score" slot-scope="text, record, index">
                <div class='editable-row-operations'>
                  <a-input
                    :value="record.score"
                    maxLength="4"
                    style="width: 60px"
                    @change="inputChangeScore(record, $event)"
                    @blur="onBlur(record, $event)"
                  /><span style="margin-left: 6px">分</span>
                </div>
              </template>
            </a-table>
          </section>
        </div>
      </div>
    </makeBody>
    <a-modal
      v-model="backModal"
      centered
      width="450px"
      @ok="sureBack"
      okText="返回"
      class="frameTemplateModal">
      <div class="frameTemplateModalWrapper">
        当前页面数据将会清空，是否返回上一步?
      </div>
    </a-modal>
    <a-modal
      title="填写资料信息"
      v-model="visible"
      centered
      width="450px"
      @ok="submit"
      class="frameTemplateModal">
      <a-form
        class="form fillcontain">
        <a-form-item
          class="input-item"
          label="页码排序"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }">
          <div class="sortInput">
            第<a-input
            :value="templatePageNumber"
            maxLength="6"
            :disabled="!!query.templatePageId"
            class="frameTemplateModalWrapperInput"
            @change="changeTemplatePageNumber"/>页
          </div>
        </a-form-item>
        <a-form-item
          class="input-item"
          label="题目布局"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }">
          <div class="sortInput">
            <a-radio-group @change="changeColumnNumber" :defaultValue="defaultColumnNumber" >
              <a-radio :value="1">单列</a-radio>
              <a-radio :value="2">双列</a-radio>
            </a-radio-group>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script type='text/babel'>
  import {saveTemplatePage, updateTemplatePage} from '@/api/tPage';
  import makeBody from './components/makeBody';
  import drawFrame from './components/drawFrame';
  import timeLimit from '@/tools/timeLimit';
  export default {
    name: 'frameTemplate',
    data () {
      let query = this.$route.query;
      return { // 页面数据初始化在组件drawFrame中
        query: query,
        funBtnList: [ // 功能按钮区配置，对应id不可随意调整
          {
            id: 1,
            icon: 'iconMerge',
            activeClass: 'mergeActive',
            activeType: 'mouseDown',
            text: '合并',
            fun: this.mergeTem,
            active: false
          }, {
            id: 2,
            icon: 'iconDelete',
            activeClass: 'deleteActive',
            activeType: 'mouseDown',
            text: '删除',
            fun: this.deleteTem,
            active: false
          }, {
            id: 3,
            icon: 'iconMultipleChoice',
            activeClass: 'multipleChoiceActive',
            activeType: 'click',
            text: '多选',
            fun: this.multipleChoice,
            active: this.isMultipleChoice
          }, {
            id: 4,
            icon: 'iconCRD',
            activeClass: 'CRDChoiceActive',
            activeType: 'click',
            text: '识别区',
            fun: this.pickCRDMethod,
            active: this.pickCRD
          }
        ],
        questionList: [],
        columns: [
          {className: 'smallTablePadding', title: '序号', dataIndex: 'serialNumber', width: '14%', scopedSlots: { customRender: 'serialNumber' }},
          {className: 'smallTablePadding', title: '题类', dataIndex: 'questionKind', width: '60%', scopedSlots: { customRender: 'questionKind' }},
          {className: 'smallTablePadding', title: '分值', dataIndex: 'score', width: '26%', scopedSlots: { customRender: 'score' }}
        ],
        divList: [],
        visible: false,
        backModal: false,
        templatePageNumber: this.$store.getters.defaultTemplateSortNum,
        isMultipleChoice: false, // 复选开关
        pickCRD: false, // 识别区选中开关
        drawFrameInitialIdentify: 1,
        columnNumber: '',
        defaultColumnNumber: '',
        mergeBtnType: ''
      };
    },
    created () {},
    beforeRouteLeave (to, from, next) { // 路由离开前清空选中List
      this.$store.dispatch('changeCheckedQuestionList', []);
      next();
    },
    mounted () {
    },
    computed: {
      rowClassName () {
        return (record) => {
          let className = [];
          !record.showSign && (className.push('frameTemplateHiddenRow'));
          record.checked && (className.push('frameTemplateCheckedRow'));
          return className.join(' ');
        };
      },
      currentEditTemplate () {
        return JSON.parse(this.$store.getters.currentEditTemplate);
      },
      checkedQuestionList () {
        return this.$store.getters.checkedQuestionList;
      },
      questionScoreCatch () {
        return this.$store.getters.questionScoreCatch;
      },
      templateHeight () {
        return this.$store.getters.templateHeight;
      },
      templateWidth () {
        return this.$store.getters.templateWidth;
      },
      imgScale () {
        return this.$store.getters.imgScale;
      }
    },
    watch: {
      checkedQuestionList: { // 监听当前选中框的题目序号组成的数组
        handler (val) {
          let mergeCount = 0;
          this.questionList.forEach((item) => {
            if (val.includes(item.serialNumber)) {
              val.length === 1 && mergeCount++; // 当前选中的题目序号只有一个，而选中区不止一个，则将合并调整为取消合并
              this.$set(item, 'checked', true);
            } else {
              this.$set(item, 'checked', false);
            }
          });
          switch (this.mergeBtnType) {
            case 'merge':
              this.mergeBtnChange(true);
              break;
            case 'cancel':
              this.mergeBtnChange(false);
              break;
            default:
              this.mergeBtnChange(mergeCount <= 1);
              break;
          }
          this.mergeBtnType = '';
        },
        deep: true
      },
      divList: {
        handler (val) {
          let questionList = [];
          val.forEach((item) => {
            let questionListCell = {
              'score': item.score || 5,
              'currentBtn': item.currentBtn || 5
            };
            let atr = item.attribute;
            let {height, left, top, width} = atr;
            let {identify, serialNumber} = item;
            questionListCell = {...questionListCell, ...{height, left, top, width}, ...{identify, serialNumber}};
            this.checkedQuestionList.includes(questionListCell.serialNumber) && (this.$set(questionListCell, 'checked', true));
            this.$set(questionListCell, 'showSign', questionList.every(item => { return (item.serialNumber !== questionListCell.serialNumber); })); // 重复序号只添加一次题目,其他隐藏
            questionList.push(questionListCell);
          });
          this.questionList = [...questionList];
        },
        deep: true
      }
    },
    methods: {
      checkQuestion (sort) {
        if (this.pickCRD) {
          return this.$message.error('您正在调整识别区，请先结束');
        }
        let checkedList = [];
        checkedList = [...this.checkedQuestionList];
        let index = checkedList.indexOf(sort);
        if (index > -1) {
          checkedList.splice(index, 1);
        } else {
          if (this.isMultipleChoice) { // 是否复选
            checkedList.push(sort);
          } else {
            checkedList = [sort];
          }
        }
        this.$store.dispatch('changeCheckedQuestionList', checkedList);
      },
      mergeBtnChange (toMerge) { // 切换合并按钮状态
        const mergeObj = {
          icon: 'iconMerge',
          text: '合并',
          fun: this.mergeTem
        };
        const cancelMergeObj = {
          icon: 'iconCancelMerge',
          text: '取消合并',
          fun: this.cancelMergeTem
        };
        Object.assign(this.funBtnList[0], !toMerge ? cancelMergeObj : mergeObj);
      },
      cancelMergeTem () {
        if (this.pickCRD) {
          return this.$message.error('您正在调整识别区，请先结束');
        }
        this.mergeBtnType = 'merge';
        this.$refs.drawFrame.cancelMergeTem();
      },
      mergeTem () {
        if (this.pickCRD) {
          return this.$message.error('您正在调整识别区，请先结束');
        }
        if (!this.checkedQuestionList.length) {
          return this.$message.error('请选择合并选区');
        }
        if (this.checkedQuestionList.length === 1) {
          return this.$message.error('当前选区只存在一个题目');
        }
        this.mergeBtnType = 'cancel';
        this.$refs.drawFrame.mergeTem();
      },
      deleteTem () {
        if (this.pickCRD) {
          return this.$message.error('您正在调整识别区，请先结束');
        }
        this.$refs.drawFrame.deleteTem();
      },
      cancelMultipleChoice () { // 子组件取消合并时取消复选
        this.isMultipleChoice = false;
        this.funBtnList.forEach(item => {
          item.id === 3 && this.$set(item, 'active', !item.active);
        });
      },
      multipleChoice (item) { //  复选区选择
        if (this.pickCRD) {
          return this.$message.error('您正在调整识别区，请先结束');
        }
        this.isMultipleChoice = !item.active;
        this.$set(item, 'active', !item.active);
      },
      checkMarkerArea (callback) { // 初始化默认选中标识区
        this.funBtnList.forEach(item => {
          item.id === 4 && this.pickCRDMethod(item, callback);
        });
      },
      pickCRDMethod (item, callback) { // 识别区选中，自动去掉复选选中
        this.pickCRD = !item.active;
        this.$set(item, 'active', !item.active);
        if (this.pickCRD) {
          this.$store.dispatch('changeCheckedQuestionList', []); // 去掉已选中的缓存list
          this.isMultipleChoice = false;
          this.$set(this.funBtnList.filter(item => item.id === 3)[0], 'active', false);
        }
        this.$nextTick(() => {
          callback && callback();
        });
      },
      addActive (item) {
        (item.activeType === 'mouseDown') && this.$set(item, 'active', true);
      },
      removeActive (item) {
        (item.activeType === 'mouseDown') && this.$set(item, 'active', false);
      },
      changeQuestionCatch (serialNumber, score, currentBtn) {
        let result = [...this.questionScoreCatch];
        let existIndex = -1;
        result.forEach((item, index) => {
            (item.serialNumber == serialNumber) && (existIndex = index);
        });
        if (existIndex > -1) {
          result.splice(existIndex, 1, {serialNumber, score, currentBtn});
        } else {
          result.push({serialNumber, score, currentBtn});
        }
        this.$store.dispatch('changeQuestionScoreCatch', [...result]);
      },
      changeScore (item, val) {
        this.$set(item, 'score', val);
        this.$set(item, 'currentBtn', val);
        this.changeQuestionCatch(item.serialNumber, val, val);
      },
      inputChangeScore (item, e) {
        const { value } = e.target;
        const reg = /^(0|[1-9][0-9]*)$/;
        if ((!isNaN(value) && reg.test(value)) || value == '') {
          this.$set(item, 'score', value);
        }
      },
      onBlur (item, e) {
        const { value } = e.target;
        if (!value) {
          this.$set(item, 'score', item.currentBtn);
        }
        this.changeQuestionCatch(item.serialNumber, item.score, item.currentBtn);
      },
      changeTemplatePageNumber ($event) {
        const { value } = $event.target;
        const reg = /^([1-9][0-9]*)$/;
        if ((!isNaN(value) && reg.test(value)) || value === '') {
          this.templatePageNumber = value;
        }
      },
      outputColumnNumber (data) {
        this.columnNumber = this.defaultColumnNumber = data;
      },
      changeColumnNumber (e) {
        this.columnNumber = e.target.value;
      },
      openSurePageModal () {
        this.visible = true;
      },
      lastStep () {
        if (this.questionList.length) {
          this.backModal = true;
        } else {
          this.sureBack();
        }
      },
      sureBack () {
        this.$router.replace({path: 'imgAdjust', query: this.query});
      },
      updataTemplate (params) {
        let data = {id: this.query.templatePageId, ...params};
        updateTemplatePage(data).then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.$message.success('模板已更新');
            this.$router.go(-1);
          } else {
            this.$message.error(data.message);
          }
        });
      },
      saveTemplate (params) {
        let pageType = this.query.pageType;
        let {templateImageId, templateBookId, workId} = this.query;
        let data = {'serialNumber': this.templatePageNumber, ...{templateImageId}, ...params};
        pageType == 'missionTemplate' && Object.assign(data, {workId});
        pageType == 'resourceMakeStart' && Object.assign(data, {templateBookId});
        saveTemplatePage(data).then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.$message.success('模板已保存');
            this.$router.go(-1);
          } else {
            this.$message.error(data.message);
          }
        });
      },
      computeMarkerArea () {
        let markerArea = {...this.$refs.drawFrame.markerArea};
        let keys = Object.keys(markerArea);
        for (let i in keys) {
          markerArea[keys[i]] = markerArea[keys[i]] * this.imgScale;
        }
        return markerArea;
      },
      submit () {
        if (!this.query.templatePageId && !this.templatePageNumber) {
          return timeLimit(() => {
            this.$message.error('请输入页码');
          }, 800);
        }
        if (!this.columnNumber) {
          return timeLimit(() => {
            this.$message.error('请选择题目布局');
          }, 800);
        }
        let questionSigns = [];
        let isMergeSort = this.$store.getters.isMergeSort;
        this.questionList.forEach((item) => {
          let {height, left, score, serialNumber, top, width} = item;
          questionSigns.push(Object.assign({height, left, score, serialNumber, top, width}, {assembleStatus: isMergeSort[serialNumber] ? 1 : 0}));
        });
        let params = {
          markerArea: this.computeMarkerArea(),
          columnNumber: this.columnNumber,
          'questionSigns': [...questionSigns.map((item) => {
            item.height = item.height * this.imgScale;
            item.left = item.left * this.imgScale;
            item.top = item.top * this.imgScale;
            item.width = item.width * this.imgScale;
            return item;
          })]
        };
        this.query.templatePageId && this.updataTemplate(params);
        !this.query.templatePageId && this.saveTemplate(params);
      }
    },
    components: {
      makeBody,
      drawFrame
    }
  };
</script>
<style lang="less">
  th.smallTablePadding,
  td.smallTablePadding {
    padding-left: 24px !important;
    position: relative;
  }
  .frameTemplateTable{
    .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td{
      background: #fff;
    }
  }
  .frameTemplateHiddenRow{
    display: none!important;
  }
  .frameTemplateCheckedRow:hover:not(.ant-table-expanded-row) > td {
    background: #e6f7ff!important;
  }
  .frameTemplateCheckedRow{
    background: #e6f7ff!important;
  }
  .frameTemplateModal{
    .frameTemplateModalWrapper{
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80%;
      margin: 0 auto;
    }
    .sortInput{
      display: flex;
      justify-content: center;
      align-items: center;
      .frameTemplateModalWrapperInput{
        width: 87px;
        margin: 0 5px;
        text-align: center;
      }
    }
  }
</style>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'frameTemplate']{
    .frameTemplateWrapper{
      padding: 30px;
      overflow: auto;
      .topArea{
        width: 100%;
        min-width: 950px;
        overflow-x: auto;
        .funBtnGroup{
          width: 135px;
          float: left;
          display: flex;
          flex-direction: column;
          align-items: center;
          .mergeActive{
            color: #1690FF!important;
          }
          .deleteActive{
            color: #E46948!important;
          }
          .multipleChoiceActive, .CRDChoiceActive{
            color: #1890ff!important;
          }
          .btnItem{
            .wh(54px, 54px);
            border: 1px solid #E3EDF0;
            box-shadow: 0 3px 5px 1px rgba(35,94,157,0.04);
            border-radius: 4px;
            .fj(space-around);
            flex-direction: column;
            color: #999;
            margin-bottom: 11px;
            .iconfont{
              font-size: 20px;
              .wh(20px, 20px)
            }
            p{
              font-size: 10px;
            }
          }
        }
        .handleArea{
          box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
          overflow: hidden;
          position: relative;
          &:after{
            content: '';
            .wh(100%, 100%);
            z-index: 1;
            .allcover();
          }
        }
      }
      .tableArea{
        .wh(494px, 729px);
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
        overflow: auto;
        margin: 30px 0 10px 135px;
        .sort{
          &:after{ // 点击焦点阔山到整个单元格
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
          }
        }
        .activeBtn{
          color: #fff;
          background-color: #40a9ff;
          border-color: #40a9ff;
        }
      }
    }
  }
</style>
