<template>
  <section name="imgBorder" :style="{'left': attribute.left + 'px', 'top': attribute.top + 'px', 'width': attribute.width + 'px', 'height': attribute.height + 'px', transform: 'rotateZ(' + currentDeg + 'deg)'}" ref="moveDiv">
    <article class="shade fillcontain" v-if="onlyRotate"></article>
    <article class="fillcontain" v-if="onlyRotate">
      <img crossOrigin="anonymous" :src='imgUrl' alt="">
    </article>
    <article class="rotateArea" v-if="onlyRotate" v-show="!startCreate">
      <div class="rotateBtn"  @mousedown="rotateStart" @mousemove="rotateChange" @mouseup="rotateEnd">
        <i class="iconfont iconRotate"></i>
      </div>
    </article>
    <article class="frameArea" :class="{'noBorder': startCreate}" :style="{'left': currentAttribute.left + 'px', 'top': currentAttribute.top + 'px', 'width': currentAttribute.width + 'px', 'height': currentAttribute.height + 'px', transform: 'scale(' + scale +  ',' + scale + ')'}" v-if="onlyFrame" ref="imgWrapper">
      <img class="inImg" crossOrigin="anonymous" :style="{'left': -currentAttribute.left - 1 + 'px', 'top': -currentAttribute.top - 1 + 'px', 'width': attribute.width + 'px', 'height': attribute.height + 'px',transform: 'rotateZ(' + currentImageAdjustRotate + 'deg)'}" :src='imgUrl' alt="">
      <div v-show="!startCreate">
        <div class="top" @mousedown="start('move', $event)"></div>
        <div class="w" @mousedown="start('w', $event)"></div>
        <div class="wn" @mousedown="start('wn', $event)"></div>
        <div class="n" @mousedown="start('n', $event)"></div>
        <div class="en" @mousedown="start('en', $event)"></div>
        <div class="e" @mousedown="start('e', $event)"></div>
        <div class="es" @mousedown="start('es', $event)"></div>
        <div class="s" @mousedown="start('s', $event)"></div>
        <div class="ws" @mousedown="start('ws', $event)"></div>
      </div>
    </article>
  </section>
</template>

<script type='text/babel'>
  import html2canvas from 'html2canvas';
  export default {
    name: 'imgBorder',
    props: {
      attribute: { // 带返回参数则返回指定路由
        type: Object,
        default: () => {
          return {};
        }
      },
      onlyRotate: { // 使当前组件只用来旋转
        type: Boolean,
        default: false
      },
      onlyFrame: { // 当前组件只用来截取
        type: Boolean,
        default: false
      },
      imgUrl: {
        type: String
      }
    },
    data () {
      return {
        startX: 0,
        startY: 0,
        scale: 1,
        startCreate: false,
        currentAttribute: {}, // 当前状态
        orangeAttribute: {}, // 初始状态
        changeType: '',
        rotateStartToggle: false,
        currentDeg: 0,
        rotateCenterX: 0,
        rotateCenterY: 0,
        startRotate: false,
        centerComputeToggle: true
      };
    },
    computed: {
      currentImageAdjustRotate () {
        return this.onlyFrame ? this.$store.getters.currentImageAdjustRotate : 0;
      },
      imgScale () {
        return this.$store.getters.imgScale;
      }
    },
    mounted () {
      this.resetFrame();
    },
    watch: {
      attribute: {
        handler () {
          this.resetFrame();
        },
        deep: true
      }
    },
    methods: {
      resetRotate () { // 重置旋转角度
        this.currentDeg = 0;
        this.$store.dispatch('changeCurrentImageAdjustRotate', 0);
      },
      resetFrame () { // 重置截图区域
        for (let key in this.attribute) {
          switch (key) {
            case 'left':
            case 'top':
              this.$set(this.currentAttribute, key, 0);
               break;
            case 'width':
            case 'height':
              this.$set(this.currentAttribute, key, this.attribute[key]);
              break;
          }
        }
      },
      getRotateCenter () { // 点击开始定位转动中心，在转动过中定位圆心会闪动
        if (this.centerComputeToggle) { // 旋转中心只计算一次
          this.centerComputeToggle = false;
          let moveDiv = this.$refs.moveDiv;
          this.rotateCenterX = moveDiv.getBoundingClientRect().left + this.currentAttribute.width / 2;
          this.rotateCenterY = moveDiv.getBoundingClientRect().top + this.currentAttribute.height / 2;
        }
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
        this.$store.dispatch('changeCurrentImageAdjustRotate', angle);
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
        let r = this.orangeAttribute.width + this.orangeAttribute.left; // 最初右边位置
        let b = this.orangeAttribute.height + this.orangeAttribute.top; // 最初底边位置
        mw && ((cl > r && (cl = r)) || (cl < -1 && (cl = -1))); // 左边动不能超过右边,不能小于-1,border1像素
        mn && ((ct > b && (ct = b)) || (ct < -1 && (ct = -1))); // 上边动不能超过下边,不能小于-1

        let cw = this.orangeAttribute.width + (mw ? (cl >= -1 ? -mx : 0) : mx); // 当前width
        let ch = this.orangeAttribute.height + (mn ? (ct >= -1 ? -my : 0) : my); // 当前height
        cw < 0 && (cw = 0); // 宽度动不能小于0
        ch < 0 && (ch = 0); // 高度动不能小于0
        if (im) {
          moveArr.push(...[{'left': cl}, {'top': ct}]);
        } else {
          mw && moveArr.push(...[{'left': cl}, {'width': cw}]);
          mn && moveArr.push(...[{'top': ct}, {'height': ch}]);
          me && cw + cl <= this.attribute.width && moveArr.push(...[{'width': cw}]); // 右边不能超出限制框右边
          ms && ch + ct <= this.attribute.height && moveArr.push(...[{'height': ch}]); // 下边不能超出限制框下
        }
        this.changeDom([...moveArr]);
      },
      changeDom (changeArr) { // 动态改变currentAttribute同步改变dom方法
        for (let i = 0; i < changeArr.length; i++) {
          let itemKey = Object.keys(changeArr[i])[0];
          this.$set(this.currentAttribute, itemKey, changeArr[i][itemKey]);
        }
      },
      submit (callback) {
        if (!this.onlyFrame) return;
        const DPR = window.devicePixelRatio; // 设备像素比
        this.startCreate = true;
        this.scale = this.imgScale / DPR; // 放大截图，增加清晰度
        this.$nextTick(() => {
          html2canvas(this.$refs.imgWrapper, {useCORS: true}).then(canvas => {
            this.startCreate = false;
            this.scale = 1;
            callback(canvas.toDataURL('image/png'));
          });
        });
      }
    }
  };
</script>
<style scoped lang="less">
  [name = 'imgBorder']{
    box-sizing: border-box;
    position: absolute;
    z-index: 100;
    cursor: move;
    img{
      width: 100%;
      height: auto;
    }
    .noBorder{
      border: none!important;
    }
    .frameArea{
      position: absolute;
      border: 1px solid #999;
      overflow: hidden;
      .inImg{
        position: absolute;
      }
    }
    .shade{
      position: absolute;
      z-index: 1;
      background: rgba(0, 0, 0, 0.4);
    }
    .rotateBtn{
      cursor: pointer;
      position: absolute;
      z-index: 3;
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
