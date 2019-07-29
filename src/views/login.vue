<template>
  <div class="login">
    <dir class="container">
      <img src="../assets/illust_51199970_20181212_124311.jpg" alt srcset class="avatar" />
      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
        <el-form-item prop="username" class="userName">
          <el-input prefix-icon="myicon myicon-user" v-model="loginForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="密码" prefix-icon="myicon myicon-key"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="login">登陆</el-button>
        </el-form-item>
      </el-form>
    </dir>
  </div>
</template>
<script>
import { login } from '@/api/user_index.js'
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true,
            message: '用户名啊',
            trigger: 'blur' }
        ],
        password: [
          { required: true,
            message: '输入密码',
            trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    login () {
      // 再次实现数据的验证
      // 我们可以调用表单的validate方法实现数据的验证,在验证完成的时候,会调用传入的回调函数,这个回调函数有一个参数valid,如果这个参数为true,则说明验证通过(可以继续你的登陆请求),否则验证失败(阻止你的登陆请求并给出提示)
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          login(this.loginForm)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 200) {
                // 保存token数据到本地
                localStorage.setItem('zwero', res.data.data.token)
                // 进行路由跳转
                this.$router.push({ name: 'home' })
              } else {
                this.$message({
                  message: res.data.meta.msg,
                  type: 'error'
                })
              }
            })
            .catch(err => {
              console.log(err)
              this.$message({
                message: '登陆失败',
                type: 'error'
              })
            })
        } else {
          this.$message({
            message: '数据输入不合法',
            type: 'error'
          })
          // 只有return false才能阻止请求
          return false
        }
      })
      // 发起请求
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background: url("../assets/illust_58445343_20181211_174127.png");
  background-size: 100% 100%;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white, rgba(255, 0, 0, 0.3);
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff, rgba(255, 0, 0, 0.3);
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
      background: white, rgba(255, 0, 0, 0.3);
    }
    .container .userName {
        background: white, rgba(255, 0, 0, 0.3)
    }
  }
}
</style>
