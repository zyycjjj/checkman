import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css'
import Md5 from 'js-md5'
import VueSSE from 'vue-sse'

// 导入全局样式表
import './assets/css/global.css'
// 导入axios
import axios from 'axios'
// 导入时间处理插件
import Moment from 'moment'
// 导入假进度条的样式和包
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置请求的根路径
// axios.defaults.baseURL = 'http://zhiquwl.com/microsign/api/'
axios.defaults.baseURL = 'http://localhost:8081/'

// 配置请求拦截器
// 在request拦截器中,展示进度条Nprogress.start()
axios.interceptors.request.use(config => {
  Nprogress.start()
  // 还可以进行统一的token失效的拦截处理状态码是401就是token失效就应该提示并拦截到登录页
  // 预处理,加token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
}, (error) => { return Promise.reject(error) })

axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})

// 定义全局的过滤器
Vue.filter('dateFilter', function (value) {
  return Moment.format('YYYYMMDD')
})
Vue.prototype.$http = axios
Vue.prototype.$md5 = Md5

Vue.config.productionTip = false

Vue.use(VueSSE)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
