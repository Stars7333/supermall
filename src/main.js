import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import VueLazyload from "vue-lazyload";

import toast from 'components/common/toast'
import {request} from "@/network/request"; /*默认导出index文件*/

Vue.config.productionTip = false

//添加事件总线对象
Vue.prototype.$bus = new Vue()
//安装toast插件
Vue.use(toast)

//解决移动端300ms延迟
FastClick.attach(document.body)

//使用懒加载插件
Vue.use(VueLazyload, {
  loading:require('./assets/img/common/duzhen-process.jpg'), //加载过程中显示的图片
  error: require('./assets/img/common/duzhen-fail.jpg') //图片加载失败显示的图片
  //还有很多,看文档....
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
