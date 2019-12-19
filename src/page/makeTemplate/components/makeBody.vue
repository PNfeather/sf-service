<template>
  <div name='makeBody' class="fillcontain">
    <div class="wrapper fillcontain">
      <div class="header">
        <div class="backBtn" @click="back" v-show="!isStepOne">
          <a-icon class="icon" type="left" />返回模板列表
        </div>
        <div class="btnGroup">
          <a-button v-show="isStepOne" class="btn" type="primary" @click="lastStep">取消</a-button>
          <a-button class="btn" type="primary" @click="finish">完成</a-button>
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
      lastStep () {
        this.$emit('last');
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
        padding: 0 30px;
        border-bottom: 1px solid #EBEBEB;
        .backBtn{
          width: 240px;
          height: 100%;
          float: left;
          color: #999999;
          .fj(flex-start);
          .icon{
            font-size: 20px;
            margin-right: 10px;
          }
        }
        .btnGroup{
          width: 240px;
          height: 100%;
          float: right;
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
