module.exports = {
  devServer: {
    open: true, // 浏览器自动打开页面
    host: '0.0.0.0', // 如果是真机测试，就使用这个IP
    port: 8081,
    https: false,
    proxy: {
      // 配置跨域
      '/api': {
        target: 'http://zhiquwl.com/microsign/api/',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}
