<template>
  <div name='makeBody' class="fillcontain">
    <div class="wrapper fillcontain">
      <div class="header">
        <div class="backBtn" @click="back">
          <a-icon class="icon" type="left" />返回模板列表
        </div>
        <div class="title" :class="{stepTwo: !isStepOne}">
          <div class="firstStep"><i class="iconfont iconFinished" v-show="!isStepOne"></i><span v-show="isStepOne">1</span>图片调整</div>
          <div class="line" ></div>
          <div class="secondStep"><span>2</span>框定题目区</div>
        </div>
        <div class="btnGroup">
          <a-button v-show="isStepOne" class="btn" type="primary" @click="nextStep">下一步</a-button>
          <a-button v-show="!isStepOne" class="btn" @click="lastStep">上一步</a-button>
          <a-button v-show="!isStepOne" class="btn" type="primary" @click="finish">完成</a-button>
        </div>
      </div>
      <div class="workArea">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script type='text/babel'>
  export default {
    name: 'makeBody',
    props: {
      isStepOne: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
      };
    },
    created () {},
    mounted () {},
    computed: {},
    watch: {},
    methods: {
      back () {
        this.$router.go(-1);
      },
      nextStep () {
        this.$router.replace('frameTemplate');
      },
      lastStep () {
        this.$router.replace('imgAdjust');
      },
      finish () {
        this.$emit('finish');
      }
    },
    components: {}
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'makeBody']{
    padding: 90px 20px 30px;
    background-color: #f0f2f5;
    .wrapper{
      background: #FFFFFF;
      box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
      border-radius: 2px;
      position: relative;
      padding-top: 60px;
      .header{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 60px;
        display: flex;
        padding: 0 30px;
        border-bottom: 1px solid #EBEBEB;
        .backBtn{
          flex: 240px 0 0;
          height: 100%;
          color: #999999;
          .fj(flex-start);
          .icon{
            font-size: 20px;
            margin-right: 10px;
          }
        }
        .stepTwo{
          .firstStep{
            color: #ccc!important;
          }
          .line{
            background-color: #1690FF!important;
          }
          .secondStep{
            color: #1690FF!important;
            span{
              background-color: #1690FF!important;
            }
          }
        }
        .title{
          flex: 1;
          .fac();
          .firstStep, .secondStep{
            .fac();
            span{
              margin-right: 3px;
              display: inline-block;
              text-align: center;
              .wh(17px, 17px);
              line-height: 17px;
              font-size: 12px;
              border-radius: 17px;
              color: #fff;
            }
          }
          .firstStep{
            color: #1690FF;
            .iconFinished{
              font-size: 23px;
              color: #ccc;
            }
            span{
              background-color: #1690FF;
            }
          }
          .line{
            .wh(50px, 1px);
            background-color: #ccc;
            margin: 0 6px;
          }
          .secondStep{
            color: #ccc;
            span{
              background-color: #ccc;
            }
          }
        }
        .btnGroup{
          flex: 240px 0 0;
          .fj(flex-end);
          .btn{
            margin-left: 10px;
            width: 96px;
          }
        }
      }
      .workArea{
        .wh(100%, 100%);
        overflow: auto;
      }
    }
  }
</style>
