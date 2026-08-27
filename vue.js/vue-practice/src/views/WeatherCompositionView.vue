<script setup>
import { computed, ref, watch, watchEffect } from "vue";

// 검색창 입력값
const searchQuery = ref("");

// 더운 도시만 보기
const hotOnly = ref(false);

// 선택한 도시
const selectedCityInfo = ref(null);

// 전체 날씨 데이터
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

// 검색어가 변경될 때 검색 결과를 자동으로 계산
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim();

  // 검색어가 없으면 전체 도시 반환
  if (query === "") {
    return weatherList.value;
  }

  // 도시 이름에 검색어가 포함된 데이터만 반환
  return weatherList.value.filter((weather) => weather.name.includes(query));
});
const displayedWeatherList = computed(() => {
  if (hotOnly.value === false) {
    return filteredWeatherList.value;
  }

  return filteredWeatherList.value.filter((weather) => weather.temp >= 25);
});

// 날씨 카드 선택
const selectCity = (weather) => {
  selectedCityInfo.value = weather;
};

// 상세보기
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`);
};
watch(selectedCityInfo, (newCity, oldCity) => {
  if (newCity === null) {
    return;
  }

  console.log(
    `👁️ [watch 감지] 상태바가 변경되었습니다: ${oldCity?.name ?? "선택 없음"} → ${newCity.name}`,
  );
});
watch(hotOnly, (newValue) => {
  console.log(`🔥 [watch 감지] 더운 도시만 보기: ${newValue ? "켜짐" : "꺼짐"}`);
});
watchEffect(() => {
  console.log(`🤖 [watchEffect 자동 호출] 현재 검색어: "${searchQuery.value}"`);
});
</script>

<template>
  <main class="weather-page">
    <h1>🌤️ 과제 2: 날씨 (컴포지션)</h1>

    <section class="search-box">
      <h2>🔍 도시 검색</h2>

      <input v-model="searchQuery" type="text" placeholder="검색할 도시 이름 입력" />

      <p>
        검색 중인 도시:
        <strong>{{ searchQuery }}</strong>
      </p>
      <label class="hot-filter">
        <input v-model="hotOnly" type="checkbox" />

        25도 이상인 도시만 보기
      </label>
    </section>

    <section class="weather-section">
      <h2>🌆 지역별 날씨 현황</h2>

      <article
        v-for="weather in displayedWeatherList"
        :key="weather.id"
        class="weather-card"
        @click="selectCity(weather)"
      >
        <h3>{{ weather.name }} ({{ weather.status }})</h3>

        <p>현재 기온: {{ weather.temp }}°C</p>

        <span v-if="weather.temp >= 25" class="hot-label"> 🔥 더움 (25도 이상) </span>

        <span v-else class="cool-label"> ❄️ 선선함 (25도 미만) </span>

        <button type="button" @click.stop="showDetail(weather.name, weather.status)">
          상세보기
        </button>
      </article>

      <p v-if="displayedWeatherList.length === 0" class="empty-message">
        조건과 일치하는 도시가 없습니다.
      </p>
    </section>

    <p class="selected-message">
      {{
        selectedCityInfo
          ? `${selectedCityInfo.name}이 선택되었습니다.`
          : "카드를 클릭하거나 검색해 보세요."
      }}
    </p>
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

/* 텍스트 검색창에만 적용 */
.search-box input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #aaaaaa;
  border-radius: 6px;
  box-sizing: border-box;
}

/* 체크박스 영역 */
.hot-filter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  background-color: #fff3e0;
  border: 1px solid #ffcc80;
  border-radius: 6px;
  cursor: pointer;
}

/* 체크박스는 원래 크기로 */
.hot-filter input {
  width: auto;
  margin: 0;
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

.hot-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
}

.empty-message {
  padding: 20px;
  text-align: center;
  color: #777777;
  background-color: white;
  border-radius: 7px;
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
