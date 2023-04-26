import Vue from 'vue';
import Router from 'vue-router';
import home from '@/views/home';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/cex-dex',
    },
    {
      path: '',
      name: 'home',
      component: home,
      children: [
        {
          path: '/cex-dex',
          name: 'cex-dex',
          component: () => import('@/views/cex-dex'),
        },
        {
          path: '/greedy',
          name: 'greedy',
          component: () => import('@/views/greedy'),
        },
        {
          path: '/grid',
          name: 'grid',
          component: () => import('@/views/grid'),
        },
        {
          path: '/cow-bear',
          name: 'cow-bear',
          component: () => import('@/views/cow-bear'),
        },
        {
          path: '/cow-bear-stage',
          name: 'cow-bear-stage',
          component: () => import('@/views/cow-bear-stage'),
        },
      ],
    },
  ],
});
export default router;
