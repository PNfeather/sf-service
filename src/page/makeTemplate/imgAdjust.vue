<template>
  <div name='imgAdjust' class='fillcontain'>
    <headTop></headTop>
    <makeBody @finish='submit'>
      <section class='imgArea fillcontain' :style="{minWidth: templateWidth + 250 + 'px'}" @mousemove='change' @mouseup='end'>
        <article class="changeImgBtn">
          <a-button @click="changeImg('fromSource')">从资源库替换</a-button>
          <a-upload
            name="file"
            accept="image/*"
            class="taskStart-upload"
            :showUploadList='false'
            :customRequest="customRequest">
            <a-button class="uploadBtn" @click="changeImg('fromLocal')">从本地替换</a-button>
          </a-upload>
        </article>
        <article class='imgWrapper' ref='imgWrapper' :style="{transform: 'scale(' + scale +  ',' + scale + ')', width: templateWidth + 'px', minWidth: templateWidth + 'px', height: templateHeight + 'px'}">
          <section v-show="!startCreate">
            <div class='bt' :style="{width: templateWidth + 4 + 'px'}"></div>
            <div class='bb' :style="{width: templateWidth + 4 + 'px'}"></div>
            <div class='bl' :style="{height: templateHeight + 4 + 'px'}"></div>
            <div class='br' :style="{height: templateHeight + 4 + 'px'}"></div>
          </section>
          <section class="firstCanvas" v-show="!firstCanvasFinished">
            <imgBorder ref="imgRotate" :attribute='attribute' onlyRotate :imgUrl="`${$CJIMGURL + pageImgUrl + $OSSIMGADJUST}`"></imgBorder>
            <imgBorder ref="imgFrame" :attribute='attribute' onlyFrame :imgUrl="`${$CJIMGURL + pageImgUrl + $OSSIMGADJUST}`"></imgBorder>
          </section>
          <section class="secondCanvas" :style="{'left': attribute.left + 'px', 'top': attribute.top + 'px', 'width': attribute.width + 'px', 'height': attribute.height + 'px'}" v-show="firstCanvasFinished">
            <img :src="firstUrl" alt="">
          </section>
        </article>
      </section>
    </makeBody>
    <fc-loading :loading-modal.sync='loadingModal' text='图片生成中'></fc-loading>
  </div>
</template>

