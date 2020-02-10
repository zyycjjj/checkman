<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/imgs/avatar.jpg" alt />
        <span>小区微签管理</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
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
            <span slot="title">小区入口管理</span>
          </el-menu-item>
          <el-menu-item index="/pinfo">
            <i class="el-icon-menu"></i>
            <span slot="title">小区出入信息</span>
          </el-menu-item>
          <el-menu-item index="/peoman">
            <i class="el-icon-menu"></i>
            <span slot="title">住户信息管理</span>
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
}

.el-header {
  background-color: #437ecc;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

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
