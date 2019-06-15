<template>
  <div name='imgAdjust' class="fillcontain">
    <headTop></headTop>
    <makeBody @next="submit">
      <div class="imgArea" @mousemove="change" @mouseup="end">
        <div class="imgWrapper" ref="imgWrapper">
          <div class="bt"></div><div class="bb"></div><div class="bl"></div><div class="br"></div>
          <imgBorder :attribute="attribute" :startCreate="startCreate" ref="imgBorder">
            <img ref="dealImg" :src="currentEditTemplate.url" alt="">
          </imgBorder>
        </div>
      </div>
    </makeBody>
    <fc-loading :loading-modal.sync="loadingModal"></fc-loading>
  </div>
</template>

<script type='text/babel'>
  import makeBody from './components/makeBody';
  import imgBorder from './components/imgBorder';
  import {getCss} from './js';
  import html2canvas from 'html2canvas';
  export default {
    name: 'imgAdjust',
    data () {
      return {
        attribute: {
          width: 0,
          height: 0,
          left: 0,
          top: 0
        },
        startCreate: false, // 与加载弹框控制变量不能使用同一个，生成图片过程不能手动关闭该开关。
        loadingModal: false
      };
    },
    mounted () {
      this.getWH();
    },
    computed: {
      currentEditTemplate () {
        return JSON.parse(this.$store.getters.currentEditTemplate);
      }
    },
    methods: {
      getWH () { // 计算图片放到框中居中沾满且不改变比例(获取初始attribute)
        let img = document.createElement('img');
        img.src = this.currentEditTemplate.url;
        img.onload = () => {
          let wrapper = this.$refs.imgWrapper;
          let imgWHPer = img.width / img.height;
          let wwNum = parseFloat(getCss(wrapper, 'width'));
          let whNum = parseFloat(getCss(wrapper, 'height'));
          let wrapperWHPer = wwNum / whNum;
          let posCenter = (tooWidth) => {
            this.$nextTick(() => {
              if (tooWidth) {
                this.$set(this.attribute, 'width', wwNum);
                this.$set(this.attribute, 'height', wwNum / imgWHPer);
                this.$set(this.attribute, 'top', whNum / 2 - this.attribute.height / 2);
              } else {
                this.$set(this.attribute, 'height', whNum);
                this.$set(this.attribute, 'width', whNum * imgWHPer);
                this.$set(this.attribute, 'left', wwNum / 2 - this.attribute.width / 2);
              }
            });
          };
          posCenter(imgWHPer > wrapperWHPer);
        };
      },
      change (e) {
        this.$refs.imgBorder.change(e);
        this.$refs.imgBorder.rotateChange(e);
      },
      end (e) {
        this.$refs.imgBorder.end(e);
        this.$refs.imgBorder.rotateEnd(e);
      },
      submit () {
        this.loadingModal = true;
        this.startCreate = true;
        this.$nextTick(() => {
          html2canvas(this.$refs.imgWrapper).then(canvas => {
            this.startCreate = false;
            this.loadingModal = false;
            let saveUrl = canvas.toDataURL('image/png');
            console.log(saveUrl);
            // 点击生成图片并自动下载方法：
            // let a = document.createElement('a');
            // document.body.appendChild(a);
            // a.href = saveUrl;
            // a.download = '这是图片标题';
            // a.click();
          });
        });
        // this.$router.replace('frameTemplate');
      }
    },
    components: {
      makeBody,
      imgBorder
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'imgAdjust']{
    .imgArea{
      .wh(100%, 800px);
      min-width: 600px;
      .fac();
      .imgWrapper{
        position: relative;
        .wh(546px, 729px);
        .bb, .bt, .br, .bl{
          z-index: 9999;
          position: absolute;
        }
        .bl, .br{
          .wh(2px, 733px);
          background-color: #FF0000;
          top: -2px;
        }
        .bb, .bt{
          .wh(550px, 2px);
          background-color: #FF0000;
          left: -2px;
        }
        .bl{
          left: -2px;
        }
        .br{
          right: -2px;
        }
        .bb{
          bottom: -2px;
        }
        .bt{
          top: -2px;
        }
        img{
          .wh(100%, auto)
        }
      }
    }
  }
</style>
