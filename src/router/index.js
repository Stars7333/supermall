import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../views/home/Home')
const Categroy = () => import('../views/category/Categroy')
const Cart = () => import('../views/cart/Cart')
const Proifile = () => import('../views/profile/Proifile')
const Detail = () => import('../views/detail/Detail')

//1.安装插件
Vue.use(VueRouter)

//2.创建路由对象
const routes = [
  {
    path:'',
    redirect: '/home'
  },{
    path:'/home',
    component: Home
  },{
    path:'/category',
    component: Categroy
  },{
    path:'/cart',
    component: Cart
  },{
    path:'/profile',
    component: Proifile
  },{
    path:'/detail/:iid',
    component: Detail
  }
]
const router = new VueRouter({
  routes,
  mode:'history'
})

//3.导出
export default router
