import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Sse.vue'
import Doorman from '../components/Doorman.vue'
import Peoman from '../components/Peoman.vue'
import Pinfo from '../components/Pinfo.vue'
import Loginsvip from '../components/Login-svip.vue'
import Homesvip from '../components/Home-SVIP.vue'
import Coman from '../components/Coman.vue'
import Data from '../components/Data.vue'
import Welcomevip from '../components/Welcomevip.vue'
Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: 'login'
},
{
  path: '/login',
  component: Login
},
{
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [
    {
      path: '/welcome',
      component: Welcome
    },
    {
      path: '/doorman',
      component: Doorman
    },
    {
      path: '/peoman',
      component: Peoman
    },
    {
      path: '/pinfo',
      component: Pinfo
    }
  ]
},
{
  path: '/login-svip',
  component: Loginsvip
},
{
  path: '/home-svip',
  component: Homesvip,
  redirect: '/welcome-svip',
  children: [
    {
      path: '/welcome-svip',
      comnent: Welcomevip
    },
    {
      path: '/coman',
      component: Coman
    },
    {
      path: '/data',
      component: Data
    }
  ]
}
]

const router = new VueRouter({
  routes
})

// 挂载路由导航首位
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从那个路径跳转过来
  // next 是一个函数 表示放行
  if (to.path === '/login' || to.path === '/login-svip') return next()
  // 先获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
