<template>
  <a-modal
    v-model="visible"
    centered
    class="fcLoading"
    :footer="null">
    <a-spin :tip="text + '...'"></a-spin>
  </a-modal>
</template>

<script type='text/babel'>
  export default {
    name: 'fcLoading',
    props: {
      loadingModal: {
        type: Boolean,
        default: false
      },
      text: {
        type: String,
        default: '加载中'
      }
    },
    data () {
      return {
        visible: false
      };
    },
    watch: {
      loadingModal (val) {
        this.visible = val;
      },
      visible (val) {
        this.$emit('update:loadingModal', val);
      }
    }
  };
</script>
<style lang="less">
  .fcLoading{
    .ant-modal-body{
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
</style>
