<template>
  <div name='imgAdjust' class="fillcontain">
    <headTop></headTop>
    <makeBody>
      <div class="imgArea">
        <div class="imgWrapper" ref="imgWrapper">
          <imgBorder>
            <img ref="dealImg" :src="currentEditTemplate.url" :style="{width: imgWidth,height: imgHeight, top: imgTop + 'px', left: imgLeft + 'px'}" alt="">
          </imgBorder>
        </div>
      </div>
    </makeBody>
  </div>
</template>

<script type='text/babel'>
  import makeBody from './components/makeBody';
  import imgBorder from './components/imgBorder';
  import {getCss} from './js';
  export default {
    name: 'imgAdjust',
    data () {
      return {
        imgWidth: '',
        imgHeight: '',
        imgTop: 0,
        imgLeft: 0
      };
    },
    created () {},
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
      getWH () { // 计算图片放到框中居中沾满且不改变比例
        let img = document.createElement('img');
        img.src = this.currentEditTemplate.url;
        img.onload = () => {
          let wrapper = this.$refs.imgWrapper;
          let imgWHPer = img.width / img.height;
          let wwNum = parseFloat(getCss(wrapper, 'width'));
          let whNum = parseFloat(getCss(wrapper, 'height'));
          let wrapperWHPer = wwNum / whNum;
          let posCenter = () => {
            this.$nextTick(() => {
              let dealImg = this.$refs.dealImg;
              if (this.imgWidth === '100%') {
                this.imgWidth = getCss(dealImg, 'width');
                let hNum = parseFloat(getCss(dealImg, 'height'));
                this.imgTop = parseInt(whNum / 2 - hNum / 2);
              } else {
                this.imgHeight = getCss(dealImg, 'height');
                let wNum = parseFloat(getCss(dealImg, 'width'));
                this.imgLeft = parseInt(wwNum / 2 - wNum / 2);
              }
            });
          };
          if (imgWHPer > wrapperWHPer) {
            this.imgWidth = '100%';
            this.imgHeight = 'auto';
          } else {
            this.imgWidth = 'auto';
            this.imgHeight = '100%';
          }
          posCenter();
        };
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
        border: 2px solid #FF0000;
        .wh(546px, 729px);
        position: relative;
        img{
          .wh(100%, 100%)
        }
      }
    }
  }
</style>
