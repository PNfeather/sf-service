<template>
  <div name="moveDiv">
    <div class="subDiv" :class="{'changing': changeType}" v-if="canChange && checked" @mousemove="change" @mouseup="end"></div>
    <div @click="checkSelf" @mousedown.stop="start('move', $event)" @mousemove="change" @mouseup="end" class="moveDiv" :class="{'active': changeType, 'canChange': canChange && checked, 'markerAreaCantChange': !checked && (type === 'markerArea')}" :style="{'left': currentAttribute.left + 'px', 'top': currentAttribute.top + 'px', 'width': currentAttribute.width + 'px', 'height': currentAttribute.height + 'px'}" ref="moveDiv">
      <div class="w" v-if="canChange && checked" @mousedown.stop="start('w', $event)" @mousemove="change" @mouseup="end"></div>
      <div class="wn" v-if="canChange && checked" @mousedown.stop="start('wn', $event)" @mousemove="change" @mouseup="end"></div>
      <div class="n" v-if="canChange && checked" @mousedown.stop="start('n', $event)" @mousemove="change" @mouseup="end"></div>
      <div class="en" v-if="canChange && checked" @mousedown.stop="start('en', $event)" @mousemove="change" @mouseup="end"></div>
      <div class="e" v-if="canChange && checked" @mousedown.stop="start('e', $event)" @mousemove="change" @mouseup="end"></div>
      <div class="es" v-if="canChange && checked" @mousedown.stop="start('es', $event)" @mousemove="change" @mouseup="end"></div>
      <div class="s" v-if="canChange && checked" @mousedown.stop="start('s', $event)" @mousemove="change" @mouseup="end"></div>
      <div class="ws" v-if="canChange && checked" @mousedown.stop="start('ws', $event)" @mousemove="change" @mouseup="end"></div>
    </div>
  </div>
</template>

<script type='text/babel'>
  export default {
    name: 'moveDiv',
    props: {
      type: { // 当前moveDiv代表类型： 1、markerArea识别区域
        type: String,
        default: ''
      },
      originalItem: {
        type: Object,
        default: () => {
          return {};
        }
      },
      attribute: { // 带返回参数则返回指定路由
        type: Object,
        default: () => {
          return {};
        }
      },
      checked: { // 位选中状态div不可改变
        type: Boolean,
        default: false
      },
      canChange: { // 创建中的div不可以改变
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        startX: 0,
        startY: 0,
        currentAttribute: {}, // 当前状态
        orangeAttribute: {}, // 初始状态
        changeType: '',
        changeOutPutTimer: 0,
        divNoChange: true
      };
    },
    created () {},
    mounted () {
      if (Object.keys(this.attribute).length) { // 传入初始状态
        this.currentAttribute = {...this.attribute};
      }
    },
    computed: {},
    watch: {
      attribute: { // 监听状态改变时重新赋值初始状态
        handler (val) {
          this.currentAttribute = {...val};
        },
        deep: true
      }
    },
    methods: {
      checkSelf ($event) { // 点击自身放出点击事件，提供给选择方法使用
        this.divNoChange && this.$emit('click', $event);
      },
      start (type, e) { // 元素改变开始
        this.divNoChange = true; // 若元素有变动改为false阻止放出点击事件
        if (!this.canChange || !this.checked) return;
        this.startX = e.pageX;
        this.startY = e.pageY;
        this.changeType = type;
        this.orangeAttribute = {...this.currentAttribute};
      },
      end () { // 元素改变结束
        this.changeType = '';
      },
      change (e) { // 改变方法
        if (!this.changeType) return;
        this.divNoChange = false;
        let limit = 20; // div限制宽高
        let mx = e.pageX - this.startX; // 移动距离
        let my = e.pageY - this.startY;
        let moveArr = []; // 移动方式数组
        let cl = this.orangeAttribute.left + mx; // 当前left
        let ct = this.orangeAttribute.top + my; // 当前top
        let im = this.changeType === 'move'; // 改变方式是移动
        let mw = !im && this.changeType.indexOf('w') > -1; // 左边动
        let mn = !im && this.changeType.indexOf('n') > -1; // 上边动
        let me = !im && this.changeType.indexOf('e') > -1; // 右边动
        let ms = !im && this.changeType.indexOf('s') > -1; // 下边动
        let cw = this.orangeAttribute.width + (mw ? (-mx) : mx); // 当前width
        let ch = this.orangeAttribute.height + (mn ? (-my) : my); // 当前height
        let r = this.orangeAttribute.width + this.orangeAttribute.left - limit; // 最初右边位置
        let b = this.orangeAttribute.height + this.orangeAttribute.top - limit; // 最初底边位置
        cw < limit && (cw = limit); // 宽度动不能小于0
        ch < limit && (ch = limit); // 高度动不能小于0
        mw && cl > r && (cl = r); // 左边动不能超过右边
        mn && ct > b && (ct = b); // 上边动不能超过下边
        if (im) {
          moveArr.push(...[{'left': cl}, {'top': ct}]);
        } else {
          mw && moveArr.push(...[{'left': cl}, {'width': cw}]);
          mn && moveArr.push(...[{'top': ct}, {'height': ch}]);
          me && moveArr.push(...[{'width': cw}]);
          ms && moveArr.push(...[{'height': ch}]);
        }
        this.changeDom([...moveArr]);
      },
      changeDom (changeArr) { // 动态改变currentAttribute同步改变dom方法
        for (let i = 0; i < changeArr.length; i++) {
          let itemKey = Object.keys(changeArr[i])[0];
          this.$set(this.currentAttribute, itemKey, changeArr[i][itemKey]);
          if (this.changeOutPutTimer) clearTimeout(this.changeOutPutTimer);
          this.changeOutPutTimer = setTimeout(() => {
            this.$emit('change', Object.assign({}, this.originalItem, {attribute: this.currentAttribute}));
          }, 300);
        }
      }
    },
    components: {}
  };
