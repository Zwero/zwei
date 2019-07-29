import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入登录页面
import Login from '@/views/login.vue'
// 首页
import Home from '@/views/home.vue'
// 欢迎页面
import Welcome from '@/views/welcome.vue'
//  用户列表
import Users from '@/views/users/user.vue'
//  权限列表
import Right from '@/views/right/right.vue'
//  角色列表
import Role from '@/views/right/role.vue'
// 商品列表
import Goods from '@/views/goods/goods.vue'
// 分类参数
import List from '@/views/goods/list.vue'
// 商品分类
import Zwero from '@/views/goods/zwero.vue'

Vue.use(VueRouter)
// 创建路由对象
var router = new VueRouter({
  // 路由配置
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      // 添加路由重定向
      redirect: { name: 'welcome' },
      // 添加嵌套路由
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'users',
          path: 'users',
          component: Users
        },
        {
          name: 'right',
          path: 'rights',
          component: Right
        },
        {
          name: 'role',
          path: 'roles',
          component: Role
        },
        {
          name: 'goods',
          path: 'goods',
          component: Goods,
          // 重定向
          redirect: { name: 'list' },
          children: [
            {
              name: 'list',
              path: 'list',
              component: List
            },
            {
              name: 'add',
              path: 'add',
              component: Zwero
            }
          ]
        }
      ]
    }
  ]
})
// 暴露
export default router
