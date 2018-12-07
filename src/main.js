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

import 'iview/dist/iview.min.js'
import 'iview/dist/styles/iview.css'

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
        this.$store.dispatch("getUserInfo")
      }
    }
  }
}).$mount('#app')
