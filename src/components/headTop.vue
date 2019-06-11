<template>
  <div name='headTop'>
  </div>
</template>

<script type='text/babel'>
  // import {logout} from '@/api/user';
  export default {
    name: 'headTop',
    data () {
      return {
        defaultImg: require('@IMG/default.jpg')
      };
    },
    methods: {
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'headTop']{
  }
</style>
