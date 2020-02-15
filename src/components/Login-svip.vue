<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登陆表单 -->
      <!-- 用户名 -->
      <el-form
        ref="loginFormRef"
        status-icon
        :model="loginForm"
        :rules="loginFormRules"
        class="login_from"
        label-width="0"
      >
        <el-form-item prop="u">
          <el-input v-model="loginForm.u" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="p">
          <el-input type="password" v-model="loginForm.p" prefix-icon="iconfont icon-showpassword"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="danger" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 超级管理员登录页面跳转 -->
    <div class="svip_login">
      <el-button size="mini" type="success" @click="gotoVip">点击跳转到小区管理员登陆</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登陆表单的数据绑定对象
      loginForm: {
        u: '',
        p: ''
      },
      // 小区入口列表对象
      entry_list: {},
      // 表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        u: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: ['blur', 'change']
          }
        ],
        // 验证密码是否合法
        p: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      // 测试代码
      // window.sessionStorage.setItem('comid', 1)
      // this.$router.push('/home')
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        // const p = this.$md5(this.loginForm.p)
        // this.loginForm.p = p
        const params = {
          u: this.loginForm.u,
          p: this.$md5(this.loginForm.p)
        }
        const res = await this.$http.post(
          '/microsign/api/adm/login',
          params
        )
        // 错误码判断
        if (res.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        // 1.将登录成功之后的token,保存到客户端的sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        window.sessionStorage.setItem('groupid', res.data.groupid)
        //   1.1 项目中除了登陆之外的其他API接口,必须登陆后
        //   1.2 token 之应该在当前网站打开期间生效,所以将token保存在sessionStorage中
        // 2.通过编程式导航跳转到后台主页,路由地址是/home
        // 3.将登录返回的入口列表数据存入sessionStorage中
        this.$router.push('/home-svip')
      })
    },
    gotoVip () {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-image: url(../assets/imgs/bg.jpg);
  background: url(../assets/imgs/bg.jpg) 0 center no-repeat;
  background-size: cover;
  height: 100%;
  position: relative;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_from {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.svip_login {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
