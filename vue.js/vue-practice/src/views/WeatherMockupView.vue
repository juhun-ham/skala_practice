<script setup>
import { ref } from "vue";
const searchCity = ref("");
const handleSearchInput = (event) => {
  searchCity.value = event.target.value;
};
const weatherList = ref([
  {
    id: "city_01",
    name: "서울",
    temp: 28,
    status: "맑음",
  },
  {
    id: "city_02",
    name: "수원",
    temp: 24,
    status: "비",
  },
  {
    id: "city_03",
    name: "부산",
    temp: 26,
    status: "구름",
  },
]);
const selectedMessage = ref("");

const selectCity = (cityName) => {
  selectedMessage.value = `${cityName}이 선택되었습니다.`;
};

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`);
};
</script>

<template>
  <main class="weather-page">
    <h1>🌤️ 과제 1: 날씨 (Mockup)</h1>
    <section class="search-box">
      <h2>🔍 도시 검색</h2>

      <input
        type="text"
        :value="searchCity"
        placeholder="검색할 도시 이름 입력"
        @input="handleSearchInput"
      />

      <p>
        검색 중인 도시:
        <strong>{{ searchCity }}</strong>
      </p>
    </section>
    <section>
      <h2>지역별 날씨 현황</h2>
      <article
        v-for="weather in weatherList"
        :key="weather.id"
        class="weather-card"
        @click="selectCity(weather.name)"
      >
        <h3>{{ weather.name }} ({{ weather.status }})</h3>
        <p>현재 기온: {{ weather.temp }}°C</p>
        <span v-if="weather.temp >= 25" class="hot-label">🔥 더움(25도 이상)</span>
        <span v-else class="cool-label">❄️ 선선함 (25도 미만)</span>
        <button type="button" @click.stop="showDetail(weather.name, weather.status)">
          상세보기
        </button>
      </article>
      <p class="selected-message">
        {{ selectedMessage || "카드를 클릭하거나 검색해 보세요." }}
      </p>
    </section>
  </main>
</template>

<style scoped>
.weather-page {
  width: min(680px, calc(100% - 40px));
  margin: 40px auto;
  padding: 28px;
  background-color: white;
  border: 1px solid #dddddd;
  border-radius: 8px;
}

.weather-page > h1 {
  margin: 0 0 24px;
  padding-bottom: 16px;
  font-size: 26px;
  border-bottom: 1px solid #dddddd;
}

.search-box,
.weather-section {
  margin-bottom: 20px;
  padding: 18px;
  background-color: #f7f9fb;
  border: 1px solid #e2e6ea;
  border-radius: 8px;
}

.search-box h2,
.weather-section h2 {
  margin-top: 0;
  font-size: 18px;
}

.search-box input {
  width: 100%;
  padding: 10px;
  border: 1px solid #aaaaaa;
  box-sizing: border-box;
}

.search-box p {
  margin-bottom: 0;
}

.weather-card {
  position: relative;
  margin-bottom: 12px;
  padding: 16px;
  background-color: white;
  border: 1px solid #d8dde2;
  border-radius: 7px;
  cursor: pointer;
}

.weather-card:hover {
  background-color: #f9fffb;
  border-color: #42b883;
}

.weather-card h3 {
  margin: 0 0 6px;
}

.weather-card p {
  margin: 6px 0;
}

.weather-card button {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 10px;
  background-color: white;
  border: 1px solid #888888;
  cursor: pointer;
}

.hot-label,
.cool-label {
  display: inline-block;
  padding: 5px 10px;
  color: white;
  border-radius: 5px;
}

.hot-label {
  background-color: #ff6464;
}

.cool-label {
  background-color: #55b7e9;
}

.selected-message {
  margin: 18px 0 0;
  padding: 12px;
  color: #25873c;
  font-weight: bold;
  text-align: center;
  background-color: #e4f7e8;
  border-radius: 6px;
}

@media (max-width: 600px) {
  .weather-page {
    width: calc(100% - 20px);
    margin: 10px auto;
    padding: 18px;
  }
}
</style>