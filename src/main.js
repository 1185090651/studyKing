import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'; // 引入饿了么框架
import 'element-ui/lib/theme-chalk/index.css'; // 引入饿了么样式
import './globalCss/reset.css' // 引入全局样式
import './globalCss/normalize.css' //引入重置样式
import animate from 'animate.css'
import './filters/formatTime'
import './filters/formatSize'

Vue.use(ElementUI)
Vue.use(animate)

Vue.prototype.$message = ElementUI.Message; // 将弹框组件挂载到Vue的原型对象上
Vue.prototype.$confirm = ElementUI.MessageBox.confirm; // 将弹框组件挂载到Vue的原型对象上
Vue.prototype.$notify = ElementUI.Notification // 挂载通知消息


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
