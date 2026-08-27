<script setup>
import { RouterLink, RouterView } from "vue-router";
import UnitToggler from "@/components/exercise/UnitToggler.vue";
</script>

<template>
  <header class="navigation">
    <RouterLink to="/weather"> 날씨 대시보드 </RouterLink>
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
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid #dddddd;
}

.navigation a {
  color: #34495e;
  text-decoration: none;
}

.navigation a.router-link-active {
  color: #0ea5e9;
  font-weight: bold;
}

.unit-control {
  margin-left: auto;
}

@media (max-width: 760px) {
  .unit-control {
    width: 100%;
    margin-left: 0;
  }
}
</style>
