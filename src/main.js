// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import VueResource from 'vue-resource'
import store from './store/store'

// 引入elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

// 引入iview
// import 'iview/dist/iview.min.js'
// import 'iview/dist/styles/iview.css'

// 引入公共css
import 'assets/css/common.css'

import {getStore, getDataFormLUPById} from '@/assets/js/utils'

// 引入 font-awesome
// import 'assets/Font-Awesome/css/font-awesome.min.css'

// 引入 jquery
// import '../bower_components/jquery/dist/jquery.min.js'

// 引入 bootstrap
// import '../bower_components/bootstrap/dist/css/bootstrap.min.css'
// import '../bower_components/bootstrap/dist/js/bootstrap.min.js'

Vue.config.productionTip = false

// 务必在加载 Vue 之后，立即同步设置以下内容
Vue.config.devtools = true

Vue.use(VueResource)
Vue.use(ElementUI)

let loadingInstance = ''

// vue-resource拦截器
Vue.http.interceptors.push(function (request, next) {

  // 请求发送前的处理逻辑
  // 允许跨域
  // request.xhr = {
  //   withCredentials: true
  // },
  // request.emulateJSON = true
  // if (request.crossOrgin === null) {
  //   request.corssOrigin = corssOrigin(request)
  // }
  // if (request.corssOrigin) {
  //   if (!xhrCors) {
  //     request.client = xdrClient
  //   }
  //   request.enumlateHTTP = false
  // }

  if (request.params.loading) {
    // 请求加载中
    loadingInstance = Vue.prototype.$loading({
      fullscreen: true,
      text: '玩命加载中...'
    })
  }
  if (process.env.NODE_ENV === 'development') {
    // console.log('development')
    request.url = 'https://www.kimshare.club:8843' + request.url
  } else if (process.env.NODE_ENV === 'production') {
    request.url = 'https://www.kimshare.club:8843' + request.url
  }
  next(function (response) {
    // 请求发送后的处理逻辑
    // 根据请求的状态，response参数会返回给successCallback或errorCallback
    if (response.url.indexOf('loading') !== -1 && loadingInstance !== '') {
      loadingInstance.close()
    }
    return response
  })
})

new Vue({
  router,
  store,
  render: h => h(App),
  // 监听路由检查登录
  watch: {
    '$route': 'checkLogin'
  },
  // 进入页面时检查登录
  created () {
    this.checkLogin()
  },
  methods: {
    checkLogin () {
      let _this = this
      // 检查是否存在session
      if (!getStore('kim_un') && !getStore('kim_id') && !getStore('kim_rl') && !getStore('kim_cp')) {
        // 如果没有登录状态则跳转到登录页
        _this.$router.push('/login')
      } else {
        // 否则跳转到登录后的页面
        if (_this.$route.path.indexOf('/login') !== -1) {
          _this.$router.go(-1)
        }
        // 分发用户信息
        this.$store.dispatch("getUserInfo")
      }
    }
  }
}).$mount('#app')
