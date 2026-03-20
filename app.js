// app.js
App({
  onLaunch() {
    // 小程序启动时执行
    console.log('小程序启动')
  },

  globalData: {
    userInfo: null,
    currentCategory: 'hot' // 默认热菜
  }
})
