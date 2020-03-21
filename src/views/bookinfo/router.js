
export default [
    {
        path: '/bookinfo',
        name: 'bookinfo',
        component: () => import(/* webpackChunkName: "bookinfo" */ './bookinfo.vue')
    }
]