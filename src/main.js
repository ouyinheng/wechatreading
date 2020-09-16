import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import '@/assets/theme/index.scss';
Vue.config.productionTip = false
import VueAwesomeSwiper from 'vue-awesome-swiper'
import globalConfig from './static/config'
import mandMobile from 'mand-mobile'
import 'mand-mobile/lib/mand-mobile.css'

Vue.use(mandMobile)
// require styles
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper, /* { default global options } */)
Vue.prototype.globalConfig = globalConfig;

axios.defaults.headers = {
    'Content-type': 'application/json'
}
Vue.prototype.axios = axios;
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
