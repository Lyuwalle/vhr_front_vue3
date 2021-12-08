<template>
  <div class="outerContainer">
    <!--
    表单登录
    ref表示这个表单的名字
    -->
    <el-form
        v-loading="loading"
        element-loading-text="拼命登录中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        ref="loginFormCheck"
        :model="loginForm"
        :rules="rules"
        class="loginContainer">
      <!--      登录标题-->
      <h2 class="loginTitle">系统登录</h2>

      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>

      <!--      check box-->
      <el-checkbox class="loginRemember" v-model="checked" disabled>记住我</el-checkbox>
      <!--      登录按钮-->
      <el-button type="primary" style="width:100%" @click="submitLogin" plain>登录</el-button>
    </el-form>
  </div>
</template>

<script>

import {postKeyValueRequest} from "@/utils/api";

export default {
  name: "Login",
  data() {
    return {
      /*loading初始值设置为false，登录时设置为true，成功之后再设置为false*/
      loading: false,
      checked: true,
      rules: {
        username:[{required:true, message:'请输入用户名', trigger:'blur'}],
        password:[{required:true, message:'密码不能为空', trigger:'blur'}],
      },
      loginForm: {
        username:'',
        password:'',
        code:''
      },
    }
  },
  methods: {
    /*处理登录事件*/
    submitLogin() {
      this.$refs.loginFormCheck.validate((valid) => {
        if (valid) {
          /*加载进度条*/
          this.loading = true;
          postKeyValueRequest('/doLogin', this.loginForm).then(resp => {
            if (resp) {
              alert(JSON.stringify(resp))
              window.sessionStorage.setItem("user", JSON.stringify(resp.object))
              /*这个this.$router指的是main.js里面的router，，更像是router/index.js里面的router？*/
              /*登录的页面的跳转使用replace，而不是push，登录之后不能返回*/
              this.$router.replace('/home')

            }
          })
          this.loading = false;
        } else {
          /*element-ui中的消息提示*/
          this.$message.error('请输入所有用户信息！');
          return false;
        }
      })
    }
  }
}
</script>

<style scoped>
.loginTitle{
  margin: 15px auto 20px auto;
  text-align: center;
  color: #021a32;
}
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #eaeaea;
  border: 1px solid #eaeaea;
  /*表示阴影效果*/
  box-shadow: 0 0 25px #cac6c6;
}
.outerContainer {
  background: #ffffff;
}
.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
  color: #021a32;
}
</style>