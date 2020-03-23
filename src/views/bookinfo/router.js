
export default [
    {
        path: '/bookinfo',
        name: 'bookinfo',
        component: () => import(/* webpackChunkName: "bookinfo" */ './bookinfo.vue')
    },
    {
        path: '/home/mine/picture',
        name: 'picture',
        component: () => import(/* webpackChunkName: "mine" */ '@/views/home/mine/picture.vue'),
    }
]