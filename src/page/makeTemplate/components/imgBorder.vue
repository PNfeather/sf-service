<template>
  <div name="imgBorder" :class="{'noBorder': startCreate}" :style="{'left': currentAttribute.left + 'px', 'top': currentAttribute.top + 'px', 'width': currentAttribute.width + 'px', 'height': currentAttribute.height + 'px', transform: 'rotateZ(' + currentDeg + 'deg)'}" ref="moveDiv">
    <div class="fillcontain" style="overflow:hidden;">
      <slot></slot>
    </div>
    <div class="funArea" v-show="!startCreate">
      <div class="rotateBtn"  @mousedown="rotateStart" @mousemove="rotateChange" @mouseup="rotateEnd">
        <i class="iconfont iconRotate"></i>
      </div>
      <div class="top" @mousedown="start('move', $event)" @mousemove="change" @mouseup="end"></div>
      <div class="w" @mousedown="start('w', $event)" @mousemove="change" @mouseup="end"></div>
      <div class="wn" @mousedown="start('wn', $event)" @mousemove="change" @mouseup="end"></div>
      <div class="n" @mousedown="start('n', $event)" @mousemove="change" @mouseup="end"></div>
      <div class="en" @mousedown="start('en', $event)" @mousemove="change" @mouseup="end"></div>
      <div class="e" @mousedown="start('e', $event)" @mousemove="change" @mouseup="end"></div>
      <div class="es" @mousedown="start('es', $event)" @mousemove="change" @mouseup="end"></div>
      <div class="s" @mousedown="start('s', $event)" @mousemove="change" @mouseup="end"></div>
      <div class="ws" @mousedown="start('ws', $event)" @mousemove="change" @mouseup="end"></div>
    </div>
  </div>
</template>

<script type='text/babel'>
  export default {
    name: 'imgBorder',
    props: {
      attribute: { // 带返回参数则返回指定路由
        type: Object,
        default: () => {
          return {};
        }
      },
      startCreate: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        startX: 0,
        startY: 0,
        currentAttribute: {}, // 当前状态
        orangeAttribute: {}, // 初始状态
        changeType: '',
        rotateStartToggle: false,
        currentDeg: 0,
        rotateCenterX: 0,
        rotateCenterY: 0,
        startRotate: false
      };
    },
    mounted () {
      this.currentAttribute = {...this.attribute};
    },
    watch: {
      attribute: {
        handler (val) {
          this.currentAttribute = {...val};
        },
        deep: true
      }
    },
    methods: {
      getRotateCenter () { // 点击开始定位转动中心，在转动过中定位圆心会闪动
        let moveDiv = this.$refs.moveDiv;
        this.rotateCenterX = moveDiv.getBoundingClientRect().left + this.currentAttribute.width / 2;
        this.rotateCenterY = moveDiv.getBoundingClientRect().top + this.currentAttribute.height / 2;
      },
      computedAngle (e) { // 计算当前转动角度
        let cx = e.pageX - this.rotateCenterX;
        let cy = e.pageY - this.rotateCenterY;
        let angle = Math.atan(Math.abs(cx / cy)) / (2 * Math.PI) * 360;
        // 初始转动位置在正下方，数学坐标系第三象限为0~90度，不需要调整
        if (cx <= 0 && cy < 0) { // 初始转动位置在正下方，数学坐标系第二象限为90~180度
          angle = 180 - angle;
        } else if (cx > 0 && cy <= 0) { // 初始转动位置在正下方，数学坐标系第一象限为-90~-180度
          angle = angle - 180;
        } else if (cx >= 0 && cy > 0) { // 初始转动位置在正下方，数学坐标系第四象限为-0~-90度
          angle = -angle;
        }
        return angle;
      },
      rotateStart () {
        this.getRotateCenter();
        this.startRotate = true;
      },
      rotateChange (e) {
        if (this.startRotate) {
          this.currentDeg = this.computedAngle(e);
        }
      },
      rotateEnd (e) {
        this.startRotate = false;
      },
      start (type, e) {
        type !== 'move' && e.stopPropagation();
        this.startX = e.pageX;
        this.startY = e.pageY;
        this.changeType = type;
        this.orangeAttribute = {...this.currentAttribute};
      },
      end (e) {
        this.changeType = '';
      },
      change (e) { // 改变方法
        if (!this.changeType) return;
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
        let r = this.orangeAttribute.width + this.orangeAttribute.left; // 最初右边位置
        let b = this.orangeAttribute.height + this.orangeAttribute.top; // 最初底边位置
        cw < 0 && (cw = 0); // 宽度动不能小于0
        ch < 0 && (ch = 0); // 高度动不能小于0
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
        }
      }
    }
  };
</script>
<style scoped lang="less">
  .noBorder{
    border: none!important;
  }
  [name = 'imgBorder']{
    box-sizing: border-box;
    position: absolute;
    border: 1px solid #999;
    z-index: 100;
    cursor: move;
    .rotateBtn{
      cursor: pointer;
      position: absolute;
      left: 50%;
      transform: translateX(-15px);
      bottom: -42px;
      width: 30px;
      height: 30px;
      border-radius: 100%;
      background-color: #1690FF;
      display: flex;
      justify-content: center;
      align-items: center;
      &:before{
        content: '';
        position: absolute;
        top: -12px;
        width: 1px;
        height: 12px;
        background-color: #1690FF;
        left: 14.5px;
      }
      .iconfont{
        font-size: 16px;
        color: #fff;
      }
    }
    .top{
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      top: 0;
      z-index: 1;
    }
    .w{
      position: absolute;
      height: 100%;
      width: 8px;
      left: -2px;
      top: 0;
      z-index: 2;
      cursor: w-resize;
    }
    .wn{
      position: absolute;
      height: 8px;
      width: 8px;
      left: -2px;
      top: -2px;
      z-index: 3;
      cursor: nw-resize;
      border: 1px solid #ccc;
      background-color: #FFF;
    }
    .n{
      position: absolute;
      width: 100%;
      height: 8px;
      top: -2px;
      left: 0;
      z-index: 2;
      cursor: n-resize;
    }
    .en{
      position: absolute;
      height: 8px;
      width: 8px;
      right: -2px;
      top: -2px;
      z-index: 3;
      cursor: ne-resize;
      border: 1px solid #ccc;
      background-color: #FFF;
    }
    .e{
      position: absolute;
      height: 100%;
      width: 8px;
      right: -2px;
      top: 0;
      z-index: 2;
      cursor: e-resize;
    }
    .es{
      position: absolute;
      height: 8px;
      width: 8px;
      right: -2px;
      bottom: -2px;
      z-index: 3;
      cursor: se-resize;
      border: 1px solid #ccc;
      background-color: #FFF;
    }
    .s{
      position: absolute;
      width: 100%;
      height: 8px;
      bottom: -2px;
      left: 0;
      z-index: 2;
      cursor: s-resize;
    }
    .ws{
      position: absolute;
      height: 8px;
      width: 8px;
      left: -2px;
      bottom: -2px;
      z-index: 3;
      cursor: sw-resize;
      border: 1px solid #ccc;
      background-color: #FFF;
    }
  }
</style>
