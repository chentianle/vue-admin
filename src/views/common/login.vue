<template>
  <div id="login" class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <p class="brand-info__intro"></p>
        </div>
        <div class="login-main">
          <h2 class="brand-info__text">健康人群监管平台</h2>

          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="userName">
              <el-input id="user" style="border: 1px solid rgba(0,0,0,.5);border-radius: 3px;" v-model="dataForm.userName" placeholder="请输入帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input id="psd" style="border: 1px solid rgba(0,0,0,.5);border-radius: 3px;" v-model="dataForm.password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <Captcha
                        id="Captcha"
                        scene="Login"
                        type="TencentCaptcha"
                        :parm="captchaOption"
                        @callback="captchaNotice"
                        :url="loginURL"
                >
                <!-- ifEmptyOrNot(dataForm.userName) || ifEmptyOrNot(dataForm.password)" -->
              <el-button id="Captcha" class="login-btn-submit" :disabled="false" type="primary" @click="dataFormSubmit()">登 录</el-button>
              </Captcha>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import { getUUID } from '@/utils'
  import {ifEmptyOrNot} from '@/utils/validate'

  export default {
    data () {
      this.ifEmptyOrNot = ifEmptyOrNot
      return {
        dataForm: {
          userName: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        loginURL: '',
        loading: false,
        loginFlag: false, // 只能调用一次login的标志
        captchaOption: {
          appid: '2073845417'
        },
        dataRule: {
          userName: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          captcha: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        captchaPath: ''
      }
    },
    created () {
      // this.getCaptcha()
    },
    methods: {
      // 提交表单
      dataFormSubmit (randstr, ticket) {
        if (!randstr || !ticket) {
          return
        }
        if (this.ifEmptyOrNot(this.dataForm.userName) || this.ifEmptyOrNot(this.dataForm.password)) {
          return
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/login'),
              method: 'post',
              data: this.$http.adornData({
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha,
                'randstr': randstr,
                'ticket': ticket
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                console.log(data)
                this.$cookie.set('token', data.token)
                this.$cookie.set('superAdminFlag', data.superAdminFlag)
                this.$router.replace({ name: 'home' })
              } else {
                // this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // // 获取验证码
      // getCaptcha () {
      //   this.dataForm.uuid = getUUID()
      //   this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      // }
      // 回调监听
      // status: 1成功,2验证中,0失败
      // res: 三方返回的原始数据
      captchaNotice (status, res) {
        console.log(status, res, '2222')
        if (status === 2) {
          this.dataFormSubmit(res.randstr, res.ticket)
        } else {
          console.log(res)
        }
      }
    }
  }
</script>
<style>
  #login .el-input__inner{
    background-color: transparent;
    border: 0;
    color: #4FF1EE;
    line-height: 40px;
  }
  #login .el-input.el-input--medium{
    background-image: url(~@/assets/img/input/input_bg.png);
    background-size: 100% 100%;
  }
</style>
<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    background-image: url(~@/assets/img/login.png);
    background-size: 1200px;
    background-repeat: no-repeat;
    background-position: -211px -142px;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/bg.jpg);
      background-size: 100% 100%;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }

    .brand-info__text {
      color: #4FF1EE;
      font-size: 24px;
      text-align: center;
      padding: 0px 0 10px;
      margin:  0 0 22px 0;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      position: absolute;
      top: 20vh;
      right: 15vw;
      padding: 80px 60px 65px;
      width: 519px;
      min-height: 30px;
      background-image: url(~@/assets/img/login-item.png);
      background-size: 100% 100%;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }
    #Captcha{
      background:  linear-gradient(to right,rgb(78,241,238), rgb(70,84,243));
      border-radius: 20px;
    }
    #user{
      position:relative;
      padding-left:50px;
      background: url(~@/assets/img/input/icon_user.png) no-repeat 18px 7px;
    }
    #psd{
      position:relative;
      padding-left:50px;
      background: url(~@/assets/img/input/icon_psd.png) no-repeat 18px 7px;
    }
  }
</style>
