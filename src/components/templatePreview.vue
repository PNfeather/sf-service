<template>
  <div name='templatePreview'>
    <a-carousel arrows :afterChange="onChange" ref="carousel">
      <div
        slot="prevArrow" slot-scope="props"
        class="custom-slick-arrow"
        style="left: 10px;zIndex: 1">
        <a-icon type="left" />
      </div>
      <div
        slot="nextArrow" slot-scope="props"
        class="custom-slick-arrow"
        style="right: 10px">
        <a-icon type="right" />
      </div>
      <div class="carouselBody" v-for="(item, index) in imgList" :key="index">
        <div class="wrapper">
          <img :src="$CJIMGURL + item.url" alt="">
          <div class="question"
               v-for="(child, childIndex) in item.questionSigns"
               :key="childIndex"
               :style="{top: child.topPoint + 'px', left: child.leftPoint + 'px', height: child.height + 'px', width: child.width + 'px'}"></div>
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
    watch: {
      defaultIndex (val) {
        this.goIndex(val);
      }
    },
    methods: {
      goIndex (index) {
        this.$refs.carousel.goTo(index, true);
      },
      onChange (index) {
        console.log(index);
      }
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'templatePreview']{
    position: relative;
    .custom-slick-arrow {
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
      .wh(100%, 729px);
      .wrapper{
        position: relative;
        .wh(475px, 729px);
        margin: 0 auto;
        .question{
          position: absolute;
          border: 1px solid #1690FF;
        }
      }
    }
  }
</style>
