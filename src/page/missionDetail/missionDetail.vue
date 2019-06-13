<template>
  <div name='missionDetail'>
    <titleBack title="返回任务列表"></titleBack>
    <missionContent></missionContent>
  </div>
</template>

<script type='text/babel'>
  import titleBack from '@C/titleBack.vue';
  import missionContent from '@C/missionContent.vue';
  export default {
    name: 'missionDetail',
    data () {
      return {
      };
    },
    created () {},
    mounted () {},
    computed: {},
    watch: {},
    methods: {},
    components: {
      titleBack,
      missionContent
    }
  };
</script>
<style scoped lang="less">
  [name = 'missionDetail']{}
</style>
