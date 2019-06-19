<template>
  <div name="drawFrame" @mousedown="createMoveDiv" @mouseup="endMoveDiv"  @mousemove="changeMoveDiv" ref="bg">
      <moveDiv v-show="currentAttribute.width && currentAttribute.height" :attribute="currentAttribute" :checked="true" :canChange="false"></moveDiv>
      <moveDiv
        v-for="item in moveDivList"
        :key="item.id"
        :attribute="item.attribute"
        :originalItem="item"
        :checked="activeMoveDivSort.includes(item.serialNumber)"
        @click="checkMoveDiv(item.serialNumber, $event)"
        @change="reChangeMoveDiv"></moveDiv>
  </div>
</template>

<script type='text/babel'>
  import moveDiv from './moveDiv.vue';
  import _ from '@/plugins/lodash';
  export default {
    name: 'drawFrame',
    props: {
      isMultipleChoice: { // 复选开关
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        moveDivList: [], // moveDiv数据list
        id: 1, // moveDiv 唯一id
        serialNumber: 1, // 对应序号，可合并用
        createToggle: false, // 创建开关
        captureToggle: true,
        changeTimer: null,
        currentAttribute: {},
        activeMoveDivSort: [],
        capturePoints: {x: [], y: []},
        warnTimer: null
      };
    },
    watch: {
      questionScoreCatch: { // 分数变化时将分数挂到对应div上
        handler (val) {
          let c = {};
          val.forEach((item) => {
            c[item.serialNumber] = {
              score: item.score,
              currentBtn: item.currentBtn
            };
          });
          this.moveDivList = [...this.moveDivList.map((item) => {
            c[item.serialNumber] && Object.assign(item, c[item.serialNumber]);
            return item;
          })];
        },
        deep: true
      },
      moveDivList: {
        handler (val) {
          console.log(val);
          if (!val.length) return;
          this.$emit('input', val);
          val.forEach((item) => {
            let attr = item.attribute;
            this.capturePoints.x.push(attr.startX, attr.startX + attr.width);
            this.capturePoints.y.push(attr.startY, attr.startY + attr.height);
            this.capturePoints.x = Array.from(new Set(this.capturePoints.x));
            this.capturePoints.y = Array.from(new Set(this.capturePoints.y));
          });
        },
        deep: true
      },
      checkedQuestionList: {
        handler (val) {
          this.activeMoveDivSort = [...val];
        },
        deep: true
      }
    },
    computed: {
      checkedQuestionList () {
        return this.$store.getters.checkedQuestionList;
      },
      questionScoreCatch () {
        return this.$store.getters.questionScoreCatch;
      },
      currentEditTemplate () {
        return JSON.parse(this.$store.getters.currentEditTemplate);
      }
    },
    mounted () { // 进来已有模板情况加载模板数据
      let arr = this.currentEditTemplate.questionSigns;
      let ft = this.$refs.bg.getBoundingClientRect().top;
      let fl = this.$refs.bg.getBoundingClientRect().left;
      if (arr && arr.length) {
        arr.forEach((item) => {
          let {serialNumber, score} = item;
          let {width, height, top, left} = item;
          let cell = {serialNumber, score};
          cell.attribute = {width, height, top, left};
          cell.attribute.startX = fl + item.left;
          cell.attribute.startY = ft + item.top; // 拱捕获使用
          cell.id = this.id;
          this.id++;
          (item.serialNumber > this.serialNumber) && (this.serialNumber = item.serialNumber);
          this.moveDivList.push(cell);
        });
        this.serialNumber++; // 循环玩当序号排列为已存在的最大序号加1，id一次排过来
      }
    },
    methods: {
      checkCapture (type, currentData) { // 捕获计算
        let result = currentData;
        let limit = 10;
        if (!this.captureToggle) return result;
        this.capturePoints[type].length && this.capturePoints[type].forEach((item) => {
          (item - limit < result) && (item + limit > result) && (result = item);
        });
        return result;
      },
      createMoveDiv ($event) { // 开始拉框
        this.createToggle = true;
        this.currentAttribute = {}; // 消除临时moveDiv
        this.startCreateMoveDivComputed($event);
      },
      endMoveDiv ($event) { // 结束拉框
        if (this.createToggle) {
          this.createToggle = false;
          this.changeMoveDivComputed($event);
          if (this.currentAttribute.width <= 20 || this.currentAttribute.height <= 20) {
            if (this.warnTimer) return;
            this.$message.warn('无法框定过小区域');
            this.warnTimer = setTimeout(() => {
              this.warnTimer = null;
            }, 1000);
            return (this.currentAttribute = {}); // 消除临时moveDiv;
          }
          this.moveDivList.push({
            id: this.id,
            serialNumber: this.serialNumber,
            attribute: {...this.currentAttribute}
          });
          this.id++;
          this.serialNumber++;
          this.currentAttribute = {}; // 消除临时moveDiv
        }
      },
      changeMoveDiv ($event) { // 鼠标移动拉框
        if (this.createToggle) {
          if (this.changeTimer) return;
          this.changeTimer = setTimeout(() => {
            this.changeMoveDivComputed($event);
            this.changeTimer = null;
          }, 20);
        }
      },
      reChangeMoveDiv (obj) {
        this.moveDivList.forEach((item, index) => {
          if (item.id === obj.id) {
            this.moveDivList.splice(index, 1, obj);
          }
        });
      },
      startCreateMoveDivComputed (e) { // 初始状态计算
        let ft = this.$refs.bg.getBoundingClientRect().top;
        let fl = this.$refs.bg.getBoundingClientRect().left;
        let startX = this.checkCapture('x', e.pageX) - fl;
        let startY = this.checkCapture('y', e.pageY) - ft;
        this.$set(this.currentAttribute, 'left', startX);
        this.$set(this.currentAttribute, 'top', startY);
        Object.assign(this.currentAttribute, {
          startX: this.checkCapture('x', e.pageX),
          startY: this.checkCapture('y', e.pageY),
          orangeX: startX,
          orangeY: startY
        });
      },
      changeMoveDivComputed (e) { // 移动状态计算
        let cw = this.checkCapture('x', e.pageX) - this.currentAttribute.startX;
        let ch = this.checkCapture('y', e.pageY) - this.currentAttribute.startY;
        this.$set(this.currentAttribute, 'left', this.currentAttribute.orangeX + (cw < 0 ? cw : 0));
        this.$set(this.currentAttribute, 'top', this.currentAttribute.orangeY + (ch < 0 ? ch : 0));
        this.$set(this.currentAttribute, 'width', Math.abs(cw));
        this.$set(this.currentAttribute, 'height', Math.abs(ch));
      },
      checkMoveDiv (serialNumber, $event) { // 点击选择框
        $event.stopPropagation();
        let index = this.activeMoveDivSort.indexOf(serialNumber);
        if (index > -1) {
          this.activeMoveDivSort.splice(index, 1);
        } else {
          if (this.isMultipleChoice) {
            this.activeMoveDivSort.push(serialNumber);
          } else {
            this.activeMoveDivSort = [serialNumber];
          }
        }
        this.$store.dispatch('changeCheckedQuestionList', this.activeMoveDivSort);
      },
      getScoreCatchCell (catchArr, item) {
        if (item.score || item.currentBtn) {
          let {serialNumber, score, currentBtn} = item;
          catchArr.push({serialNumber, score, currentBtn});
        }
      },
      mergeTem () { // 合并当前选择的框
        let minSort = _.min(this.activeMoveDivSort);
        let sort = 1;
        let opre = 0; // 上一个循环原始值
        let cpre = 0; // 上一个循环当前值
        let scoreCatch = [];
        this.moveDivList = [...(this.moveDivList.map((item) => { // 合并后序号调整并排序方法
          if (this.activeMoveDivSort.includes(item.serialNumber)) { // 选中框序号合并成选中框中序号最小的那个
            if (item.serialNumber == minSort) {
              this.getScoreCatchCell(scoreCatch, item);
              item.mergeHeader = minSort; // 将合并的最小序列号对象标记为合并头，属性值定为当前合并序列号
              sort++;
            } else {
              item.mergeHeader && (delete item.mergeHeader); // 若本身为合并头，删除标记
              item.mergeBody = minSort; // 合并的其他对象标记为合并身，属性值定为当前合并序列号
            }
            item.serialNumber = minSort;
          } else {
            this.getScoreCatchCell(scoreCatch, item);
            if (item.serialNumber == opre) { // 当前循环值与上一循环原始值想等，则表示当前与上一个以合并
              item.serialNumber = cpre;
            } else {
              opre = item.serialNumber;
              if (item.serialNumber >= sort) { // 序号大于等于排列序号则重赋值序号
                cpre = item.serialNumber = sort;
                sort++;
              }
            }
          }
          return item;
        }).sort((a, b) => {
          return (a.serialNumber - b.serialNumber);
        }))];
        this.activeMoveDivSort = [minSort]; // 合并后选中序号只有之前未合并前最小序号
        this.$store.dispatch('changeQuestionScoreCatch', [...scoreCatch]);
        this.$store.dispatch('changeCheckedQuestionList', [minSort]);
        this.serialNumber = sort; // 后续添加序号重赋值
      },
      deleteTem () { // 删除选中框,并重排序
        let sort = 1;
        let opre = 0; // 上一个循环原始值
        let cpre = 0; // 上一个循环当前值
        let result = [];
        let scoreCatch = [];
        this.moveDivList.forEach((item) => {
          if (!this.activeMoveDivSort.includes(item.serialNumber)) {
            if (item.serialNumber == opre) { // 当前循环值与上一循环原始值想等，则表示当前与上一个以合并
              item.serialNumber = cpre;
            } else {
              opre = item.serialNumber;
              if (item.serialNumber >= sort) { // 序号大于等于排列序号则重赋值序号
                cpre = item.serialNumber = sort;
                sort++;
              }
            }
            this.getScoreCatchCell(scoreCatch, item);
            result.push(item);
          }
        });
        this.serialNumber = sort; // 后续添加序号重赋值
        this.activeMoveDivSort = [];
        this.$store.dispatch('changeQuestionScoreCatch', [...scoreCatch]);
        this.$store.dispatch('changeCheckedQuestionList', []);
        this.moveDivList = [...result];
      }
    },
    components: {
      moveDiv
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'drawFrame']{
    position: absolute;
    .wh(100%, 100%);
    left: 0;top: 0;
    display: flex;
    flex-direction: column;
    z-index: 999;
  }
</style>
