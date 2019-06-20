<template>
  <div name='missionContent'>
    <section class="introduce">
      <span class="missionName">{{detailName}}</span>
      <span class="teacher">布置教师：{{assignTeacherName}}</span>
      <span class="startTime">布置时间：{{assignTime}}</span>
      <span class="endTime">截止时间：{{endTime}}</span>
    </section>
    <transition name="small-scale" mode="in-out">
      <section class="smallImg" v-show="!showBig">
        <div class="imgItem" v-for="(item, index) in imgList" :key="index">
          <img :src="item.url" alt="" @click="openBig(index)">
        </div>
      </section>
    </transition>
    <transition name="big-scale" mode="in-out">
      <section class="bigImg" v-show="showBig">
        <div class="close" @click="showSmall">
          <i class="iconfont iconShrink"></i>
        </div>
        <a-carousel arrows :afterChange="onChange" ref="carousel">
          <div
            slot="prevArrow" slot-scope="props"
            class="custom-slick-arrow"
            style="left: 10px;zIndex: 1">
            <a-icon type="left" />
          </div>
          <div
            slot="nextArrow" slot-scope="props"
            class="custom-slick-arrow"
            style="right: 10px">
            <a-icon type="right" />
          </div>
          <div class="imgItem" v-for="(item, index) in imgList" :key="index">
            <img :src="item.url" alt="">
          </div>
        </a-carousel>
      </section>
    </transition>
    <section class="missionDetail">
      {{txtMessage}}
    </section>
    <section class="voice" v-for="(item, index) in voiceMessages" :key="index">
      <div class="item" :class="{active: item.audioPlaying}" @click="playAudio(item, index)">
        <i class="iconfont iconVoice"></i>{{item.duration}}s
        <span style="flex: 1; text-align: right" v-show="item.currentTime > 0 && (item.currentTime != item.duration)">{{item.currentTime}}s</span>
        <audio :ref='`voice${index}`' :src="item.url" preload>
          您的浏览器不支持audio标签
        </audio>
      </div>
    </section>
  </div>
</template>

<script type='text/babel'>
  import {workDetail} from '@/api/works';
  import format from '@/tools/format';
  import timeLimit from '@/tools/timeLimit';
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
      return {
        detailName: '',
        assignTeacherName: '',
        assignTime: '',
        endTime: '',
        txtMessage: '',
        voiceMessages: [],
        showBig: false,
        imgList: []
      };
    },
    created () {
      this.pageInit();
    },
    methods: {
      pageInit () {
        timeLimit(() => {
          this.audioPlaying = false;
          this.currentTime = 0;
          workDetail(this.workId).then(res => {
            let data = res.data;
            if (data.code == 0) {
              let reData = data.data;
              reData.voiceMessages = [ // todo 待删除
                {
                  url: require('@/assets/mp3/test.mp3')
                }, {
                  url: require('@/assets/mp3/test.mp3')
                }, {
                  url: require('@/assets/mp3/test.mp3')
                }
              ];
              let time = format(new Date(reData.assignTime), 'MM月DD日');
              if (time[0] == 0) {
                time = time.substr(1);
              }
              this.txtMessage = reData.txtMessage;
              this.assignTime = format(new Date(reData.assignTime), 'YYYY年MM月DD日 HH:mm');
              this.endTime = format(new Date(reData.endTime), 'YYYY年MM月DD日 HH:mm');
              this.detailName = time + reData.name;
              this.imgList = [...reData.attachments.map((item) => {
                item.url = this.$store.getters.imgBaseUrl + item.url; // todo 待修改或完善  待确认是否需要前端自行补充为完整路径
                return item;
              })];
              this.voiceMessages = [...reData.voiceMessages.map((item) => {
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
      onChange (index) {
        console.log(index);
      },
      showSmall () {
        this.showBig = false;
      },
      openBig (index) {
        this.$refs.carousel.goTo(index, true);
        this.showBig = true;
      },
      playAudio (item, index) {
        let audio = this.$refs['voice' + index][0];
        audio.currentTime = 0;
        if (audio.paused) {
          this.$set(item, 'audioPlaying', true);
          audio.play(); // audio.play();// 这个就是播放
        } else {
          this.pause();
        }
      },
      pause () {
        for (let i = 0; i < this.voiceMessages.length; i++) {
          let audio = this.$refs['voice' + i][0];
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
      .missionName{
        font-size: 22px;
        color: #333333;
      }
      .teacher, .startTime, .endTime{
        margin-left: 30px;
        font-size: 16px;
        color: #999999;
      }
    }
    .smallImg{
      height: 100px;
      margin: 20px 0;
      .fj(flex-start);
      .imgItem:last-child{
        margin-right: 0;
      }
      .imgItem{
        flex: 15.5% 0 0;
        height: 100%;
        margin-right: 10px;
        img{
          .wh(100%, 100%);
        }
      }
    }
    .bigImg{
      margin: 20px 0;
      .wh(100%, 6.43rem);
      position: relative;
      .close{
        position: absolute;
        right: 20px;
        top: 20px;
        .wh(50px, 50px);
        text-align: center;
        line-height: 50px;
        background-color: rgba(0, 0, 0, .3);
        border-radius: 4px;
        z-index: 1;
        .iconfont{
          color: #fff;
          font-size: 30px;
        }
      }
      .imgItem{
        .wh(100%, 6.43rem);
        img{
          .wh(100%, 100%);
        }
      }
      .custom-slick-arrow {
        border-radius: 100%;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 22px;
        color: #fff;
        background-color: rgba(0, 0, 0, .3);
      }
      .custom-slick-arrow:before {
        display: none;
      }
      .custom-slick-arrow:hover {
        color: #23BEFF;
        background-color: rgba(0, 0, 0, .5);
      }
    }
    .missionDetail{
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
        margin-top: 20px;
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
    .small-scale-enter-active {
      transition: all .5s;
    }
    .small-scale-enter, .small-scale-leave-active {
      transform: translateY(-50px);
      opacity: 0;
    }
    .big-scale-enter-active{
      transition: all .5s;
    }
    .big-scale-enter, .big-scale-leave-active {
      transform: translateY(50px);
      opacity: 0;
    }
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
