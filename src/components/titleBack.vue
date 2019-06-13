<template>
  <div name='titleBack'>
    <div class="backBtn" @click="back">
      <a-icon class="icon" type="left" />{{title}}
    </div>
  </div>
</template>

<script type='text/babel'>
  export default {
    name: 'titleBack',
    props: {
      title: {
        type: String,
        default: ''
      },
      customBack: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      back () {
        if (this.customBack) {
          this.$emit('back');
        } else {
          this.$router.go(-1);
        }
      }
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'titleBack']{
    padding-left: 30px;
    .fj(flex-start);
    height: 60px;
    border-bottom: 1px solid #EBEBEB;
    font-size: 16px;
    color: #999999;
    letter-spacing: -0.39px;
    text-align: center;
    .backBtn{
      height: 100%;
      .fj(flex-start);
      .icon{
        font-size: 20px;
        margin-right: 10px;
      }
    }
  }
</style>
