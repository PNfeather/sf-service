<template>
  <div name='superviseFooter'>
    <div class="text">Copyright © 2007 - {{fullYear}} ecaiedu.com All Rights Reserved.</div>
    <div class="text">
      <a href="http://www.beian.miit.gov.cn/" target="_blank">粤ICP备16110768号</a>
      <a class="img" href="http://szcert.ebs.org.cn/E018B51A-628D-411B-8837-EDB72614F11A" target="_blank">
        <img src="~@IMG/ebs.png" alt="" srcset="">
      </a>
      <a class="img" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030402001944" target="_blank">
        <img src="~@IMG/beian.png" alt="" srcset="">
        粤公网安备44030402001944号
      </a>
    </div>
  </div>
</template>

<script type='text/babel'>
  export default {
    name: 'superviseFooter',
    data () {
      return {
        fullYear: new Date().getFullYear()
      };
    }
  };
</script>
<style scoped lang="less">
  [name = 'superviseFooter']{
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #fff;
    text-align: center;
    .text{
      width: 100%;
      height: 26px;
      display: flex;
      justify-content: center;
      align-items: center;
      .img{
        margin: 0 4px;
      }
      .img:last-child{
        margin-left: 0;
      }
      a{
        color: #fff;
        text-decoration: underline;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
