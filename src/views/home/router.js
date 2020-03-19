
export default [
    {
        path: '/home/discover',
        name: 'discover',
        component: () => import(/* webpackChunkName: "discover" */ './discover/index.vue')
    },
    {
        path: '/home',
        name: 'bookrack',
        component: () => import(/* webpackChunkName: "bookrack" */ './bookrack/index.vue')
    },
    {
        path: '/home/lookat',
        name: 'lookat',
        component: () => import(/* webpackChunkName: "lookat" */ './lookat/index.vue')
    },
    {
        path: '/home/mine',
        name: 'mine',
        component: () => import(/* webpackChunkName: "mine" */ './mine/index.vue')
    }
]