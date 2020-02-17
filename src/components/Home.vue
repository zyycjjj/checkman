<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- <img src="../assets/imgs/avatar.jpg" alt /> -->
        <span class="company">淄博智趣物联</span>
        <span>组织微签管理</span>
      </div>
      <div class="nav-svg"><img src="../components/SvgIcon/wechat.png"  alt />
      <el-button type="success" @click="logout" class="exit">退出登录</el-button></div>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#4A8AD4"
          :collapse="isCollapse"
          text-color="#fff"
          active-text-color="#409BFF"
          unique-opened
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单 -->
          <el-menu-item index="/doorman">
            <i class="el-icon-menu"></i>
            <span slot="title">入口数据管理</span>
          </el-menu-item>
          <el-menu-item index="/pinfo">
            <i class="el-icon-menu"></i>
            <span slot="title">出入信息管理</span>
          </el-menu-item>
          <el-menu-item index="/peoman">
            <i class="el-icon-menu"></i>
            <span slot="title">成员信息管理</span>
          </el-menu-item>
          <el-menu-item index="/welcome">
            <i class="el-icon-menu"></i>
            <span slot="title">实时出入数据</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 菜单是否折叠
      isCollapse: false
    }
  },
  created () {
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 切换菜单的折叠展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
  background-color: #f0f2f5;
}
.company {
  background: #4a8ad4
}
.exit {
  width:120px;
  font-size: 13px;
}
.avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
.el-header {
  background-color: #407dcc;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 18px;

  div {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
    span {
      margin-left: 15px;
    }
  }
  .nav-svg {
  position: relative;
  width:35px;
  height: 30px;
  z-index: 10;
  padding-right: 120px;
  }
  .nav-svg img {
    width: 35px;
    height: 30px;
    padding-right: 25px;
  }
  .nav-svg:hover::after {
    content: '淄博智趣物联';
    width: 120px;
    height: 120px;
    border: 5px solid white;
    background:url('../assets/imgs/qrcode.jpg') top ;
    background-size: 100% auto;
    position: absolute;
    top: 45px;
    left: -20px;
    z-index: 99999;
    }
}

.el-aside {
  background-color: #4a8ad4;
  .el-menu {
    border-right: none;
  }
  .toggle-button {
    background-color: #f99;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}

.el-main {
  background-color: #fff;
}
.iconfont {
  margin-right: 10px;
}
</style>
