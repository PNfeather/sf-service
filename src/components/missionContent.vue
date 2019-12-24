<template>
  <div name='missionContent'>
    <section class="introduce">
      <article class="top">
        <span class="teacher">布置教师：{{assignTeacherName}}</span>
        <span class="startTime">布置时间：{{assignTime}}</span>
        <span class="endTime">截止时间：{{endTime}}</span>
      </article>
      <article class="down">
        <span class="school">学校：{{schoolName}}</span>
        <span class="classes">班级：{{className}}</span>
      </article>
    </section>
    <section class="workContent">
      <section class="workList">
        <section class="workItem" v-for="(item, index) in workList" :key="item.id || index">
          <div class="sectionTitle">·{{item.type == 1 ? item.remark : '拍照作业'}}</div>
          <section class="works">
            <div class="work" :style="{height: item.type == 1 ? '274px' : '224px'}" v-for="(work, workIndex) in (item.type == 1 ? item.templatePages : item.combineTemplate)" :key="work.id || workIndex">
              <div v-if="item.type == 2 && work.fromStatus != 1" class="delete" @click.stop="deleteTemplate(work)">
                <i class="iconfont iconClose"></i>
              </div>
              <div class="shade" v-if="item.type == 1"></div>
              <div class="img" @click="goMake(work, item.type)">
                <img crossOrigin="anonymous" v-imgLazy='`${$CJIMGURL + work.url + $OSSIMGADJUSTMINI}`' alt="">
              </div>
              <p v-if="item.type == 1"><span>第{{work.pageNo}}</span>页</p>
            </div>
          </section>
        </section>
      </section>
      <section class="textOrVoice" v-if="txtMessage || voiceMessages.length">
        <section class="sectionTitle">作业备注</section><hr/>
        <section class="voice" v-for="(item, index) in voiceMessages" :key="item.id || index">
          <div class="item" :class="{active: item.audioPlaying}" @click="playAudio(item, index)">
            <i class="iconfont iconVoice"></i>{{item.duration}}s
            <span style="flex: 1; text-align: right" v-show="item.currentTime > 0 && (item.currentTime != item.duration)">{{item.currentTime}}s</span>
            <audio :ref='`voice${index}`' :src="`${$CJIMGURL + item.url}`" preload>
              您的浏览器不支持audio标签
            </audio>
          </div>
        </section>
        <section class="missionDetail" v-html="txtMessage"></section>
      </section>
    </section>
  </div>
</template>

