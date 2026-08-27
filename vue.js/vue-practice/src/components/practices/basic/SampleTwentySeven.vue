<script setup>
import { ref } from "vue";
import WeatherCard from "../component/WeatherCard.vue";

const selectedCityInfo = ref("카드를 클릭해 보세요.");

const receiveCitySignal = (cityName) => {
  selectedCityInfo.value = `${cityName}이(가) 성공적으로 선택되었습니다.`;
};
</script>

<template>
  <div class="practice-section">
    <h2>Props & Emits 실습 2</h2>

    <div class="parent-container">
      <h3>부모 컴포넌트</h3>

      <WeatherCard city-name="서울" status="맑음" @select-city="receiveCitySignal" />

      <WeatherCard city-name="수원" status="비" @select-city="receiveCitySignal" />

      <div class="status-bar">
        {{ selectedCityInfo }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.parent-container {
  padding: 20px;
  background-color: #f7f9fb;
  border: 1px solid #dddddd;
  border-radius: 8px;
}

.status-bar {
  margin-top: 16px;
  padding: 12px;
  color: #25873c;
  font-weight: bold;
  text-align: center;
  background-color: #e4f7e8;
  border-radius: 6px;
}
</style>
