import Vue from 'vue'
import App from './App.vue'
import antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.min.css'

Vue.use(antd)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
