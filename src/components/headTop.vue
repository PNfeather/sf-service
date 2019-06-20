<template>
  <section name="headTop">
    <div class="text">
      <div class="title">闪批作业客服系统</div>
      <div class="name">{{userName}}</div>
    </div>
    <a-dropdown class="logout" :trigger="['click']">
      <div>
        <img :src="defaultImg" alt="">
        <a-icon type="down" />
      </div>
      <a-menu slot="overlay">
        <a-menu-item>
          <a href="javascript:;" @click="logout">退出</a>
        </a-menu-item>
        <a-menu-item>
          <a href="javascript:;" @click="changePsw">修改密码</a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-modal
      title="修改密码"
      v-model="visible"
      centered
      @ok="handleOk">
      <a-form
        :form="form"
        class="form fillcontain"
        @submit="handleSubmit">
        <a-form-item
          class="input-item"
          label="旧密码"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
          :validate-status="accountError() ? 'error' : ''"
          :help="accountError() || ''">
          <a-input
            class="input"
            v-decorator="rules.oldPassword"
            type="password"
            placeholder="请输入密码">
          </a-input>
        </a-form-item>
        <a-form-item
          class="input-item"
          label="新密码"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
          :validate-status="accountError() ? 'error' : ''"
          :help="accountError() || ''">
          <a-input
            class="input"
            v-decorator="rules.newPassword"
            type="password"
            placeholder="输入6-20位新密码">
          </a-input>
        </a-form-item>
        <a-form-item
          class="input-item"
          label="确认密码"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
          :validate-status="accountError() ? 'error' : ''"
          :help="accountError() || ''">
          <a-input
            class="input"
            v-decorator="rules.reNewPassword"
            type="password"
            placeholder="再次输入新密码以验证">
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </section>
</template>

<script type='text/babel'>
  import {logout, rePwd} from '@/api/user';
  export default {
    name: 'headTop',
    data () {
      return {
        defaultImg: require('@IMG/default.jpg'),
        visible: false,
        form: this.$form.createForm(this),
        rules: {
          oldPassword: [
            'oldPassword',
            {rules: [{ required: true, message: '请输入旧密码' }]}
          ],
          newPassword: [
            'newPassword',
            {rules: [{ required: true, message: '请输入新密码' }]}
          ],
          reNewPassword: [
            'reNewPassword',
            {rules: [{ required: true, message: '请输入新密码验证' }]}
          ]
        },
        errorTimer: null
      };
    },
    computed: {
      userId () {
        return this.$store.getters.userInfo.id;
      },
      userName () {
        return this.$store.getters.userInfo.name;
      }
    },
    methods: {
      logout () {
        logout({userId: this.userId}).then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.$message.success('退出登录');
            this.$router.push('/');
          } else {
            this.$message.error(data.message);
          }
        });
      },
      changePsw () {
        this.visible = true;
      },
      handleOk () {
        this.handleSubmit().then(res => {
          if (res) {
            let {newPassword, oldPassword} = res;
            rePwd({newPassword, oldPassword}).then(res => {
              if (res.data.code == 0) {
                this.$message.success('密码修改成功，请重新登录');
                setTimeout(() => {
                  this.$router.push('/');
                }, 800);
              } else {
                this.$message.error(res.data.message);
              }
            });
          }
        });
      },
      accountError () {
        const { getFieldError, isFieldTouched } = this.form;
        return isFieldTouched('account') && getFieldError('account');
      },
      passwordError () {
        const { getFieldError, isFieldTouched } = this.form;
        return isFieldTouched('password') && getFieldError('password');
      },
      handleSubmit  () {
        return new Promise(resolve => {
          this.form.validateFields((err, values) => {
            if (!err) {
              if (values.newPassword !== values.reNewPassword) {
                resolve(false);
                if (this.errorTimer) return;
                this.$message.error('两次密码输入不一致');
                this.errorTimer = setTimeout(() => {
                  this.errorTimer = null;
                }, 800);
              } else {
                resolve(values);
              }
            }
          });
        });
      }
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'headTop']{
    height: 60px;
    padding: 0 30px;
    background-image: linear-gradient(46deg, #3B60F1 0%, #44B6FA 100%);
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    .text{
      .fj();
      flex: 1;
      color: #FFFFFF;
      .title{
        flex: 1;
        font-size: .2rem;
        float: left;
      }
      .name{
        flex: 1;
        text-align: right;
        font-size: .2rem;
      }
    }
    .logout{
      height: 100%;
      float: right;
      .fj();
      color: #FFFFFF;
      img{
        flex: .4rem 0 0;
        width: .4rem;
        height: auto;
        margin-left: .08rem;
      }
      .anticon{
        flex: .12rem 0 0;
        margin: 0 .05rem;
      }
    }
  }
</style>
