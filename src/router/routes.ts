import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/collection/:playlist/:name?',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/visualisation',
        component: () => import('pages/VisualisationPage.vue'),
      },
      {
        path: '/settings',
        component: () => import('pages/SettingsPage.vue'),
      },
      {
        path: '/login',
        component: () => import('pages/LoginPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
