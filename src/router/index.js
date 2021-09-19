import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home/router'
import bookinfo from '../views/bookinfo/router'
import somePages from '../views/pages/routers.js'
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
    ...bookinfo,
    ...somePages
]

const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes
})

export default router
