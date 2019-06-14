<template>
  <div name='frameTemplate' class="fillcontain">
    <headTop></headTop>
    <makeBody :isStepOne="false"></makeBody>
  </div>
</template>

<script type='text/babel'>
  import makeBody from './components/makeBody';
  export default {
    name: 'frameTemplate',
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
    methods: {},
    components: {
      makeBody
    }
  };
</script>
<style scoped lang="less">
  [name = 'frameTemplate']{}
</style>
