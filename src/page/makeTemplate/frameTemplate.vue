<template>
  <div name='frameTemplate' class="fillcontain">
    <headTop></headTop>
    <makeBody :isStepOne="false" @finish="submit">
      <div class="fillcontain" style="overflow: auto">
        <div class="frameTemplateWrapper">
          <section class="funBtnGroup">
            <div class="btnItem" :class="[item.active ? item.activeClass : '']" v-for="(item, index) in funBtnList" :key="index" @mousedown="addActive(item)" @mouseup="removeActive(item)" @click="item.fun(item)">
              <i class="iconfont" :class="[item.icon]"></i>
              <p>{{item.text}}</p>
            </div>
          </section>
          <section class="handleArea">
            <drawFrame ref="drawFrame" :isMultipleChoice="isMultipleChoice" v-model="divList"></drawFrame>
            <img :src="currentEditTemplate.url" class="fillcontain" alt="">
          </section>
          <section class="tableArea frameTemplateTable">
            <a-table :columns="columns" :dataSource="questionList" rowKey="id" :pagination="false" bordered :rowClassName="rowClassName">
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
  </div>
</template>

<script type='text/babel'>
  import makeBody from './components/makeBody';
  import drawFrame from './components/drawFrame';
  export default {
    name: 'frameTemplate',
    data () {
      return {
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
        questionSigns: [],
        questionList: [],
        columns: [
          {className: 'smallTablePadding', title: '序号', dataIndex: 'serialNumber', width: '14%', scopedSlots: { customRender: 'serialNumber' }},
          {className: 'smallTablePadding', title: '题类', dataIndex: 'questionKind', width: '60%', scopedSlots: { customRender: 'questionKind' }},
          {className: 'smallTablePadding', title: '分值', dataIndex: 'score', width: '26%', scopedSlots: { customRender: 'score' }}
        ],
        divList: [],
        isMultipleChoice: false // 复选开关
      };
    },
    created () {
    },
    beforeRouteLeave (to, from, next) { // 路由离开前清空选中List
      this.$store.dispatch('changeCheckedQuestionList', []);
      next();
    },
    mounted () {
      this.getWH();
    },
    computed: {
      rowClassName () {
        return (record) => {
          return (record.checked ? 'frameTemplateCheckedRow' : '');
        };
      },
      currentEditTemplate () {
        return JSON.parse(this.$store.getters.currentEditTemplate);
      },
      checkedQuestionList () {
        return this.$store.getters.checkedQuestionList;
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
          let questionSigns = [];
          let questionList = [];
          val.forEach((item) => {
            let questionSignsCell = {
              'score': 5,
              'serialNumber': '',
              'height': '',
              'left': '',
              'top': '',
              'width': '', // 此网上为后端需要数据
              'id': ''
            };
            let questionListCell = {
              'score': 5,
              'serialNumber': '',
              'currentBtn': 5,
              'id': '',
              'checked': false
            };
            let atr = item.attribute;
            questionSignsCell.id = questionListCell.id = item.id;
            questionSignsCell.serialNumber = questionListCell.serialNumber = item.serialNumber;
            questionSignsCell.width = atr.width;
            questionSignsCell.top = atr.top;
            questionSignsCell.left = atr.left;
            questionSignsCell.height = atr.height;
            this.checkedQuestionList.includes(questionListCell.serialNumber) && (this.$set(questionListCell, 'checked', true));
            questionList.every(item => { return (item.serialNumber !== questionListCell.serialNumber); }) && questionList.push(questionListCell); // 重复序号只添加一次题目
            questionSigns.push(questionSignsCell);
          });
          this.questionSigns = [...questionSigns];
          this.questionList = [...questionList];
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
      getWH () { // 计算图片放到框中居中沾满且不改变比例(获取初始attribute)
        let img = document.createElement('img');
        img.src = this.currentEditTemplate.url;
        img.onload = () => {
          console.log(img.width, img.height);
        };
      },
      changeScore (item, val) {
        this.$set(item, 'score', val);
        this.$set(item, 'currentBtn', val);
      },
      inputChangeScore (item, e) {
        const { value } = e.target;
        const reg = /^(0|[1-9][0-9]*)$/;
        if ((!isNaN(value) && reg.test(value)) || value === '') {
          this.$set(item, 'score', value);
        }
      },
      onBlur (item, e) {
        const { value } = e.target;
        if (value === '') {
          this.$set(item, 'score', item.currentBtn);
        }
      },
      submit () {}
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
  .frameTemplateCheckedRow:hover:not(.ant-table-expanded-row) > td {
    background: #e6f7ff!important;
  }
  .frameTemplateCheckedRow{
    background: #e6f7ff!important;
  }
</style>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'frameTemplate']{
    .frameTemplateWrapper{
      padding: 30px;
      width: 1365px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      .funBtnGroup{
        width: 135px;
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
        .wh(546px, 729px);
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
      .tableArea{
        .wh(494px, 729px);
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
        overflow: auto;
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
