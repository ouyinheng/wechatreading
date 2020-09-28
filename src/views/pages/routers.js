
export default [
    {
        path: '/search',
        name: 'search',
        component: () => import(/* webpackChunkName: "otherPages" */ './search.vue')
    }, {
        path: '/bookDetails',
        name: 'bookDetails',
        component: () => import(/* webpackChunkName: "otherPages" */ './bookDetails.vue')
    }, {
        path: '/discoverInfo',
        name: 'discoverInfo',
        component: () => import(/* webpackChunkName: "otherPages" */ './discoverInfo.vue')
    },  {
        path: '/readBook',
        name: 'readBook',
        component: () => import(/* webpackChunkName: "otherPages" */ './readBook.vue')
    }, {
        path: '/recomInfo',
        name: 'recomInfo',
        component: () => import(/* webpackChunkName: "otherPages" */ '../home/discover/discoverInfo.vue')
    }, {
        path: '/setup',
        name: 'setup',
        component: () => import(/* webpackChunkName: "otherPages" */ '../home/mine/setup.vue')
    }, {
        path: '/local',
        name: 'local',
        component: () => import(/* webpackChunkName: "otherPages" */ './localImport.vue')
    }, 
]