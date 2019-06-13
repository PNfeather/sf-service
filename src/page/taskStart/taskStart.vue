<template>
  <div name='taskStart'>
    <titleBack title="返回任务列表" customBack @back="backTaskList"></titleBack>
  </div>
</template>

<script type='text/babel'>
  import titleBack from '@C/titleBack.vue';
  export default {
    name: 'taskStart',
    props: {
      key: {
        type: String,
        default: ''
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
      backTaskList () {
        this.$router.push('missionList');
      }
    },
    components: {
      titleBack
    }
  };
</script>
<style scoped lang="less">
  [name = 'taskStart']{}
</style>
