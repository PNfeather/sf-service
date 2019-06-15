<template>
  <div name="drawFrame" @mousedown="createMoveDiv" @mouseup="endMoveDiv"  @mousemove="changeMoveDiv" ref="bg">
      <moveDiv v-show="currentAttribute.width && currentAttribute.height" :attribute="currentAttribute" :checked="true" :canChange="false"></moveDiv>
      <moveDiv
        v-for="item in moveDivList"
        :key="item.id"
        :attribute="item.attribute"
        :originalItem="item"
        :checked="activeMoveDivSort.includes(item.sort)"
        @click="checkMoveDiv(item.sort, $event)"
        @change="reChangeMoveDiv"></moveDiv>
  </div>
</template>

<script type='text/babel'>
  import moveDiv from './moveDiv.vue';
  import _ from '@/plugins/lodash';
  export default {
    name: 'drawFrame',
    data () {
      return {
        moveDivList: [], // moveDiv数据list
        id: 1, // moveDiv 唯一id
        sort: 1, // 对应序号，可合并用
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
      moveDivList: {
        handler (val) {
          if (!val.length) return;
          console.log(val);
          val.forEach((item) => {
            let attr = item.attribute;
            this.capturePoints.x.push(attr.startX, attr.startX + attr.width);
            this.capturePoints.y.push(attr.startY, attr.startY + attr.height);
            this.capturePoints.x = Array.from(new Set(this.capturePoints.x));
            this.capturePoints.y = Array.from(new Set(this.capturePoints.y));
          });
        },
        deep: true
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
            sort: this.sort,
            attribute: {...this.currentAttribute}
          });
          this.id++;
          this.sort++;
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
      checkMoveDiv (sort, $event) { // 点击选择框
        $event.stopPropagation();
        let index = this.activeMoveDivSort.indexOf(sort);
        if (index > -1) {
          this.activeMoveDivSort.splice(index, 1);
        } else {
          this.activeMoveDivSort.push(sort);
        }
      },
      mergeTem () { // 合并当前选择的框
        let minSort = _.min(this.activeMoveDivSort);
        this.moveDivList = [...this.moveDivList.map((item, index) => {
          if (this.activeMoveDivSort.includes(item.sort)) { // 选中框序号合并成选中框中序号最小的那个
            item.sort = minSort;
          } else if (index > 1) { // 不在选中中的序列号等于上一个序号+1
            item.sort = this.moveDivList[index - 1].sort + 1;
          }
          (index === this.moveDivList.length - 1) && (this.sort = item.sort + 1); // 下一个新添加的序号变为列队最后一个的序号+1
          return item;
        })];
      },
      deleteTem () { // 删除选中框
        this.moveDivList = [...this.moveDivList.filter((item) => {
          return !this.activeMoveDivSort.includes(item.sort);
        })];
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
