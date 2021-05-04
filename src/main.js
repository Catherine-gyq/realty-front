import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VCharts from 'v-charts'
import 'font-awesome/scss/font-awesome.scss'
import './assets/scss/element.scss'
import './assets/scss/main.scss'
import store from './store'
import VueAxios from 'vue-axios'
import VueClipboard from 'vue-clipboard2'
import http from './http'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


// UI框架、图表框架引入
Vue.use(ElementUI);
Vue.use(VCharts);
Vue.use(VueClipboard);
Vue.use(VueAxios, http);
Vue.use(VueQuillEditor);

// 不显示生产环境消息，非生产环境下关闭
Vue.config.productionTip = false;

// 设定全局组件共用的函数/数据
Vue.mixin({
  methods: {
    // register global methods
    formatString: require('string-format-obj'),
    basename: require('path').basename,
    join: require('path').join
  }
});
//全局函数定义（临时）
Vue.prototype.handleSizeChange = function (val){
  if (val) {
    this.ep_page.limit = val
    this.onRefresh()
  }
}
Vue.prototype.handleCurrentChange = function (val){
  if (val) {
    this.ep_page.offset = val
    this.onRefresh()
  }
}






new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
