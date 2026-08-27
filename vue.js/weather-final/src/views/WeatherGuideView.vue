<script setup>
import { RouterLink } from "vue-router";

const weatherTips = [
  {
    id: 1,
    title: "더운 날",
    content: "물을 자주 마시고 야외 활동을 줄이세요.",
  },
  {
    id: 2,
    title: "비 오는 날",
    content: "우산을 준비하고 미끄러운 길을 조심하세요.",
  },
  {
    id: 3,
    title: "바람이 강한 날",
    content: "간판과 낙하물을 주의하세요.",
  },
];
</script>

<template>
  <main class="guide-page">
    <h1>💡 날씨별 생활 가이드</h1>

    <section v-for="tip in weatherTips" :key="tip.id" class="tip-card">
      <h2>{{ tip.title }}</h2>
      <p>{{ tip.content }}</p>
    </section>

    <RouterLink to="/weather" class="home-link"> 날씨 대시보드로 돌아가기 </RouterLink>
  </main>
</template>

<style scoped>
.guide-page {
  width: min(680px, calc(100% - 40px));
  margin: 40px auto;
  padding: 28px;
  background-color: white;
  border: 1px solid #dddddd;
  border-radius: 8px;
}

.guide-page h1 {
  margin-top: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #dddddd;
  font-size: 24px;
}

.tip-card {
  margin-bottom: 12px;
  padding: 16px;
  background-color: #f4f6f8;
  border-left: 5px solid #42b883;
  border-radius: 6px;
}

.tip-card h2 {
  margin: 0 0 8px;
  font-size: 18px;
}

.tip-card p {
  margin: 0;
}

.home-link {
  display: block;
  margin-top: 20px;
  padding: 12px;
  color: white;
  background-color: #42b883;
  border-radius: 6px;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
}
</style>
