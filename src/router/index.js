import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home/router'
import bookinfo from '../views/bookinfo/router'
Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		redirect: '/home'
	},
	{
		path: '/',
		name: 'Home',
		component: () => import(/* webpackChunkName: "about" */ '../views/home/index.vue'),
		children: [
			...home
		]
	},
	...bookinfo
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
