
export default [
    {
        path: '/search',
        name: 'search',
        component: () => import(/* webpackChunkName: "discover" */ './search.vue')
    }
]