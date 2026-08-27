<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";

import BaseDashboardCard from "@/components/exercise/BaseDashboardCard.vue";
import SearchBar from "@/components/exercise/SearchBar.vue";
import WeatherCard from "@/components/exercise/WeatherCard.vue";
import TemperatureFilter from "@/components/exercise/TemperatureFilter.vue";
import { useConfigStore } from "@/stores/configStore";
import { fetchCurrentWeather } from "@/services/weatherApi";

const isLoading = ref(false);
const errorMessage = ref("");

// 자바스크립트로 주소 이동
const router = useRouter();
const configStore = useConfigStore();

// 검색어
const searchQuery = ref("");

// 더운 도시만 보기
const hotOnly = ref(false);

// 선택된 도시
const selectedCityInfo = ref(null);

// 전체 날씨 데이터
const weatherList = ref([]);

const cityLocations = [
  {
    id: "city_01",
    name: "서울",
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    id: "city_02",
    name: "수원",
    latitude: 37.2636,
    longitude: 127.0286,
  },
  {
    id: "city_03",
    name: "부산",
    latitude: 35.1796,
    longitude: 129.0756,
  },
];

const loadWeatherList = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const responses = await Promise.all(
      cityLocations.map((city) => {
        return fetchCurrentWeather(city.latitude, city.longitude);
      }),
    );

    weatherList.value = responses.map((data, index) => {
      const city = cityLocations[index];

      return {
        id: city.id,
        name: city.name,
        temp: Math.round(data.main.temp),
        status: data.weather[0]?.description ?? "정보 없음",
        humidity: data.main.humidity,
      };
    });

    console.log("실제 날씨 목록:", weatherList.value);
  } catch (error) {
    console.error("날씨 목록 요청 실패:", error);

    errorMessage.value =
      error.response?.data?.message ?? error.message ?? "날씨 데이터를 가져오지 못했습니다.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadWeatherList();
});

// 검색어와 일치하는 도시 계산
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim();

  if (query === "") {
    return weatherList.value;
  }

  return weatherList.value.filter((weather) => weather.name.includes(query));
});

// 더운 도시만 보기 적용
const displayedWeatherList = computed(() => {
  if (hotOnly.value === false) {
    return filteredWeatherList.value;
  }

  return filteredWeatherList.value.filter((weather) => weather.temp >= configStore.hotThreshold);
});

// 카드 선택 처리
const selectCity = (weather) => {
  selectedCityInfo.value = weather;
};

// 상세보기 처리
const showDetail = (city) => {
  router.push(`/weather/${city.id}`);
};

// 검색어 받는 함수
const updateSearchQuery = (newQuery) => {
  searchQuery.value = newQuery;
};

// 선택된 도시 감시
watch(selectedCityInfo, (newCity, oldCity) => {
  if (newCity === null) {
    return;
  }

  console.log(`👁️ 선택 도시 변경: ${oldCity?.name ?? "선택 없음"} → ${newCity.name}`);
});

// 더운 도시 필터 감시
watch(hotOnly, (newValue) => {
  console.log(`🔥 더운 도시만 보기: ${newValue ? "켜짐" : "꺼짐"}`);
});

// 검색어 자동 감시
watchEffect(() => {
  console.log(`🤖 현재 검색어: "${searchQuery.value}"`);
});

// 체크박스 값을 받는 함수
const updateHotOnly = (newValue) => {
  hotOnly.value = newValue;
};
</script>

<template>
  <main class="weather-page">
    <h1>🌤️ 과제 6: 실시간 날씨 (Axios)</h1>

    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="updateSearchQuery" />
      <TemperatureFilter :hot-only="hotOnly" @update-hot-only="updateHotOnly" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 실시간 날씨 현황</h3>

      <p v-if="isLoading">날씨 데이터를 불러오는 중입니다...</p>

      <div v-else-if="errorMessage" class="error-message">
        <p>날씨 요청 실패: {{ errorMessage }}</p>

        <button @click="loadWeatherList">다시 불러오기</button>
      </div>

      <template v-else>
        <WeatherCard
          v-for="weather in displayedWeatherList"
          :key="weather.id"
          :city-item="weather"
          @select-card="selectCity"
          @click-detail="showDetail"
        />

        <p v-if="displayedWeatherList.length === 0">검색 조건과 일치하는 도시가 없습니다.</p>
      </template>
    </BaseDashboardCard>

    <div class="status-bar">
      {{
        selectedCityInfo
          ? `${selectedCityInfo.name}이 선택되었습니다.`
          : "카드를 클릭하거나 검색해 보세요."
      }}
    </div>
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

.assignment-ready {
  padding: 18px;
  background-color: #f7f9fb;
  border: 1px solid #e2e6ea;
  border-radius: 8px;
}

.assignment-ready h2 {
  margin-top: 0;
}

.assignment-ready p {
  margin-bottom: 0;
}

.status-bar {
  padding: 12px;
  color: #218838;
  background-color: #e4f7e8;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}

.error-message {
  padding: 14px;
  color: #d63031;
  background-color: #fff0f0;
  border-radius: 8px;
}

.error-message button {
  padding: 8px 12px;
  cursor: pointer;
}
</style>
