import Vue from "vue";
import Vuex from "vuex";
import "./serviceConfig";
// import charts from './modules/charts'
import discover from "./modules/discover";
import picture from "./modules/picture";
Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
        discover,
        picture
	},
});
