<script setup>
import { RouterLink, RouterView } from "vue-router";
import UnitToggler from "@/components/exercise/UnitToggler.vue";
</script>

<template>
  <header class="navigation">
    <RouterLink to="/"> 기본 실습 </RouterLink>
    <RouterLink to="/weather-mockup"> 날씨 과제 1</RouterLink>
    <RouterLink to="/weather-composition"> 날씨 과제 2 </RouterLink>
    <RouterLink to="/weather-component"> 날씨 과제 3 </RouterLink>
    <RouterLink to="/weather"> 날씨 과제 6 </RouterLink>
    <RouterLink to="/weather/about"> 서비스 소개 </RouterLink>
    <RouterLink to="/weather/guide"> 날씨 가이드 </RouterLink>
    <div class="unit-control">
      <UnitToggler />
    </div>
  </header>

  <RouterView />
</template>

<style>
.navigation {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid #dddddd;
}

.unit-control {
  margin-left: auto;
}
</style>
