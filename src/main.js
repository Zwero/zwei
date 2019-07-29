import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from '@/router/index.js'

// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入样式
import '@/style/index.less'

// 导航守望
router.beforeEach((to, from, next) => {
  var token = localStorage.getItem('zwero')
  if (token || to.path === '/login') {
    next()
  } else {
    next({ name: 'login' })
  }
})

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