<script type='text/babel'>
  import {deleteTemplateImg} from '@/api/uploadImgTemplate';
  import {deleteTemplatePage} from '@/api/tPage';
  import {workDetail} from '@/api/works';
  import format from '@/tools/format';
  import debounce from '@/tools/debounce';
  export default {
    name: 'missionContent',
    props: {
      workId: {
        type: [String, Number],
        default: '',
        required: true
      }
    },
    data () {
      const {query} = this.$route;
      return {
        isCheck: query.pageType === 'check', // 查看作业
        detailName: '',
        assignTeacherName: '',
        assignTime: '',
        endTime: '',
        schoolName: '',
        className: '',
        txtMessage: '',
        voiceMessages: [],
        workList: [],
        maxSerialNumber: 1
      };
    },
    created () {
      this.pageInit();
    },
    methods: {
      deleteTemplate (item) {
        if (item.finished) {
          deleteTemplatePage({id: item.id}).then(res => {
            let data = res.data;
            if (data.code == 0) {
              this.pageInit();
            } else {
              this.$message.error(data.message);
            }
          });
        } else {
          deleteTemplateImg({id: item.id}).then(res => {
            let data = res.data;
            if (data.code == 0) {
              this.pageInit();
            } else {
              this.$message.error(data.message);
            }
          });
        }
      },
      goMake (item, type) {
        if (type == 1) {
          return this.$message.warn('教师导入模板不可编辑');
        }
        let query;
        let defaultTemplateSortNum = item.serialNumber || (this.maxSerialNumber + 1); // 若当前模板自带序号，模板制作序号为本身序号，否则最大序号+1
        if (item.finished) { // 已完成模板
          this.$store.dispatch('passTemplate', JSON.stringify(item));
          query = {templatePageId: item.id}; // 模板页ID（存在则在模板制作时需要初始渲染，最后是更新）
          this.$router.push({path: 'frameTemplate', query: query});
        } else { // 导入图片模板
          this.$store.dispatch('passChooseImg', JSON.stringify(item));
          query = {templateImageId: item.id, autoFrame: 'true'}; // 模板图片ID
          Object.assign(query, {workId: this.workId, pageType: 'missionTemplate'}); // 作业进来传作业ID,pageType当前是作业制作而非资源制作
          this.$router.push({path: 'imgAdjust', query: query});
        }
        this.$store.dispatch('changeDefaultTemplateSortNum', defaultTemplateSortNum);
      },
      pageInit () {
        debounce(() => {
          this.audioPlaying = false;
          this.currentTime = 0;
          workDetail(this.workId).then(res => {
            let data = res.data;
            if (data.code == 0) {
              let reData = data.data;
              let time = reData.assignTime && format(new Date(reData.assignTime), 'MM月DD日');
              if (time[0] == 0) {
                time = time.substr(1);
              }
              this.txtMessage = reData.txtMessage && reData.txtMessage.replace(/\n/g, '<br/>').replace(/\t/g, '　　');
              this.assignTime = reData.assignTime && format(new Date(reData.assignTime), 'YYYY年MM月DD日 HH:mm');
              this.endTime = reData.endTime && format(new Date(reData.endTime), 'YYYY年MM月DD日 HH:mm');
              this.detailName = time + reData.name;
              this.assignTeacherName = reData.assignTeacherName;
              this.className = reData.className;
              this.schoolName = reData.schoolName;
              this.workList = [...reData.workItems.map(item => { // 对模板进行排序，并找出最大序号存储
                if (item.type == 1) {
                  item.templatePages.sort((a, b) => a.serialNumber - b.serialNumber).forEach(c => {
                    c.serialNumber > this.maxSerialNumber && (this.maxSerialNumber = c.serialNumber);
                  });
                } else if (item.type == 2) {
                  item.combineTemplate = [...item.templatePages.map(c => {
                    c.finished = true;
                    return c;
                  }), ...item.templateImages].sort((a, b) => a.serialNumber - b.serialNumber);
                  item.combineTemplate.forEach(c => {
                    c.serialNumber > this.maxSerialNumber && (this.maxSerialNumber = c.serialNumber);
                  });
                  if (!item.templateImages.length) {
                    this.$emit('changeSubmit');
                  }
                }
                return item;
              })];
              console.log(this.maxSerialNumber);
              this.$emit('input', this.detailName);
              this.voiceMessages = [...reData.voiceRemarks.map((item) => {
                item.audioPlaying = false;
                return item;
              })];
              this.$nextTick(() => {
                for (let i = 0; i < this.voiceMessages.length; i++) {
                  let audio = this.$refs['voice' + i][0];
                  audio.addEventListener('timeupdate', () => {
                    this.$set(this.voiceMessages[i], 'currentTime', Math.ceil(audio.currentTime));
                  });
                  audio.addEventListener('loadeddata', () => {
                    this.$set(this.voiceMessages[i], 'duration', Math.ceil(audio.duration));
                  });
                  audio.addEventListener('ended', () => {
                    this.$set(this.voiceMessages[i], 'audioPlaying', false);
                  });
                }
              });
            } else {
              this.$message.error(data.message);
            }
          });
        });
      },
      playAudio (item, index) {
        let audio = this.$refs['voice' + index][0];
        if (audio.paused) {
          this.$set(item, 'audioPlaying', true);
          this.pause();
          audio.play(); // audio.play();// 这个就是播放
        } else {
          this.pause();
        }
      },
      pause () {
        for (let i = 0; i < this.voiceMessages.length; i++) {
          let audio = this.$refs['voice' + i][0];
          audio.currentTime = 0;
          this.$set(this.voiceMessages[i], 'audioPlaying', false);
          audio.pause(); // 暂停播放
        }
      }
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'missionContent']{
    padding: 30px;
    .introduce{
      line-height: 30px;
      text-align: left;
      border: 1px solid #999;
      padding: 15px;
      .teacher, .school{
        margin: 0!important;
      }
      .teacher, .startTime, .endTime, .school, .classes{
        margin-left: 30px;
        font-size: 16px;
        color: #999999;
      }
    }
    .workContent{
      .workList{
        .workItem{
          margin-top: 15px;
          .sectionTitle{
            font-size: 22px;
            color: #333333;
          }
          .works{
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            .work{
              margin:0 18px 20px 0;
              flex: 190px 0 0;
              display: flex;
              flex-direction: column;
              border: 1px solid #E3EBF1;
              border-radius: 4px;
              overflow: hidden;
              position: relative;
              .shade{
                .wh(100%, 224px);
                position: absolute;
                left: 0;
                top: 0;
                background: rgba(0, 0, 0, 0.6);
              }
              .delete{
                position: absolute;
                top: 5px;
                right: 5px;
                z-index: 3;
                .wh(26px, 26px);
                .fac();
                border-radius: 100%;
                &:after{
                  content: '';
                  position: absolute;
                  top: 2px;
                  left: 2px;
                  .wh(22px, 22px);
                  background-color: #fff;
                  border-radius: 100%;
                  z-index: 1;
                }
                .iconfont{
                  position: relative;
                  z-index: 2;
                  font-size: 26px;
                  color: #E46948;
                }
              }
              .img{
                height: 224px;
                width: 100%;
                img{
                  .wh(100%, 100%);
                }
              }
              p{
                height: 50px;
                line-height: 50px;
                text-align: center;
                font-size: 16px;
                color: #333333;
              }
            }
          }
        }
      }
      .textOrVoice{
        margin-top: 15px;
        .sectionTitle{
          font-size: 22px;
          color: #333333;
        }
        .missionDetail{
          margin-top: 5px;
          width: 8.27rem;
          word-break: break-all;
        }
        .voice{
          .active{
            .iconfont{
              animation: scaleDraw 2s infinite;
            }
          }
          .item{
            margin-top: 10px;
            padding: 0 10px;
            .wh(150px, 40px);
            .fj(flex-start);
            background: rgba(247,199,10,0.30);
            border: 1px solid rgba(247,199,10,0.50);
            border-radius: 4px;
            color: #F7BA0A;
            font-size: 14px;
            .iconfont{
              color: #F7BA0A;
              font-size: 18px;
              margin-right: 10px;
            }
          }
        }
      }
    }
    /*.small-scale-enter-active {*/
      /*transition: all .5s;*/
    /*}*/
    /*.small-scale-enter, .small-scale-leave-active {*/
      /*transform: translateY(-50px);*/
      /*opacity: 0;*/
    /*}*/
    /*.big-scale-enter-active{*/
      /*transition: all .5s;*/
    /*}*/
    /*.big-scale-enter, .big-scale-leave-active {*/
      /*transform: translateY(50px);*/
      /*opacity: 0;*/
    /*}*/
    @keyframes scaleDraw {  /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
      0%{
        transform: scale(1);  /*开始为原始大小*/
      }
      25%{
        transform: scale(1.4); /*放大1.1倍*/
      }
      50%{
        transform: scale(1);
      }
      75%{
        transform: scale(1.4);
      }
    }
  }
</style>
