<script setup>
import { computed, onMounted, ref } from "vue";

import { RouterLink, useRoute } from "vue-router";

import { useConfigStore } from "@/stores/configStore";
import { fetchCurrentWeather, fetchWeatherForecast } from "@/services/weatherApi";

const route = useRoute();
const configStore = useConfigStore();

const selectedCity = ref(null);
const forecastList = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");

const cityLocations = [
  {
    id: "city_01",
    name: "서울특별시",
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    id: "city_02",
    name: "경기도 수원시",
    latitude: 37.2636,
    longitude: 127.0286,
  },
  {
    id: "city_03",
    name: "부산광역시",
    latitude: 35.1796,
    longitude: 129.0756,
  },
];

// 현재 설정된 단위에 맞게 온도 계산
const displayTemp = computed(() => {
  if (selectedCity.value === null) {
    return "";
  }

  const rawTemp = selectedCity.value.temp;

  if (configStore.unit === "fahrenheit") {
    return Math.round((rawTemp * 9) / 5 + 32);
  }

  return rawTemp;
});

// Pinia의 단위 설정에 맞게 5일 예보 온도를 계산
const displayedForecastList = computed(() => {
  return forecastList.value.map((forecast) => {
    let convertedTemp = forecast.temp;

    if (configStore.unit === "fahrenheit") {
      convertedTemp = Math.round((forecast.temp * 9) / 5 + 32);
    }

    return {
      ...forecast,
      displayTemp: convertedTemp,
    };
  });
});

// 현재 주소의 cityId를 이용해 실제 날씨 요청
const loadWeatherDetail = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  selectedCity.value = null;
  forecastList.value = [];

  const cityId = route.params.cityId;

  const city = cityLocations.find((item) => item.id === cityId);

  if (!city) {
    errorMessage.value = "해당 도시 정보를 찾을 수 없습니다.";

    isLoading.value = false;

    return;
  }

  try {
    const [currentData, forecastData] = await Promise.all([
      fetchCurrentWeather(city.latitude, city.longitude),
      fetchWeatherForecast(city.latitude, city.longitude),
    ]);

    selectedCity.value = {
      id: city.id,
      name: city.name,
      temp: Math.round(currentData.main.temp),
      status: currentData.weather[0]?.description ?? "정보 없음",
      humidity: currentData.main.humidity,
      windSpeed: currentData.wind?.speed ?? 0,
    };

    // 3시간 간격 예보에서 8개마다 하나씩 골라 약 5일분을 표시
    forecastList.value = forecastData.list
      .filter((item, index) => index % 8 === 0)
      .slice(0, 5)
      .map((item) => {
        return {
          id: item.dt,
          date: new Date(item.dt * 1000).toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "short",
          }),
          temp: Math.round(item.main.temp),
          status: item.weather[0]?.description ?? "정보 없음",
        };
      });

    console.log("실제 상세 날씨:", selectedCity.value);
    console.log("5일 예보:", forecastList.value);
  } catch (error) {
    console.error("날씨 상세 요청 실패:", error);

    errorMessage.value =
      error.response?.data?.message ?? error.message ?? "날씨 정보를 가져오지 못했습니다.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadWeatherDetail();
});
</script>

<template>
  <main class="detail-page">
    <h1>📊 지역별 상세 기상 관측 정보</h1>

    <p v-if="isLoading">날씨 정보를 불러오는 중입니다...</p>

    <template v-else-if="selectedCity">
      <section class="weather-detail">
        <h2>현재 날씨</h2>

        <p>
          📍 지정 지역:
          <strong>{{ selectedCity.name }}</strong>
        </p>

        <p>
          실시간 기온:
          <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
        </p>

        <p>
          기상 현황:
          <strong>{{ selectedCity.status }}</strong>
        </p>

        <p>
          대기 습도:
          <strong>{{ selectedCity.humidity }}%</strong>
        </p>

        <p>
          현재 풍속:
          <strong>{{ selectedCity.windSpeed }}m/s</strong>
        </p>
      </section>

      <section class="forecast-section">
        <h2>📅 5일 날씨 예보</h2>

        <div class="forecast-list">
          <article
            v-for="forecast in displayedForecastList"
            :key="forecast.id"
            class="forecast-card"
          >
            <strong>{{ forecast.date }}</strong>
            <p>{{ forecast.displayTemp }}{{ configStore.unitSymbol }}</p>
            <p>{{ forecast.status }}</p>
          </article>
        </div>
      </section>
    </template>

    <section v-else class="city-not-found">
      <p>{{ errorMessage }}</p>

      <button @click="loadWeatherDetail">다시 불러오기</button>
    </section>

    <RouterLink to="/weather" class="back-link"> ← 메인 대시보드로 돌아가기 </RouterLink>
  </main>
</template>

<style scoped>
.detail-page {
  width: min(680px, calc(100% - 40px));
  margin: 40px auto;
  padding: 28px;
  background-color: white;
  border: 1px solid #dddddd;
  border-radius: 8px;
}

.detail-page h1 {
  margin-top: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #dddddd;
  font-size: 24px;
}

.weather-detail {
  margin: 20px 0;
  padding: 20px;
  background-color: #f4f6f8;
  border-radius: 8px;
}

.weather-detail p {
  margin: 8px 0;
}

.city-not-found {
  margin: 20px 0;
  padding: 20px;
  color: #d63031;
  background-color: #fff0f0;
  border-radius: 8px;
}

.forecast-section {
  margin: 20px 0;
}

.forecast-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 10px;
}

.forecast-card {
  padding: 12px;
  background-color: #eef6ff;
  border: 1px solid #cfe2f5;
  border-radius: 8px;
  text-align: center;
}

.forecast-card p {
  margin: 8px 0 0;
}

.back-link {
  display: inline-block;
  padding: 10px 14px;
  color: white;
  background-color: #34495e;
  border-radius: 6px;
  text-decoration: none;
}
</style>
