<template>
  <div name='templatePreview'>
    <a-carousel arrows :afterChange="onChange" ref="carousel">
      <div
        slot="prevArrow" slot-scope="props"
        class="custom-slick-arrow"
        style="left: 40px;zIndex: 1">
        <a-icon type="left" />
      </div>
      <div
        slot="nextArrow" slot-scope="props"
        class="custom-slick-arrow"
        style="right: 40px">
        <a-icon type="right" />
      </div>
      <div class="carouselBody" v-for="(item, index) in imgList" :key="index" :style="{width: templateWidth + 'px', height: templateHeight + 'px'}">
        <div class="wrapper" :style="{width: templateWidth + 'px', height: templateHeight + 'px'}">
          <img :src="$CJIMGURL + item.url + $OSSIMGADJUST" alt="">
          <div class="question"
               v-for="(child, childIndex) in item.questionSigns"
               :key="childIndex"
               :style="{top: child.topPoint / imgScale + 'px', left: child.leftPoint / imgScale + 'px', height: child.height / imgScale + 'px', width: child.width / imgScale + 'px'}"></div>
        </div>
      </div>
    </a-carousel>
  </div>
</template>

<script type='text/babel'>
  export default {
    name: 'templatePreview',
    props: {
      defaultIndex: {
        type: Number,
        default: 0
      },
      imgList: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data () {
      return {
        currentIndex: 0
      };
    },
    computed: {
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
    mounted () {
      this.goIndex(this.defaultIndex);
    },
    watch: {
      currentIndex (val) {
        this.$nextTick(() => {
          this.$emit('input', val + 1 + '/' + this.imgList.length);
        });
      }
    },
    methods: {
      goIndex (index) {
        this.currentIndex = index;
        this.$refs.carousel.goTo(index, true);
      },
      onChange (index) {
        this.currentIndex = index;
      }
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'templatePreview']{
    position: relative;
    .custom-slick-arrow {
      position: fixed!important;
      border-radius: 100%;
      width: 50px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 22px;
      color: #fff;
      background-color: rgba(0, 0, 0, .3);
    }
    .custom-slick-arrow:before {
      display: none;
    }
    .custom-slick-arrow:hover {
      color: #23BEFF;
      background-color: rgba(0, 0, 0, .5);
    }
    .carouselBody{
      .wrapper{
        position: relative;
        margin: 0 auto;
        img{
          .wh(100%, 100%)
        }
        .question{
          position: absolute;
          border: 1px solid #1690FF;
        }
      }
    }
  }
</style>
