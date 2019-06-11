<template>
  <div name='manage'>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
  </div>
</template>

<script type='text/babel'>
  export default {
    mounted () {
      return this.$route.path.replace('/', '');
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'manage']{
  }
</style>
