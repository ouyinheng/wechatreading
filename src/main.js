import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import '@/assets/theme/index.scss';
Vue.config.productionTip = false
import VueAwesomeSwiper from 'vue-awesome-swiper'
// require styles
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper, /* { default global options } */)
Vue.prototype.axios = axios;
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