</script>
<style scoped lang="less">
  [name = 'moveDiv']{
    .subDiv{
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 9;
    }
    .changing{
      z-index: 99;
    }
    .moveDiv{
      box-sizing: border-box;
      position: absolute;
      border: 1px solid #1690FF;
      z-index: 10;
      .w{
        position: absolute;
        height: 100%;
        width: 5px;
        left: -2px;
        top: 0;
        z-index: 1;
        cursor: w-resize;
      }
      .wn{
        position: absolute;
        height: 5px;
        width: 5px;
        left: -2px;
        top: -2px;
        z-index: 2;
        cursor: nw-resize;
      }
      .n{
        position: absolute;
        width: 100%;
        height: 5px;
        top: -2px;
        left: 0;
        z-index: 1;
        cursor: n-resize;
      }
      .en{
        position: absolute;
        height: 5px;
        width: 5px;
        right: -2px;
        top: -2px;
        z-index: 2;
        cursor: ne-resize;
      }
      .e{
        position: absolute;
        height: 100%;
        width: 5px;
        right: -2px;
        top: 0;
        z-index: 1;
        cursor: e-resize;
      }
      .es{
        position: absolute;
        height: 5px;
        width: 5px;
        right: -2px;
        bottom: -2px;
        z-index: 2;
        cursor: se-resize;
      }
      .s{
        position: absolute;
        width: 100%;
        height: 5px;
        bottom: -2px;
        left: 0;
        z-index: 1;
        cursor: s-resize;
      }
      .ws{
        position: absolute;
        height: 5px;
        width: 5px;
        left: -2px;
        bottom: -2px;
        z-index: 2;
        cursor: sw-resize;
      }
    }
    .active{
      z-index: 100!important;
    }
    .markerAreaCantChange{
      border: 1px solid #b010ff!important;
      z-index: 1;
    }
    .canChange{
      cursor: move;
      border: 1px solid #FF0000!important;
      z-index: 11;
    }
  }
</style>
