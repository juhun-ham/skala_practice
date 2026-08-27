import { createRouter, createWebHistory } from "vue-router";
import PracticeView from "../views/PracticeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "practice",
      component: PracticeView,
    },
    {
      path: "/weather-mockup",
      name: "weather-mockup",
      component: () => import("../views/WeatherMockupView.vue"),
    },
    {
      path: "/weather-composition",
      name: "weather-composition",
      component: () => import("../views/WeatherCompositionView.vue"),
    },
    {
      path: "/weather-component",
      name: "weather-component",
      component: () => import("../components/exercise/WeatherParent.vue"),
    },
    {
      path: "/weather",
      name: "weather-home",
      component: () => import("../views/WeatherHomeView.vue"),
    },
    {
      path: "/weather/:cityId",
      name: "weather-detail",
      component: () => import("../views/WeatherDetailView.vue"),
    },
    {
      path: "/weather/about",
      name: "weather-about",
      component: () => import("../views/WeatherAboutView.vue"),
    },
    {
      path: "/weather/guide",
      name: "weather-guide",
      component: () => import("../views/WeatherGuideView.vue"),
    },
    {
      path: "/:pathMatch(.*)*", // 일치하는 주소가 없을 시, 나머지 모든 주소(*)를 NotFoundView.vue로 연결
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

export default router;
