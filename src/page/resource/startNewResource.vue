<template>
  <div name='startNewResource' class="fillcontain">
    <titleBack class="backTitle" title="返回资源库"></titleBack>
    <section class="newResourceBody">
      <div class="wrapper">
        <div class="subTitle">新增资源</div>
        <div class="nameInput">
          <span>资源名称:</span>
          <a-input v-model="templateName" class="input" placeholder="请输入资源名称"/>
        </div>
        <div class="uploadCover">
          <a-upload
            name="file"
            accept="image/*"
            class="uploadCover-upload"
            :showUploadList='false'
            :beforeUpload="beforeUpload">
            <div class="image-text">
              <div class="cross"></div>
              <p class="text">添加上传文件</p>
            </div>
          </a-upload>
          <div class="closeBtn" v-show="coverImg" @click="reMoveImg">
            <i class="iconfont iconClossAcross"></i>
          </div>
          <img class="coverImg" v-if="coverImg" :src="`${$CJIMGURL + coverImg + $OSSIMGADJUST}`" alt="">
        </div>
        <div class="nextBtn">
          <a-button type="primary" class="newResourceBtn" @click="startUpload" :disabled="nextToggle">下一步</a-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script type='text/babel'>
  import {createBook} from '@/api/tBook';
  import {fileUpload} from '@/api/fileUpload';
  import titleBack from '@C/titleBack';
  export default {
    name: 'startNewResource',
    data () {
      return {
        templateName: '',
        coverImg: '',
        file: null
      };
    },
    created () {},
    mounted () {},
    computed: {
      nextToggle () {
        return (this.templateName == '' || this.coverImg == '');
      }
    },
    watch: {},
    methods: {
      beforeUpload (info) { // 只导入
        this.file = info;
        fileUpload({'file': this.file}).then(res => {
          if (res.data.code == 0) {
            this.coverImg = res.data.data.url;
          } else {
            this.$message.error(res.data.message);
          }
        });
        return false;
      },
      reMoveImg () {
        this.coverImg = '';
      },
      startUpload () {
        createBook({
          coverUrl: this.coverImg,
          name: this.templateName
        }).then(resIn => {
          if (resIn.data.code == 0) {
            this.$router.push({path: 'taskStart', query: {pageType: 'resourceMakeStart', workId: resIn.data.data.id}});
          } else {
            this.$message.error(resIn.data.message);
          }
        });
      }
    },
    components: {
      titleBack
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'startNewResource']{
    display: flex;
    flex-direction: column;
    .newResourceBody{
      flex: 1;
      overflow: auto;
      .wrapper{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px;
        .subTitle{
          .wh(100%, 30px);
          text-align: left;
          line-height: 30px;
          font-size: 22px;
          color: #333;
        }
        .nameInput{
          .wh(418px, 40px);
          line-height: 40px;
          margin-top: 20px;
          font-size: 16px;
          display: flex;
          align-items: center;
          span{
            flex: 80px 0 0;
          }
          .input{
            flex: 1;
          }
        }
        .uploadCover{
          .wh(423px, 512px);
          position: relative;
          border: 1px solid #CBCBCB;
          border-radius: 4px;
          margin: 20px 0;
          .coverImg{
            .wh(100%, 100%);
            .allcover();
            z-index: 3;
          }
          .closeBtn{
            .wh(50px, 50px);
            position: absolute;
            right: 5px;
            top: 5px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
            .fac();
            z-index: 4;
            .iconfont{
              font-size: 24px;
              color: #fff;
            }
          }
          .uploadCover-upload{
            .wh(100%, 100%);
            .image-text{
              .allcover();
              .wh(100%, 100%);
              .fac();
              color: #CBCBCB;
              flex-direction: column;
              .cross{
                .wh(80px, 80px);
                position: relative;
                &:after{
                  content: '';
                  position: absolute;
                  width: 100%;
                  height: 2px;
                  top: 50%;
                  left: 0;
                  margin-top: -1px;
                  background-color: #cbcbcb;
                }
                &:before{
                  content: '';
                  position: absolute;
                  width: 2px;
                  height: 100%;
                  left: 50%;
                  top: 0;
                  margin-left: -1px;
                  background-color: #cbcbcb;
                }
              }
              .text{
                font-size: 14px;
                color: #999999;
                margin-top: 8px;
              }
            }
          }
        }
        .newResourceBtn{
          border-radius: 4px;
          .wh(240px, 50px);
          .fac();
          margin-top: 18px;
        }
      }
    }
  }
</style>
