<script setup>
import { computed, onMounted, ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import { useConfigStore } from "@/stores/configStore";
import { fetchCurrentWeather, fetchWeatherForecast } from "@/services/weatherApi";

const route = useRoute();
const router = useRouter();
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
    <section class="detail-hero">
      <el-tag effect="dark" round>WEATHER DETAIL</el-tag>
      <h1>지역별 상세 기상 관측 정보</h1>
      <p>실시간 관측값과 앞으로의 날씨 흐름을 확인할 수 있습니다.</p>
    </section>

    <el-card v-if="isLoading" class="content-card" shadow="never">
      <el-skeleton :rows="8" animated></el-skeleton>
    </el-card>

    <template v-else-if="selectedCity">
      <el-card class="content-card" shadow="never">
        <template #header>
          <div class="card-heading">
            <div>
              <h2>{{ selectedCity.name }}</h2>
              <p>OpenWeather 실시간 관측 데이터</p>
            </div>
            <el-tag type="success" effect="dark" round>{{ selectedCity.status }}</el-tag>
          </div>
        </template>

        <div class="current-temperature">
          {{ displayTemp }}<small>{{ configStore.unitSymbol }}</small>
        </div>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="지정 지역">{{ selectedCity.name }}</el-descriptions-item>
          <el-descriptions-item label="기상 현황">{{ selectedCity.status }}</el-descriptions-item>
          <el-descriptions-item label="대기 습도">{{ selectedCity.humidity }}%</el-descriptions-item>
          <el-descriptions-item label="현재 풍속">{{ selectedCity.windSpeed }}m/s</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="content-card" shadow="never">
        <template #header>
          <div class="card-heading">
            <div>
              <h2>5일 날씨 예보</h2>
              <p>3시간 간격 예보에서 날짜별 대표 데이터를 표시합니다.</p>
            </div>
          </div>
        </template>

        <el-row :gutter="12">
          <el-col
            v-for="forecast in displayedForecastList"
            :key="forecast.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="4"
          >
            <el-card class="forecast-card" shadow="hover">
              <strong>{{ forecast.date }}</strong>
              <p class="forecast-temperature">
                {{ forecast.displayTemp }}{{ configStore.unitSymbol }}
              </p>
              <el-tag effect="plain" round>{{ forecast.status }}</el-tag>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </template>

    <el-result v-else icon="error" title="날씨 정보를 표시할 수 없습니다." :sub-title="errorMessage">
      <template #extra>
        <el-button type="primary" @click="loadWeatherDetail">다시 불러오기</el-button>
      </template>
    </el-result>

    <div class="page-action">
      <el-button size="large" @click="router.push('/weather')">← 메인 대시보드로 돌아가기</el-button>
    </div>
  </main>
</template>

<style scoped>
.detail-page {
  width: min(1040px, 100%);
  margin: 0 auto;
}

.detail-hero {
  margin-bottom: 20px;
  padding: 30px;
  color: white;
  background: linear-gradient(135deg, #4338ca, #60a5fa);
  border-radius: 18px;
}

.detail-hero h1 {
  margin: 12px 0 4px;
  font-size: clamp(26px, 4vw, 38px);
}

.detail-hero p,
.card-heading p {
  margin: 0;
}

.content-card {
  margin-bottom: 18px;
  border-radius: 16px;
}

.card-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.card-heading h2 {
  margin: 0;
}

.card-heading p {
  margin-top: 3px;
  color: #909399;
}

.current-temperature {
  margin-bottom: 22px;
  color: #2563eb;
  font-size: 54px;
  font-weight: 700;
}

.current-temperature small {
  margin-left: 4px;
  color: #909399;
  font-size: 22px;
}

.forecast-card {
  min-height: 150px;
  margin-bottom: 12px;
  text-align: center;
}

.forecast-temperature {
  margin: 12px 0;
  color: #2563eb;
  font-size: 24px;
  font-weight: 700;
}

.page-action {
  margin-top: 24px;
  text-align: center;
}
</style>
