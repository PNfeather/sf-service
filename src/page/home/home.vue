<template>
  <div name='home'>
  </div>
</template>

<script type='text/babel'>
  export default {
    name: 'home',
    mounted () {
      this.$router.replace('missionList');
    }
  };
</script>
<style scoped lang="less">
  [name = 'home']{}
</style>
