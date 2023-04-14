import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home';

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/cex-dex'
        },
        {
            path: '',
            name: 'home',
            component: home,
            children: [
                {
                    path: '/cex-dex',
                    name: 'cex-dex',
                    component: () => import('@/views/cex-dex')
                },
                {
                  path: '/order-profit',
                  name: 'order-profit',
                  component: () => import('@/views/order-profit')
              },
                {
                  path: '/grid',
                  name: 'grid',
                  component: () => import('@/views/grid')
                },
                {
                  path: '/cow-bear',
                  name: 'cow-bear',
                  component: () => import('@/views/cow-bear')
              },
              {
                path: '/cow-bear-stage',
                name: 'cow-bear-stage',
                component: () => import('@/views/cow-bear-stage')
            },
                {
                    path: '/page2',
                    name: 'page2',
                    component: () => import('@/views/page2')
                },
                {
                    path: '/page3',
                    name: 'page3',
                    component: () => import('@/views/page3')
                }
            ]
        }
    ]
})
export default router
