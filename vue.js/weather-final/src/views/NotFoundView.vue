<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <main class="not-found">
    <h1>404</h1>
    <p>요청하신 페이지를 찾을 수 없습니다.</p>

    <RouterLink to="/weather"> 날씨 메인으로 돌아가기 </RouterLink>
  </main>
</template>

<style scoped>
.not-found {
  margin: 80px auto;
  text-align: center;
}

.not-found h1 {
  margin-bottom: 10px;
  font-size: 64px;
  color: #ff6b6b;
}
</style>
