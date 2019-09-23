<template>
  <div name="drawFrame" @mousedown="createMoveDiv" @mouseup="endMoveDiv"  @mousemove="changeMoveDiv" ref="bg">
      <moveDiv v-show="currentAttribute.width && currentAttribute.height" :attribute="currentAttribute" :checked="true" :canChange="false"></moveDiv>
      <moveDiv :attribute="markerArea" :checked="pickCRD" :type="'markerArea'" @change="reChangeMarkerArea" @click="() => { this.$emit('pickCRDMethod'); }"></moveDiv>
      <moveDiv
        v-for="item in moveDivList"
        :key="item.identify"
        :attribute="item.attribute"
        :originalItem="item"
        :checked="checkedQuestionList.includes(item.serialNumber)"
        @click="checkMoveDiv(item.serialNumber, $event)"
        @change="reChangeMoveDiv"></moveDiv>
  </div>
</template>

<script type='text/babel'>
  import {getTemplatePage} from '@/api/tPage';
  import moveDiv from './moveDiv.vue';
  export default {
    name: 'drawFrame',
    props: {
      isMultipleChoice: { // 复选开关
        type: Boolean,
        default: false
      },
      pickCRD: { // 识别区选中开关
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        markerArea: {},
        moveDivList: [], // moveDiv数据list
        identify: 1, // moveDiv 唯一辨识码
        serialNumber: 1, // 对应序号，可合并用
        createToggle: false, // 创建开关
        captureToggle: true,
        changeTimer: null,
        currentAttribute: {},
        capturePoints: {x: [], y: []}, // 捕捉点缓存
        warnTimer: null
      };
    },
    watch: {
      questionScoreCatch: { // 分数变化时将分数挂到对应选框上
        handler (val) {
          let c = {};
          val.forEach((item) => {
            c[item.serialNumber] = {
              score: item.score,
              currentBtn: item.currentBtn
            };
          });
          this.moveDivList.forEach((item) => {
            c[item.serialNumber] && Object.assign(item, c[item.serialNumber]);
          });
        },
        deep: true
      },
      moveDivList: {
        handler (val) {
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
      }
    },
    computed: {
      checkedQuestionList () {
        return this.$store.getters.checkedQuestionList;
      },
      questionScoreCatch () {
        return this.$store.getters.questionScoreCatch;
      },
      imgScale () {
        return this.$store.getters.imgScale;
      },
      markerAreaWidth () {
        return this.$store.getters.markerAreaWidth;
      },
      markerAreaHeight () {
        return this.$store.getters.markerAreaHeight;
      }
    },
    created () { // 页面初始化清空页面vuex
      this.$store.dispatch('changeIsMergeSort', {});
      this.$store.dispatch('changeQuestionScoreCatch', []);
      this.$store.dispatch('changeCheckedQuestionList', []);
    },
    mounted () { // 进来已有模板情况加载模板数据
      this.pageInit();
    },
    methods: {
      getMarkArea (markerArea) { // 标识区渲染
        if (markerArea) {
          let params = {...markerArea};
          let keys = Object.keys(params);
          for (let i in keys) {
            params[keys[i]] = params[keys[i]] / this.imgScale;
          }
          this.markerArea = params;
        } else {
          let elW = this.markerAreaWidth;
          let elH = this.markerAreaHeight;
          let temW = this.$store.getters.templateWidth;
          let temH = this.$store.getters.templateHeight;
          this.markerArea = {
            width: elW,
            height: elH,
            top: Math.floor(temH / 2 - elH / 2),
            left: Math.floor(temW / 2 - elW / 2)
          };
        }
        this.$nextTick(() => { // 获取到识别区后，选中
          this.$emit('pickCRDMethod');
        });
      },
      pageInit () {
        let templatePageId = this.$route.query.templatePageId;
        if (templatePageId) { // 存在模板id调接口获取模板数据，否则是新建模板
          getTemplatePage({id: templatePageId}).then(res => {
            const data = res.data;
            if (data.code == 0) {
              const reData = data.data;
              const arr = reData.questionSigns;
              const ft = this.$refs.bg.getBoundingClientRect().top;
              const fl = this.$refs.bg.getBoundingClientRect().left;
              let exitHeaderCatch = {}; // 已存在序号缓存
              let isMergeSort = {}; // 当前序号是否是存在合并项序号数组
              this.$emit('outputColumnNumber', reData.columnNumber);
              this.getMarkArea(reData.markerArea);
              if (arr && arr.length) {
                arr.forEach((item) => {
                  item.left = item.leftPoint / this.imgScale;
                  item.top = item.topPoint / this.imgScale;
                  item.height = item.height / this.imgScale;
                  item.width = item.width / this.imgScale;
                  const {serialNumber, score, width, height, top, left} = item;
                  let cell = {serialNumber, score};
                  if (exitHeaderCatch[item.serialNumber]) {
                    isMergeSort[item.serialNumber] = true;
                  } else {
                    exitHeaderCatch[item.serialNumber] = true;
                  }
                  cell.attribute = {width, height, top, left};
                  cell.attribute.startX = fl + item.left;
                  cell.attribute.startY = ft + item.top; // 拱捕获使用
                  cell.identify = this.identify++;
                  (item.serialNumber + 1 > this.serialNumber) && (this.serialNumber = item.serialNumber + 1); // 循环玩当序号排列为已存在的最大序号加1，id一次排过来
                  this.$store.dispatch('changeIsMergeSort', isMergeSort);
                  this.moveDivList.push(cell);
                });
              }
            } else {
              this.$message.error(data.message);
            }
          });
        } else {
          this.getMarkArea();
        }
      },
      checkCapture (type, currentData) { // 捕获计算
        let result = currentData;
        let limit = 10;
        if (!this.captureToggle) return result;
        this.capturePoints[type].length && this.capturePoints[type].forEach((item) => {
          (item - limit < result) && (item + limit > result) && (result = item);
        });
        return result;
      },
      createMoveDiv ($event) { // 开始拉框制作选区
        if (this.pickCRD) { // 若标识区选中状态，关闭标识区开始执行画框
          this.$emit('pickCRDMethod');
        }
        this.createToggle = true;
        this.currentAttribute = {}; // 消除临时moveDiv
        this.startCreateMoveDivComputed($event);
      },
      endMoveDiv ($event) { // 结束拉框
        if (this.createToggle) {
          this.createToggle = false;
          this.changeMoveDivComputed($event);
          if (this.currentAttribute.width <= 10 || this.currentAttribute.height <= 5) { // 画框过小直接取消此次画框
            return (this.currentAttribute = {}); // 消除临时moveDiv;
          }
          this.moveDivList.push({
            identify: this.identify,
            serialNumber: this.serialNumber,
            attribute: {...this.currentAttribute}
          });
          this.identify++;
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
          if (item.identify === obj.identify) {
            this.moveDivList.splice(index, 1, obj);
          }
        });
      },
      reChangeMarkerArea (obj) {
        Object.assign(this.markerArea, obj.attribute);
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
        let activeList = [...this.checkedQuestionList];
        let index = activeList.indexOf(serialNumber);
        if (index > -1) {
          activeList.splice(index, 1);
        } else {
          if (this.isMultipleChoice) {
            activeList.push(serialNumber);
          } else {
            activeList = [serialNumber];
          }
        }
        this.$store.dispatch('changeCheckedQuestionList', activeList);
      },
      getScoreCatchCell (catchArr, item) { // 题目分数缓存
        if (item.score || item.currentBtn) {
          let {serialNumber, score, currentBtn} = item;
          catchArr.push({serialNumber, score, currentBtn});
        }
      },
      getSortTypeInfo (type) {
        const len = this.checkedQuestionList.length;
        const allInfo = {
          'type-merge': {
            'successMsg': '合并成功',
            'validate': () => {
              let validateMsg = '';
              if (!len) {
                validateMsg = '请通过多选选择需要合并的选区';
              } else if (len === 1) {
                validateMsg = '当前选区对应同一题目';
              }
              return validateMsg;
            }
          },
          'type-cancel': {
            'successMsg': '取消合并',
            'validate': () => { // 取消合并不需要做验证
              return false;
            }
          },
          'type-delete': {
            'successMsg': '删除选题',
            'validate': () => { // 取消合并不需要做验证
              let validateMsg = '';
              if (!len) {
                validateMsg = '请选择选区(识别区除外)';
              }
              return validateMsg;
            }
          }
        };
        return allInfo[type];
      },
      reSortList (type, callback) { // 数据重排序方法 type: type-merge合并重排序、type-cancel取消合并重排序、type-delete删除重排序
        const typeInfo = this.getSortTypeInfo(type);
        const successMsg = typeInfo.successMsg;
        const validateMsg = typeInfo.validate();
        if (validateMsg) {
          return this.$message.warn(validateMsg);
        }

        let activeList = [...this.checkedQuestionList]; // 选中题目序号数组
        let sort = 1; // 题目序号
        let result = []; // 结果数组
        let scoreCatch = []; // 分数换粗数组
        let resultActiveMoveDivSort = []; // 结果选中状态数组
        let changeCatch = {}; // 储存序号变化
        let isMergeSort = {}; // 当前序号是否是存在合并项序号数组

        this.moveDivList.sort((a, b) => { // 排序后开始处理
          return (a.serialNumber - b.serialNumber);
        }).forEach((item) => {
          if (!activeList.includes(item.serialNumber)) { // 不在选中的数组单元重新push
            if (!changeCatch[item.serialNumber]) { // 缓存无当前序号，则添加缓存
              item.serialNumber = changeCatch[item.serialNumber] = sort++;
              this.getScoreCatchCell(scoreCatch, item);
            } else { // 序号存在于缓存中，取缓存序号赋值
              item.serialNumber = changeCatch[item.serialNumber];
              isMergeSort[item.serialNumber] = true;
            }
            result.push(item);
          } else { // 在选中数组中时
            if (type === 'type-merge') { // 合并时
              if (!changeCatch.mergeSort) { // 缓存无当前序号，则添加缓存，合并缓存为特殊键mergeSort
                item.serialNumber = changeCatch.mergeSort = sort++;
                resultActiveMoveDivSort = [item.serialNumber];
                isMergeSort[item.serialNumber] = true;
                this.getScoreCatchCell(scoreCatch, item);
              } else { // 在缓存中，取缓存赋值
                item.serialNumber = changeCatch.mergeSort;
              }
              result.push(item);
            }
            if (type === 'type-cancel') { // 取消合并时，每个选中项都拆分为单一序号
              item.serialNumber = changeCatch[item.serialNumber] = sort++;
              resultActiveMoveDivSort.push(item.serialNumber);
              this.getScoreCatchCell(scoreCatch, item);
              result.push(item);
            }
          }
        });

        this.serialNumber = sort; // 后续添加序号重赋值
        this.$store.dispatch('changeIsMergeSort', isMergeSort);
        this.$store.dispatch('changeQuestionScoreCatch', [...scoreCatch]);
        this.$store.dispatch('changeCheckedQuestionList', [...resultActiveMoveDivSort]);
        this.moveDivList.length = 0; // 清空题目数组，重新push，不改变指针
        this.moveDivList.push(...result.sort((a, b) => { // 排序后重新push
          return (a.serialNumber - b.serialNumber);
        }));
        callback && callback();
        this.$message.success(successMsg);
      },
      mergeTem (callback) { // 合并当前选择的框
        this.reSortList('type-merge', callback);
      },
      cancelMergeTem () { // 取消合并
        this.reSortList('type-cancel');
      },
      deleteTem () { // 删除选中框,并重排序
        this.reSortList('type-delete');
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
