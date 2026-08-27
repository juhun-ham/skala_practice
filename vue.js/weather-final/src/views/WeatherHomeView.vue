<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { Refresh } from '@element-plus/icons-vue'

import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import TemperatureFilter from '@/components/exercise/TemperatureFilter.vue'
import { useConfigStore } from '@/stores/configStore'
import { fetchCurrentWeather } from '@/services/weatherApi'
import { getWeatherDisplay } from '@/utils/weatherDisplay'

const isLoading = ref(false)
const errorMessage = ref('')

// 자바스크립트로 주소 이동
const router = useRouter()
const configStore = useConfigStore()

// 검색어
const searchQuery = ref('')

// 더운 도시만 보기
const hotOnly = ref(false)

// 선택된 도시
const selectedCityInfo = ref(null)

// 전체 날씨 데이터
const weatherList = ref([])

const cityLocations = [
  {
    id: 'city_01',
    name: '서울',
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    id: 'city_02',
    name: '수원',
    latitude: 37.2636,
    longitude: 127.0286,
  },
  {
    id: 'city_03',
    name: '부산',
    latitude: 35.1796,
    longitude: 129.0756,
  },
]

const loadWeatherList = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const responses = await Promise.all(
      cityLocations.map((city) => {
        return fetchCurrentWeather(city.latitude, city.longitude)
      }),
    )

    weatherList.value = responses.map((data, index) => {
      const city = cityLocations[index]
      const apiWeather = data.weather[0]
      const weatherDisplay = getWeatherDisplay(apiWeather?.id, apiWeather?.description)

      return {
        id: city.id,
        name: city.name,
        temp: Math.round(data.main.temp),
        status: weatherDisplay.label,
        emoji: weatherDisplay.emoji,
        statusTagType: weatherDisplay.tagType,
        humidity: data.main.humidity,
      }
    })

    console.log('실제 날씨 목록:', weatherList.value)
  } catch (error) {
    console.error('날씨 목록 요청 실패:', error)

    errorMessage.value =
      error.response?.data?.message ?? error.message ?? '날씨 데이터를 가져오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadWeatherList()
})

// 검색어와 일치하는 도시 계산
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (query === '') {
    return weatherList.value
  }

  return weatherList.value.filter((weather) => weather.name.includes(query))
})

// 더운 도시만 보기 적용
const displayedWeatherList = computed(() => {
  if (hotOnly.value === false) {
    return filteredWeatherList.value
  }

  return filteredWeatherList.value.filter((weather) => weather.temp >= configStore.hotThreshold)
})

const averageTemp = computed(() => {
  if (weatherList.value.length === 0) return 0

  const total = weatherList.value.reduce((sum, weather) => sum + weather.temp, 0)
  const celsiusAverage = total / weatherList.value.length

  if (configStore.unit === 'fahrenheit') {
    return Math.round((celsiusAverage * 9) / 5 + 32)
  }

  return Math.round(celsiusAverage)
})

// 카드 선택 처리
const selectCity = (weather) => {
  selectedCityInfo.value = weather
}

// 상세보기 처리
const showDetail = (city) => {
  router.push(`/weather/${city.id}`)
}

// 검색어 받는 함수
const updateSearchQuery = (newQuery) => {
  searchQuery.value = newQuery
}

// 선택된 도시 감시
watch(selectedCityInfo, (newCity, oldCity) => {
  if (newCity === null) {
    return
  }

  console.log(`👁️ 선택 도시 변경: ${oldCity?.name ?? '선택 없음'} → ${newCity.name}`)
})

// 더운 도시 필터 감시
watch(hotOnly, (newValue) => {
  console.log(`🔥 더운 도시만 보기: ${newValue ? '켜짐' : '꺼짐'}`)
})

// 검색어 자동 감시
watchEffect(() => {
  console.log(`🤖 현재 검색어: "${searchQuery.value}"`)
})

// 체크박스 값을 받는 함수
const updateHotOnly = (newValue) => {
  hotOnly.value = newValue
}
</script>

<template>
  <main class="weather-page">
    <section class="dashboard-hero">
      <div class="hero-copy">
        <el-tag type="primary" effect="dark" round>LIVE WEATHER</el-tag>
        <h1>실시간 날씨 대시보드</h1>
        <p>OpenWeather 데이터를 이용해 지역별 현재 날씨를 한눈에 확인하세요.</p>
      </div>

      <div class="summary-grid">
        <el-statistic title="조회 도시" :value="weatherList.length" suffix="곳"></el-statistic>
        <el-statistic
          title="평균 기온"
          :value="averageTemp"
          :suffix="configStore.unitSymbol"
        ></el-statistic>
      </div>
    </section>

    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="updateSearchQuery" />
      <TemperatureFilter :hot-only="hotOnly" @update-hot-only="updateHotOnly" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <div class="list-heading">
        <div>
          <h2>지역별 실시간 날씨</h2>
          <p>마지막 요청을 기준으로 {{ displayedWeatherList.length }}개 도시를 표시합니다.</p>
        </div>

        <el-button
          :icon="Refresh"
          circle
          aria-label="날씨 새로고침"
          @click="loadWeatherList"
        ></el-button>
      </div>

      <el-skeleton v-if="isLoading" :rows="6" animated></el-skeleton>

      <div v-else-if="errorMessage">
        <el-alert
          title="날씨 데이터를 가져오지 못했습니다."
          :description="errorMessage"
          type="error"
          show-icon
          :closable="false"
        ></el-alert>
        <el-button class="retry-button" type="primary" @click="loadWeatherList">
          다시 불러오기
        </el-button>
      </div>

      <template v-else>
        <WeatherCard
          v-for="weather in displayedWeatherList"
          :key="weather.id"
          :city-item="weather"
          @select-card="selectCity"
          @click-detail="showDetail"
        />

        <el-empty
          v-if="displayedWeatherList.length === 0"
          description="검색 조건과 일치하는 도시가 없습니다."
        ></el-empty>
      </template>
    </BaseDashboardCard>

    <el-alert
      :title="
        selectedCityInfo
          ? `${selectedCityInfo.name}이 선택되었습니다.`
          : '카드를 클릭하거나 검색해 보세요.'
      "
      type="success"
      show-icon
      :closable="false"
    ></el-alert>
  </main>
</template>

<style scoped>
.weather-page {
  width: min(920px, 100%);
  margin: 0 auto;
}

.dashboard-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  margin-bottom: 24px;
  padding: 30px;
  color: white;
  background: #173b6c;
  border: 1px solid #173b6c;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgb(23 59 108 / 14%);
}

.dashboard-hero h1 {
  margin: 14px 0 6px;
  font-size: clamp(26px, 4vw, 38px);
}

.dashboard-hero p,
.list-heading p {
  margin: 0;
}

.dashboard-hero .hero-copy p {
  color: #dce8f7;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(110px, 1fr));
  gap: 12px;
}

.summary-grid :deep(.el-statistic) {
  min-width: 120px;
  padding: 14px;
  background: #ffffff;
  border-radius: 12px;
}

.summary-grid :deep(.el-statistic__head) {
  color: #64748b;
}

.summary-grid :deep(.el-statistic__content) {
  color: #173b6c;
  font-weight: 700;
}

.list-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.list-heading h2 {
  margin: 0 0 4px;
  font-size: 20px;
}

.list-heading p {
  color: #909399;
  font-size: 13px;
}

.retry-button {
  margin-top: 12px;
}

@media (max-width: 680px) {
  .dashboard-hero {
    align-items: stretch;
    flex-direction: column;
    padding: 22px;
  }
}
</style>
