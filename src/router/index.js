import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import ('@/views/Login/Login.vue')
  },
  {
    path: '/home',
    component: () => import ('@/views/Home/Home.vue'),
    redirect: '/home/selectsub',
    children: [
      {
        path: 'selectsub',
        component: () => import ('@/views/Home/SelectSubject.vue')
      },
      {
        path: 'index',
        component: () => import ('@/views/Home/Index/Index.vue'),
        redirect: '/home/index/main',
        children: [
          {
            path: 'main',
            component: () => import ('@/views/Home/Index/Item/Main.vue'),
          },
          {
            path: 'material',
            component: () => import ('@/views/Home/Index/Item/Material.vue')
          },
          {
            path: 'notification',
            component: () => import ('@/views/Home/Index/Item/Notification.vue')
          },
          {
            path: 'homework',
            component: () => import ('@/views/Home/Index/Item/Homework.vue')
          },
          {
            path: 'discussion',
            component: () => import ('@/views/Home/Index/Item/Discussion.vue')
          },
          {
            path: 'management',
            component: () => import ('@/views/Home/Index/Item/Management.vue')
          }
        ]
      }
    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页，直接放行
  if (to.path === '/login') return next()
  // 从 sessionStorage 中获取保存的 token 值
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
