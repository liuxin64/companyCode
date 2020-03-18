import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入UI框架
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入拖拽样式表
import 'vue-draggable-resizable/dist/VueDraggableResizable.css';

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
