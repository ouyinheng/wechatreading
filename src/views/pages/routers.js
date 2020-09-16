
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
    }, 
]