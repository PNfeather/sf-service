<template>
  <div name='missionContent'>
    <section class="introduce">
      <span class="missionName">今日化学作业</span>
      <span class="teacher">布置教师：某某</span>
      <span class="startTime">布置时间：0000年00月00日 00：00</span>
      <span class="endTime">截止时间：0000年00月00日 00：00</span>
    </section>
    <section class="smallImg" v-show="!showBig">
      <div class="imgItem" v-for="(item, index) in imgList" :key="item">
        <img src="~@IMG/loginBack.png" alt="" @click="openBig(index)">
      </div>
    </section>
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
          <div class="imgItem" v-for="item in imgList" :key="item">
            <img src="~@IMG/loginBack.png" alt="">
          </div>
        </a-carousel>
      </section>
    </transition>
    <section class="missionDetail">
      1、指所从事的工作、业务。
      《管子·轻重丁》：行令半岁，万民闻之，舍其作业，而为囷京以藏菽粟五谷者过半。
      《史记·高祖本纪》：常有大度，不事家人生产作业。
      宋司马光《与吴丞相书》：人无贫富，咸失作业。
      2、劳动；从事生产工作。 或一次操作步骤的完成。
      汉班固《东观汉记·魏霸传》：为将作大匠，吏皆怀恩，人自竭节作业。
      郭沫若《创造十年》五：船愈朝前进，水愈见混浊，天空愈见昏朦起来。杨树浦一带的工厂中的作业声，煤烟，汽笛，起重机，香烟广告……中世纪的风景画，一转瞬间便改变成为未来派。
      3、为完成生产、学习、军事训练等任务而布置的活动。
      孙犁《秀露集·关于编辑和投稿》：在学校作文，是作业，可以模拟他人。
      4、谓从事这种活动。例：高空带电作业。
      5、作孽，造孽。业，罪孽。
      唐吕岩《绝句》之二五：起来旋点黄金买，不使人间作业钱。
      宋鲁应龙《闲窗括异志》：汝何作业造罪，货卖假香？
      《封神演义》第八四回：分明是你自己作业，致生杀伐。 Ώ]
    </section>
    <section class="voice">
      <div class="item" :class="{active: audioPlaying}" @click="playAudio">
        <i class="iconfont iconVoice"></i>{{duration}}s
        <span style="flex: 1; text-align: right" v-show="currentTime > 0 && (currentTime != duration)">{{currentTime}}s</span>
        <audio ref="voice" :src="testMp3" preload>
          您的浏览器不支持audio标签
        </audio>
      </div>
    </section>
  </div>
</template>

<script type='text/babel'>
  export default {
    name: 'missionContent',
    props: {
      workId: {
        type: String || Number,
        default: '',
        required: true
      }
    },
    data () {
      return {
        testMp3: require('@/assets/mp3/test.mp3'),
        duration: 0,
        audioPlaying: false,
        showBig: false,
        currentTime: 0,
        imgList: new Array(6)
      };
    },
    activated () {
      this.audioPlaying = false;
      this.currentTime = 0;
    },
    methods: {
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
      playAudio () {
        let audio = this.$refs.voice;
        audio.currentTime = 0;
        if (audio.paused) {
          this.audioPlaying = true;
          audio.play(); // audio.play();// 这个就是播放
        } else {
          this.pause();
        }
      },
      pause () {
        let audio = this.$refs.voice;
        this.audioPlaying = false;
        audio.pause(); // 暂停播放
      }
    },
    watch: {
      currentTime (val) {
        console.log(val);
      }
    },
    mounted () {
      this.$nextTick(() => {
        let audio = this.$refs.voice;
        audio.addEventListener('timeupdate', () => {
          this.currentTime = Math.ceil(audio.currentTime);
        });
        audio.addEventListener('loadeddata', () => {
          this.duration = Math.ceil(audio.duration);
        });
        audio.addEventListener('ended', () => {
          this.audioPlaying = false;
        });
      });
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'missionContent']{
    padding: 30px;
    .introduce{
      height: 30px;
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
    .big-scale-enter-active, .big-scale-leave-active {
      transition: all 1s;
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
