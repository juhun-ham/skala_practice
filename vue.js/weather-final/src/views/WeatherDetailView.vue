<script setup>
import { computed, onMounted, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { useConfigStore } from '@/stores/configStore'
import { fetchCurrentWeather, fetchWeatherForecast } from '@/services/weatherApi'
import { getWeatherDisplay } from '@/utils/weatherDisplay'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const selectedCity = ref(null)
const hourlyForecastList = ref([])
const forecastList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const cityLocations = [
  {
    id: 'city_01',
    name: '서울특별시',
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    id: 'city_02',
    name: '경기도 수원시',
    latitude: 37.2636,
    longitude: 127.0286,
  },
  {
    id: 'city_03',
    name: '부산광역시',
    latitude: 35.1796,
    longitude: 129.0756,
  },
]

// 현재 설정된 단위에 맞게 온도 계산
const displayTemp = computed(() => {
  if (selectedCity.value === null) {
    return ''
  }

  const rawTemp = selectedCity.value.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})

// Pinia의 단위 설정에 맞게 5일 예보 온도를 계산
const displayedForecastList = computed(() => {
  return forecastList.value.map((forecast) => {
    let convertedTemp = forecast.temp

    if (configStore.unit === 'fahrenheit') {
      convertedTemp = Math.round((forecast.temp * 9) / 5 + 32)
    }

    return {
      ...forecast,
      displayTemp: convertedTemp,
    }
  })
})

const displayedHourlyForecastList = computed(() => {
  return hourlyForecastList.value.map((forecast) => ({
    ...forecast,
    displayTemp:
      configStore.unit === 'fahrenheit' ? Math.round((forecast.temp * 9) / 5 + 32) : forecast.temp,
  }))
})

// 현재 주소의 cityId를 이용해 실제 날씨 요청
const loadWeatherDetail = async () => {
  isLoading.value = true
  errorMessage.value = ''
  selectedCity.value = null
  hourlyForecastList.value = []
  forecastList.value = []

  const cityId = route.params.cityId

  const city = cityLocations.find((item) => item.id === cityId)

  if (!city) {
    errorMessage.value = '해당 도시 정보를 찾을 수 없습니다.'

    isLoading.value = false

    return
  }

  try {
    const [currentData, forecastData] = await Promise.all([
      fetchCurrentWeather(city.latitude, city.longitude),
      fetchWeatherForecast(city.latitude, city.longitude),
    ])

    const currentApiWeather = currentData.weather[0]
    const currentWeatherDisplay = getWeatherDisplay(
      currentApiWeather?.id,
      currentApiWeather?.description,
    )

    selectedCity.value = {
      id: city.id,
      name: city.name,
      temp: Math.round(currentData.main.temp),
      status: currentWeatherDisplay.label,
      emoji: currentWeatherDisplay.emoji,
      statusTagType: currentWeatherDisplay.tagType,
      humidity: currentData.main.humidity,
      windSpeed: currentData.wind?.speed ?? 0,
    }

    // 가까운 시간부터 3시간 간격으로 8개 예보를 표시
    hourlyForecastList.value = forecastData.list.slice(0, 8).map((item) => {
      const apiWeather = item.weather[0]
      const weatherDisplay = getWeatherDisplay(apiWeather?.id, apiWeather?.description)

      return {
        id: item.dt,
        time: new Date(item.dt * 1000).toLocaleTimeString('ko-KR', {
          hour: 'numeric',
        }),
        temp: Math.round(item.main.temp),
        rainProbability: Math.round((item.pop ?? 0) * 100),
        status: weatherDisplay.label,
        emoji: weatherDisplay.emoji,
      }
    })

    // 3시간 간격 예보에서 8개마다 하나씩 골라 약 5일분을 표시
    forecastList.value = forecastData.list
      .filter((item, index) => index % 8 === 0)
      .slice(0, 5)
      .map((item) => {
        const apiWeather = item.weather[0]
        const weatherDisplay = getWeatherDisplay(apiWeather?.id, apiWeather?.description)

        return {
          id: item.dt,
          date: new Date(item.dt * 1000).toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short',
          }),
          temp: Math.round(item.main.temp),
          status: weatherDisplay.label,
          emoji: weatherDisplay.emoji,
          statusTagType: weatherDisplay.tagType,
        }
      })

    console.log('실제 상세 날씨:', selectedCity.value)
    console.log('5일 예보:', forecastList.value)
  } catch (error) {
    console.error('날씨 상세 요청 실패:', error)

    errorMessage.value =
      error.response?.data?.message ?? error.message ?? '날씨 정보를 가져오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadWeatherDetail()
})
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
              <h2>
                <span class="current-weather-emoji" role="img" :aria-label="selectedCity.status">
                  {{ selectedCity.emoji }}
                </span>
                {{ selectedCity.name }}
              </h2>
              <p>OpenWeather 실시간 관측 데이터</p>
            </div>
            <el-tag :type="selectedCity.statusTagType" effect="dark" round>
              {{ selectedCity.status }}
            </el-tag>
          </div>
        </template>

        <div class="current-temperature">
          {{ displayTemp }}<small>{{ configStore.unitSymbol }}</small>
        </div>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="지정 지역">{{ selectedCity.name }}</el-descriptions-item>
          <el-descriptions-item label="기상 현황">{{ selectedCity.status }}</el-descriptions-item>
          <el-descriptions-item label="대기 습도"
            >{{ selectedCity.humidity }}%</el-descriptions-item
          >
          <el-descriptions-item label="현재 풍속"
            >{{ selectedCity.windSpeed }}m/s</el-descriptions-item
          >
        </el-descriptions>
      </el-card>

      <el-card class="content-card" shadow="never">
        <template #header>
          <div class="card-heading">
            <div>
              <h2>시간대별 예보</h2>
              <p>앞으로 24시간의 기온과 강수확률을 3시간 간격으로 확인하세요.</p>
            </div>
          </div>
        </template>

        <div class="hourly-scroll">
          <div
            v-for="(forecast, index) in displayedHourlyForecastList"
            :key="forecast.id"
            class="hourly-item"
            :class="{ 'is-current': index === 0 }"
          >
            <strong>{{ index === 0 ? '지금부터' : forecast.time }}</strong>
            <span class="hourly-emoji" role="img" :aria-label="forecast.status">
              {{ forecast.emoji }}
            </span>
            <b>{{ forecast.displayTemp }}{{ configStore.unitSymbol }}</b>
            <small>비 {{ forecast.rainProbability }}%</small>
          </div>
        </div>
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

        <div class="forecast-list">
          <div v-for="forecast in displayedForecastList" :key="forecast.id" class="forecast-row">
            <strong>{{ forecast.date }}</strong>
            <div class="forecast-condition">
              <span role="img" :aria-label="forecast.status">{{ forecast.emoji }}</span>
              <span>{{ forecast.status }}</span>
            </div>
            <b>{{ forecast.displayTemp }}{{ configStore.unitSymbol }}</b>
          </div>
        </div>
      </el-card>
    </template>

    <el-result
      v-else
      icon="error"
      title="날씨 정보를 표시할 수 없습니다."
      :sub-title="errorMessage"
    >
      <template #extra>
        <el-button type="primary" @click="loadWeatherDetail">다시 불러오기</el-button>
      </template>
    </el-result>

    <div class="page-action">
      <el-button size="large" @click="router.push('/weather')"
        >← 메인 대시보드로 돌아가기</el-button
      >
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
  background: #173b6c;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgb(23 59 108 / 14%);
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
  border: 1px solid #dce5f0;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgb(23 59 108 / 5%);
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

