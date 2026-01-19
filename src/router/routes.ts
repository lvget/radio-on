import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/components/PlaylistView.vue'),
      },
      {
        path: '/playlist/:playlist/',
        component: () => import('src/components/PlaylistView.vue'),
      },
      {
        path: '/stream',
        component: () => import('src/components/StreamView.vue'),
      },
      // {
      //   path: '/visualization',
      //   component: () => import('pages/VisualisationPage.vue'),
      // },
      // {
      //   path: '/equalizer',
      //   component: () => import('src/pages/EqualizerPage.vue'),
      // },
      {
        path: '/equalizer-test',
        component: () => import('src/pages/EqualizerTestPage.vue'),
      },
    ],
  },
  {
    path: '/settings',
    component: () => import('layouts/SettingsLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/AboutPage.vue'),
      },
      {
        path: 'about',
        component: () => import('pages/AboutPage.vue'),
      },
      {
        path: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
      {
        path: 'sound',
        component: () => import('pages/SoundSettingPage.vue'),
      },
      {
        path: 'ui',
        component: () => import('pages/UiSettingPage.vue'),
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
