module.exports = {
  devServer: {
    open: true, // 浏览器自动打开页面
    host: '0.0.0.0', // 如果是真机测试，就使用这个IP
    port: 8081,
    https: false,
    proxy: {
      // 配置跨域
      '/microsign/api/push': {
        target: 'http://zhiquwl.com',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/microsign/api/push': '/microsign/api/push'
        }
      },
      '/microsign/api/adm': {
        // target: 'http://zhiquwl.com',
        target: 'http://zhiqv.ngrok2.xiaomiqiu.cn',
        // http://zhiqv.ngrok2.xiaomiqiu.cn/microsign
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/microsign/api/adm': '/microsign/api/adm'
        }
      },
      '/microsign/api/com': {
        target: 'http://zhiquwl.com',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/microsign/api/com': '/microsign/api/com'
        }
      }

    }
  }
}