.current-weather-emoji {
  margin-right: 6px;
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

.hourly-scroll {
  display: grid;
  grid-template-columns: repeat(8, minmax(100px, 1fr));
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.hourly-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  padding: 16px 10px;
  background: #f4f7fb;
  border: 1px solid #dce5f0;
  border-radius: 12px;
  white-space: nowrap;
}

.hourly-item.is-current {
  color: #ffffff;
  background: #2458a6;
  border-color: #2458a6;
}

.hourly-item small {
  color: #64748b;
}

.hourly-item.is-current small {
  color: #dce8f7;
}

.hourly-emoji {
  font-size: 28px;
}

.forecast-list {
  border-top: 1px solid #dce5f0;
}

.forecast-row {
  display: grid;
  grid-template-columns: minmax(150px, 1.4fr) minmax(150px, 1fr) 100px;
  align-items: center;
  gap: 16px;
  min-height: 66px;
  border-bottom: 1px solid #dce5f0;
}

.forecast-condition {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #475569;
}

.forecast-condition > span:first-child {
  font-size: 26px;
}

.forecast-row > b {
  color: #173b6c;
  font-size: 18px;
  text-align: right;
}

.page-action {
  margin-top: 24px;
  text-align: center;
}

@media (max-width: 620px) {
  .forecast-row {
    grid-template-columns: 1fr auto;
  }

  .forecast-condition {
    grid-column: 1 / -1;
    grid-row: 2;
    padding-bottom: 12px;
  }
}
</style>
