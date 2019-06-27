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
              <drawFrame ref="drawFrame" :isMultipleChoice="isMultipleChoice" v-model="divList"></drawFrame>
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
      title="填写资料页码"
      v-model="visible"
      centered
      width="450px"
      @ok="submit"
      class="frameTemplateModal">
      <div class="frameTemplateModalWrapper">
        第<a-input
        :value="templatePageNumber"
        maxLength="6"
        class="frameTemplateModalWrapperInput"
        @change="changeTemplatePageNumber"/>页
      </div>
    </a-modal>
  </div>
</template>

<script type='text/babel'>
  import {saveTemplatePage, updateTemplatePage} from '@/api/tPage';
  import makeBody from './components/makeBody';
  import drawFrame from './components/drawFrame';
  export default {
    name: 'frameTemplate',
    data () {
      let query = this.$route.query;
      return {
        query: query,
        funBtnList: [
          {
            icon: 'iconMerge',
            activeClass: 'mergeActive',
            activeType: 'mouseDown',
            text: '合并',
            fun: this.mergeTem,
            active: false
          }, {
            icon: 'iconDelete',
            activeClass: 'deleteActive',
            activeType: 'mouseDown',
            text: '删除',
            fun: this.deleteTem,
            active: false
          }, {
            icon: 'iconMultipleChoice',
            activeClass: 'multipleChoiceActive',
            activeType: 'click',
            text: '多选',
            fun: this.multipleChoice,
            active: this.isMultipleChoice
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
        drawFrameInitialIdentify: 1
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
      checkedQuestionList: {
        handler (val) {
          this.questionList.forEach((item) => {
            if (val.includes(item.serialNumber)) {
              this.$set(item, 'checked', true);
            } else {
              this.$set(item, 'checked', false);
            }
          });
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
            let {identify, serialNumber, mergeHeader, mergeBody} = item;
            questionListCell = {...questionListCell, ...{height, left, top, width}, ...{identify, serialNumber, mergeHeader, mergeBody}};
            this.checkedQuestionList.includes(questionListCell.serialNumber) && (this.$set(questionListCell, 'checked', true));
            this.$set(questionListCell, 'showSign', questionList.every(item => { return (item.serialNumber !== questionListCell.serialNumber); })); // 重复序号只添加一次题目,其他隐藏
            questionList.push(questionListCell);
          });
          this.questionList = [...questionList];
          console.log(this.questionList);
        },
        deep: true
      }
    },
    methods: {
      checkQuestion (sort) {
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
      mergeTem () {
        this.$refs.drawFrame.mergeTem();
      },
      deleteTem () {
        this.$refs.drawFrame.deleteTem();
      },
      multipleChoice (item) {
        this.isMultipleChoice = !item.active;
        this.$set(item, 'active', !item.active);
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
      openSurePageModal () {
        if (this.query.templatePageId) {
          this.submit();
        } else {
          this.visible = true;
        }
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
      submit () {
        let questionSigns = [];
        let mergeObj = {};
        console.log(this.questionList);
        this.questionList.forEach((item) => {
          (item.mergeHeader) && (mergeObj[item.mergeHeader] = item.score); // 保存合并头对应分数
          (item.mergeBody) && (item.score = mergeObj[item.mergeBody]); // 合并身取对应合并头的分数
          let {height, left, score, serialNumber, top, width} = item;
          if (item.mergeBody || item.mergeHeader) {
            questionSigns.push(Object.assign({height, left, score, serialNumber, top, width}, {assembleStatus: 1}));
          } else {
            questionSigns.push(Object.assign({height, left, score, serialNumber, top, width}, {assembleStatus: 0}));
          }
        });
        let params = {
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
          .multipleChoiceActive{
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
