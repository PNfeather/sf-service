<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="login-wrapper">
        <div class="loginArea">
          <img :src="loginImg" alt="">
        </div>
        <div class="handleArea">
          <a-form
            :form="form"
            class="form fillcontain"
            @submit="handleSubmit">
            <a-form-item class="title">
              <span class="title-text">闪批客作业客服系统</span>
            </a-form-item>
            <a-form-item
              class="input-item"
              :validate-status="accountError() ? 'error' : ''"
              :help="accountError() || ''">
              <a-input
                class="input"
                v-decorator="rules.account"
                placeholder="请输入账号">
              </a-input>
            </a-form-item>
            <a-form-item
              class="input-item"
              :validate-status="passwordError() ? 'error' : ''"
              :help="passwordError() || ''">
              <a-input
                class="input"
                v-decorator="rules.password"
                type="password"
                placeholder="请输入密码">
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button
                class="login-button"
                html-type="submit">
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </section>
    </transition>
  </div>
</template>

<script type='text/babel'>
  export default {
    name: 'login',
    data () {
      const query = this.$route.query;
      return {
        autoBack: query.autoBack,
        loginImg: require('@IMG/loginImg.png'),
        form: this.$form.createForm(this),
        rules: {
          account: [
            'account',
            {rules: [{ required: true, message: '请输入账号!' }]}
          ],
          password: [
            'password',
            {rules: [{ required: true, message: '请输入密码!' }]}
          ]
        }
      };
    },
    methods: {
      accountError () {
        const { getFieldError, isFieldTouched } = this.form;
        return isFieldTouched('account') && getFieldError('account');
      },
      passwordError () {
        const { getFieldError, isFieldTouched } = this.form;
        return isFieldTouched('password') && getFieldError('password');
      },
      handleSubmit  (e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            this.$store.dispatch('login', {autoBack: this.autoBack, ...values});
          }
        });
      }
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  .login_page{
    background: url("~@IMG/loginBack.png") no-repeat center;
    background-size: 100% 100%;
    position: relative;
    .login-wrapper{
      .wh(12rem, 6.75rem);
      .ctp(12rem, 6.75rem);
      background: #FFFFFF;
      box-shadow: 0 0.09rem 0.22rem 0.2rem rgba(76,103,185,0.30);
      border-radius: 10px;
      display: flex;
      .loginArea{
        flex: 6.45rem 0 0;
        .fac();
        img{
          .wh(5.45rem, 3.74rem);
        }
      }
      .handleArea{
        flex: 5.05rem 0 0;
        .fac();
        .form{
          padding-top: 1.08rem;
          .title{
            margin-bottom: .3rem;
            .title-text{
              font-size: .28rem;
              color: #333333;
            }
          }
          .input-item{
            margin-bottom: 0;
            height: 1.2rem;
            .input{
              background: rgba(182,206,250,0.10);
              border: 1px solid rgba(61,120,238,0.20);
              border-radius: 4px;
              line-height: .8rem;
              height: .8rem;
              font-size: .24rem;
            }
          }
          .login-button{
            font-size: .28rem;
            background-image: linear-gradient(-136deg, #3B60F1 0%, #44B6FA 100%);
            border-radius: 4px;
            color: #FFFFFF;
            text-align: center;
            height: .8rem;
            line-height: .8rem;
            width: 100%;
            margin-top: .6rem;
          }
        }
      }
    }
  }
  .form-fade-enter-active, .form-fade-leave-active {
    transition: all 1s;
  }
  .form-fade-enter, .form-fade-leave-active {
    transform: translate3d(0, -50px, 0);
    opacity: 0;
  }
</style>
