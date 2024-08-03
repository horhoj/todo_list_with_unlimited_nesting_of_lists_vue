import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes = [
  {
    path: '/main',
    name: '/main',
    component: () => import('../views/MainView.vue')
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/main'
  }
] as const satisfies readonly RouteRecordRaw[];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
