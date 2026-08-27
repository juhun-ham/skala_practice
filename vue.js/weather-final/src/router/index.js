import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/weather',
    },
    {
      path: '/weather',
      name: 'weather-home',
      component: () => import('../views/WeatherHomeView.vue'),
    },
    {
      path: '/weather/about',
      name: 'weather-about',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      path: '/weather/guide',
      name: 'weather-guide',
      component: () => import('../views/WeatherGuideView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/:pathMatch(.*)*', // 일치하는 주소가 없을 시, 나머지 모든 주소(*)를 NotFoundView.vue로 연결
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
