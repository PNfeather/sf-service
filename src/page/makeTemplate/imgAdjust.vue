<template>
  <div name='imgAdjust' class='fillcontain'>
    <headTop></headTop>
    <makeBody @next='submit'>
      <div class='imgArea' @mousemove='change' @mouseup='end'>
        <div class='imgWrapper' ref='imgWrapper' :style="{transform: 'scale(' + scale +  ',' + scale + ')', width: templateWidth + 'px', height: templateHeight + 'px'}">
          <div v-show="!startCreate">
            <div class='bt' :style="{width: templateWidth + 4 + 'px'}"></div>
            <div class='bb' :style="{width: templateWidth + 4 + 'px'}"></div>
            <div class='bl' :style="{height: templateHeight + 4 + 'px'}"></div>
            <div class='br' :style="{height: templateHeight + 4 + 'px'}"></div>
          </div>
          <imgBorder :attribute='attribute' :startCreate='startCreate' ref='imgBorder'>
            <img crossOrigin="anonymous" ref='dealImg' :src='`${$CJIMGURL + currentChooseImg.url + $OSSIMGADJUST}`' alt="">
          </imgBorder>
        </div>
      </div>
    </makeBody>
    <fc-loading :loading-modal.sync='loadingModal' text='图片生成中'></fc-loading>
  </div>
</template>

<script type='text/babel'>
  import makeBody from './components/makeBody';
  import imgBorder from './components/imgBorder';
  import {getCss} from './js';
  import html2canvas from 'html2canvas';
  import {changeTemplateImg} from '@/api/uploadImgTemplate';
  export default {
    name: 'imgAdjust',
    data () {
      let query = this.$route.query;
      return {
        query: query,
        scale: 1,
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
      this.$nextTick(() => {
        this.getWH();
      });
    },
    computed: {
      currentChooseImg () {
        return JSON.parse(this.$store.getters.currentChooseImg);
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
    methods: {
      getWH () { // 计算图片放到框中居中沾满且不改变比例(获取初始attribute)
        let img = document.createElement('img');
        img.setAttribute('crossOrigin', 'Anonymous');
        img.src = this.$CJIMGURL + this.currentChooseImg.url + this.$OSSIMGADJUST;
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
        this.scale = this.imgScale; // 放大截图，增加清晰度
        this.$nextTick(() => {
          html2canvas(this.$refs.imgWrapper, {useCORS: true}).then(canvas => {
            this.startCreate = false;
            this.loadingModal = false;
            this.scale = 1;
            let saveUrl = canvas.toDataURL('image/png');
            changeTemplateImg({
              'base64String': saveUrl,
              'height': this.templateHeight * this.imgScale,
              'templateImageId': this.$route.query.templateImageId,
              'width': this.templateWidth * this.imgScale
            }).then(res => {
              let data = res.data;
              if (data.code == 0) {
                let reData = data.data;
                let c = Object.assign({}, this.currentChooseImg, {url: reData.url});
                this.$store.dispatch('passTemplate', JSON.stringify(c));
                this.$router.replace({path: 'frameTemplate', query: this.query});
              } else {
                this.$message.error(data.message);
              }
            });
            // 点击生成图片并自动下载方法：
            // let a = document.createElement('a');
            // document.body.appendChild(a);
            // a.href = saveUrl;
            // a.download = '这是图片标题';
            // a.click();
          });
        });
      }
    },
    components: {
      makeBody,
      imgBorder
    }
  };
</script>
<style scoped lang='less'>
  @import '~@/style/mixin';
  [name = 'imgAdjust']{
    .imgArea{
      overflow: auto;
      padding: 80px 30px;
      .fac();
      .imgWrapper{
        position: relative;
        .bb, .bt, .br, .bl{
          z-index: 9999;
          position: absolute;
        }
        .bl, .br{
          width: 2px;
          background-color: #FF0000;
          top: -2px;
        }
        .bb, .bt{
          height: 2px;
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
