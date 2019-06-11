<template>
  <div class="login_page">
    <transition name="form-fade" mode="in-out">
    </transition>
  </div>
</template>

<script type='text/babel'>
  // import {login} from '@/api/user';
  export default {
    name: 'login',
    data () {
      return {
      };
    },
    mounted () {
    },
    methods: {
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  .form-fade-enter-active, .form-fade-leave-active {
    transition: all 1s;
  }
  .form-fade-enter, .form-fade-leave-active {
    transform: translate3d(0, -50px, 0);
    opacity: 0;
  }
</style>
