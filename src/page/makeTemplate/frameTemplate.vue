<template>
  <div name='frameTemplate' class="fillcontain">
    <headTop></headTop>
    <makeBody :isStepOne="false">
      <div class="fillcontain" style="overflow: auto">
        <div class="frameTemplateWrapper">
          <section class="funBtnGroup">
            <div class="btnItem" :class="[item.active ? item.activeClass : '']" v-for="(item, index) in funBtnList" :key="index" @mousedown="addActive(item)" @mouseup="removeActive(item)">
              <i class="iconfont" :class="[item.icon]"></i>
              <p>{{item.text}}</p>
            </div>
          </section>
          <section class="handleArea">
            <img :src="currentEditTemplate.url" class="fillcontain" alt="">
          </section>
          <section class="tableArea">
            <a-table :columns="columns" :dataSource="questionSigns" rowKey="serialNumber" :pagination="false" bordered>
              <template slot="serialNumber" slot-scope="text, record, index">
                <div class='editable-row-operations'>
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
  export default {
    name: 'frameTemplate',
    data () {
      return {
        funBtnList: [
          {
            icon: 'iconMerge',
            activeClass: 'mergeActive',
            text: '合并',
            active: false
          }, {
            icon: 'iconDelete',
            activeClass: 'deleteActive',
            text: '删除',
            active: false
          }
        ],
        questionSigns: [],
        columns: [
          {className: 'smallTablePadding', title: '序号', dataIndex: 'serialNumber', width: '14%', scopedSlots: { customRender: 'serialNumber' }},
          {className: 'smallTablePadding', title: '题类', dataIndex: 'questionKind', width: '60%', scopedSlots: { customRender: 'questionKind' }},
          {className: 'smallTablePadding', title: '分值', dataIndex: 'score', width: '26%', scopedSlots: { customRender: 'score' }}
        ]
      };
    },
    created () {
      for (let i = 1; i < 20; i++) {
        let cell = {
          'height': 0,
          'left': 0,
          'score': 5,
          'serialNumber': i,
          'top': 0,
          'width': 0,
          'currentBtn': 5
        };
        this.questionSigns.push(cell);
      }
    },
    mounted () {
      this.getWH();
    },
    computed: {
      currentEditTemplate () {
        return JSON.parse(this.$store.getters.currentEditTemplate);
      }
    },
    watch: {},
    methods: {
      addActive (item) {
        this.$set(item, 'active', true);
      },
      removeActive (item) {
        this.$set(item, 'active', false);
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
      }
    },
    components: {
      makeBody
    }
  };
</script>
<style>
  th.smallTablePadding,
  td.smallTablePadding {
    padding-left: 24px !important;
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
      }
      .tableArea{
        .wh(494px, 729px);
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
        overflow: auto;
        .activeBtn{
          color: #fff;
          background-color: #40a9ff;
          border-color: #40a9ff;
        }
      }
    }
  }
</style>