<script type='text/babel'>
  import makeBody from './components/makeBody';
  import imgBorder from './components/imgBorder';
  import {getCss} from './js';
  import html2canvas from 'html2canvas';
  import {changeTemplateImg} from '@/api/uploadImgTemplate';
  import {fileUpload} from '@/api/fileUpload';
  export default {
    name: 'imgAdjust',
    data () {
      let query = this.$route.query;
      return {
        query: query,
        scale: 1,
        attribute: {
          width: () => {
            return this.templateWidth;
          },
          height: () => {
            return this.templateHeight;
          },
          left: 0,
          top: 0
        },
        startCreate: false, // 与加载弹框控制变量不能使用同一个，生成图片过程不能手动关闭该开关。
        loadingModal: false,
        firstCanvasFinished: false,
        firstUrl: '',
        pageImgUrl: ''
      };
    },
    mounted () {
      this.pageImgUrl = this.currentChooseImg.url;
      this.$nextTick(() => {
        this.getWH(this.$CJIMGURL + this.pageImgUrl + this.$OSSIMGADJUST, () => {
          this.$nextTick(() => {
            if (this.query.autoFrame) {
              delete this.query.autoFrame;
              this.submit();
            }
          });
        });
      });
    },
    computed: {
      currentChooseImg () {
        return JSON.parse(this.$store.getters.currentChooseImg);
      },
      templateHeight () {
        return this.$store.getters.templateHeight;
      },
      templateWidth () {
        return this.$store.getters.templateWidth;
      },
      imgScale () {
        return this.$store.getters.imgScale;
      }
    },
    methods: {
      getWH (url, callback) { // 计算图片放到框中居中沾满且不改变比例(获取初始attribute)
        let img = document.createElement('img');
        img.setAttribute('crossOrigin', 'Anonymous');
        img.src = url;
        img.onload = () => {
          let wrapper = this.$refs.imgWrapper;
          let imgWHPer = img.width / img.height;
          let wwNum = parseFloat(getCss(wrapper, 'width'));
          let whNum = parseFloat(getCss(wrapper, 'height'));
          let wrapperWHPer = wwNum / whNum;
          let posCenter = (tooWidth) => {
            this.$nextTick(() => {
              if (tooWidth) {
                this.$set(this.attribute, 'width', wwNum);
                this.$set(this.attribute, 'height', wwNum / imgWHPer);
                this.$set(this.attribute, 'top', whNum / 2 - this.attribute.height / 2);
              } else {
                this.$set(this.attribute, 'height', whNum);
                this.$set(this.attribute, 'width', whNum * imgWHPer);
                this.$set(this.attribute, 'left', wwNum / 2 - this.attribute.width / 2);
              }
              if (callback) callback();
            });
          };
          posCenter(imgWHPer > wrapperWHPer);
        };
      },
      resetImg () { // 重置图片的调整
        this.getWH(this.$CJIMGURL + this.currentChooseImg.url + this.$OSSIMGADJUST);
        this.$nextTick(() => {
          this.$refs.imgFrame.resetFrame();
          this.$refs.imgRotate.resetRotate();
        });
      },
      changeImg (type) {
        if (type === 'fromSource') {
          this.$router.push({path: 'resourcePick', query: { pageType: 'resourceChoiceList', fromName: '图片调整', choiceType: 'radio', dataType: 'fullData', backNum: '2' }});
        }
      },
      customRequest (data) { // 自定义上传事件
        const {file} = data;
        fileUpload({'file': file}).then(res => {
          if (res.data.code == 0) {
            this.pageImgUrl = res.data.data.url;
            this.resetImg();
          } else {
            this.$message.error(res.data.message);
          }
        });
      },
      change (e) {
        this.$refs.imgFrame.change(e);
        this.$refs.imgRotate.rotateChange(e);
      },
      end (e) {
        this.$refs.imgFrame.end(e);
        this.$refs.imgRotate.rotateEnd(e);
      },
      submit () {
        this.loadingModal = true;
        this.$refs.imgFrame.submit((url) => {
          this.firstCanvasFinished = true;
          this.getWH(url, () => {
            this.firstUrl = url; // 第一次截图完成获取路径
            this.$nextTick(() => {
              const DPR = window.devicePixelRatio; // 设备像素比
              this.startCreate = true;
              this.scale = this.imgScale / DPR; // 放大截图，增加清晰度
              this.$nextTick(() => {
                html2canvas(this.$refs.imgWrapper, {useCORS: true}).then(canvas => {
                  this.startCreate = false;
                  this.scale = 1;
                  let saveUrl = canvas.toDataURL('image/png');
                  changeTemplateImg({
                    'base64String': saveUrl,
                    'height': this.templateHeight * this.imgScale,
                    'templateImageId': this.$route.query.templateImageId,
                    'width': this.templateWidth * this.imgScale
                  }).then(res => {
                    let data = res.data;
                    this.loadingModal = false;
                    if (data.code == 0) {
                      let reData = data.data;
                      let c = Object.assign({}, this.currentChooseImg, {url: reData.url});
                      this.$store.dispatch('passTemplate', JSON.stringify(c));
                      this.$router.replace({path: 'frameTemplate', query: this.query});
                    } else {
                      this.$message.error(data.message);
                    }
                  });
                  // 点击生成图片并自动下载方法：
                  // let a = document.createElement('a');
                  // document.body.appendChild(a);
                  // a.href = saveUrl;
                  // a.download = '这是图片标题';
                  // a.click();
                });
              });
            });
          });
        });
      }
    },
    components: {
      makeBody,
      imgBorder
    }
  };
</script>
<style lang="less">
  [name = 'imgAdjust']{
    .taskStart-upload {
      width: 100%;
      .ant-upload{
        width: 100%;
        .uploadBtn {
          width: 100%;
        }
      }
    }
  }
</style>
<style scoped lang='less'>
  @import '~@/style/mixin';
  [name = 'imgAdjust']{
    .imgArea{
      overflow: auto;
      display: flex;
      justify-content: flex-start;
      padding: 30px 50px 90px 165px;
      position: relative;
      .changeImgBtn{
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 120px;
        height: 80px;
        left: 30px;
        top: 80px;
        z-index: 999;
      }
      .imgWrapper{
        position: relative;
        .secondCanvas{
          position: absolute;
          img{
            width: 100%;
            height: auto;
          }
        }
        .bb, .bt, .br, .bl{
          z-index: 9999;
          position: absolute;
        }
        .bl, .br{
          width: 2px;
          background-color: #FF0000;
          top: -2px;
        }
        .bb, .bt{
          height: 2px;
          background-color: #FF0000;
          left: -2px;
        }
        .bl{
          left: -2px;
        }
        .br{
          right: -2px;
        }
        .bb{
          bottom: -2px;
        }
        .bt{
          top: -2px;
        }
      }
    }
  }
</style>
