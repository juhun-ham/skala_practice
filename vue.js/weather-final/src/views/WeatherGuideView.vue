<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Refresh } from '@element-plus/icons-vue'
import { fetchAirQuality } from '@/services/airQualityApi'

const router = useRouter()

const selectedCityId = ref('city_01')
const airQualityData = ref(null)
const airQualityUnits = ref({})
const isLoading = ref(false)
const errorMessage = ref('')

const cityLocations = [
  { id: 'city_01', name: '서울', latitude: 37.5665, longitude: 126.978 },
  { id: 'city_02', name: '수원', latitude: 37.2636, longitude: 127.0286 },
  { id: 'city_03', name: '부산', latitude: 35.1796, longitude: 129.0756 },
]

const selectedCity = computed(() => {
  return cityLocations.find((city) => city.id === selectedCityId.value) ?? cityLocations[0]
})

const aqiStatus = computed(() => {
  const aqi = airQualityData.value?.us_aqi ?? 0

  if (aqi <= 50) return { label: '좋음', type: 'success', color: '#67c23a' }
  if (aqi <= 100) return { label: '보통', type: 'warning', color: '#e6a23c' }
  if (aqi <= 150) return { label: '민감군 주의', type: 'warning', color: '#f97316' }
  if (aqi <= 200) return { label: '나쁨', type: 'danger', color: '#f56c6c' }
  if (aqi <= 300) return { label: '매우 나쁨', type: 'danger', color: '#8b5cf6' }

  return { label: '위험', type: 'danger', color: '#7f1d1d' }
})

const uvStatus = computed(() => {
  const uv = airQualityData.value?.uv_index ?? 0

  if (uv < 3) return { label: '낮음', type: 'success' }
  if (uv < 6) return { label: '보통', type: 'warning' }
  if (uv < 8) return { label: '높음', type: 'warning' }
  if (uv < 11) return { label: '매우 높음', type: 'danger' }

  return { label: '위험', type: 'danger' }
})

const actionGuide = computed(() => {
  if (!airQualityData.value) {
    return {
      type: 'info',
      title: '환경 데이터를 기다리고 있습니다.',
      description: '도시를 선택하면 현재 상태에 맞는 행동요령을 계산합니다.',
      actions: [],
    }
  }

  const aqi = airQualityData.value.us_aqi ?? 0
  const uv = airQualityData.value.uv_index ?? 0
  const actions = []

  if (aqi > 150) {
    actions.push('야외 활동을 줄이고 외출 시 보건용 마스크를 준비하세요.')
    actions.push('어린이·노약자·호흡기 질환자는 실내 활동을 권장합니다.')
  } else if (aqi > 100) {
    actions.push('민감군은 장시간 또는 무리한 야외 활동을 줄이세요.')
  } else {
    actions.push('대기질은 야외 활동에 비교적 무난한 수준입니다.')
  }

  if (uv >= 8) {
    actions.push('한낮 외출을 피하고 모자·긴소매·자외선 차단제를 사용하세요.')
  } else if (uv >= 6) {
    actions.push('외출 전 자외선 차단제를 바르고 그늘을 이용하세요.')
  } else if (uv >= 3) {
    actions.push('장시간 야외 활동 시 기본적인 자외선 차단을 권장합니다.')
  }

  if (aqi > 150 || uv >= 8) {
    return {
      type: 'error',
      title: `${selectedCity.value.name}은 오늘 야외 활동에 주의가 필요합니다.`,
      description: '공기질 또는 자외선 지수가 높습니다. 아래 행동요령을 확인하세요.',
      actions,
    }
  }

  if (aqi > 100 || uv >= 6) {
    return {
      type: 'warning',
      title: `${selectedCity.value.name}은 일부 환경 지표에 주의가 필요합니다.`,
      description: '민감군과 장시간 야외 활동자는 주의하세요.',
      actions,
    }
  }

  return {
    type: 'success',
    title: `${selectedCity.value.name}은 야외 활동이 비교적 무난합니다.`,
    description: '현재 공기질과 자외선 지수를 기준으로 계산한 안내입니다.',
    actions,
  }
})

const formattedUpdateTime = computed(() => {
  const time = airQualityData.value?.time

  if (!time) return '-'

  return new Date(time).toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const loadAirQuality = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await fetchAirQuality(selectedCity.value.latitude, selectedCity.value.longitude)

    airQualityData.value = result.current
    airQualityUnits.value = result.units ?? {}
  } catch (error) {
    console.error('공기질 API 요청 실패:', error)
    airQualityData.value = null
    errorMessage.value =
      error.response?.data?.reason ?? error.message ?? '환경 데이터를 가져오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

watch(selectedCityId, loadAirQuality, { immediate: true })

const weatherTips = [
  {
    id: 1,
    icon: '☀️',
    title: '더운 날',
    content: '물을 자주 마시고 야외 활동을 줄이세요.',
    checklist: ['물병 챙기기', '자외선 차단제 사용', '한낮 야외 활동 줄이기'],
  },
  {
    id: 2,
    icon: '🌧️',
    title: '비 오는 날',
    content: '우산을 준비하고 미끄러운 길을 조심하세요.',
    checklist: ['우산 준비', '미끄럼 방지 신발', '교통 지연 확인'],
  },
  {
    id: 3,
    icon: '💨',
    title: '바람이 강한 날',
    content: '간판과 낙하물을 주의하세요.',
    checklist: ['창문 잠금 확인', '야외 물건 고정', '낙하물 주의'],
  },
]
</script>

<template>
  <main class="guide-page">
    <section class="guide-hero">
      <el-tag type="warning" effect="dark" round>WEATHER GUIDE</el-tag>
      <h1>날씨별 생활 가이드</h1>
      <p>날씨 상황에 맞는 준비 사항을 확인하고 더 안전한 하루를 계획하세요.</p>
    </section>

    <el-alert
      title="실시간 기상특보는 기상청 등 공식 기관의 안내를 우선 확인하세요."
      type="info"
      show-icon
      :closable="false"
      class="guide-alert"
    ></el-alert>

    <el-card class="live-guide-card" shadow="never">
      <template #header>
        <div class="live-guide-header">
          <div>
            <h2>지역별 실시간 환경 가이드</h2>
            <p>도시를 선택하면 공기질과 자외선 데이터를 다시 불러옵니다.</p>
          </div>

          <div class="city-controls">
            <el-select v-model="selectedCityId" size="large" aria-label="환경 정보를 조회할 도시">
              <el-option
                v-for="city in cityLocations"
                :key="city.id"
                :label="city.name"
                :value="city.id"
              ></el-option>
            </el-select>

            <el-button
              type="primary"
              size="large"
              :icon="Refresh"
              :loading="isLoading"
              @click="loadAirQuality"
            >
              새로고침
            </el-button>
          </div>
        </div>
      </template>

      <el-skeleton v-if="isLoading" :rows="6" animated></el-skeleton>

      <div v-else-if="errorMessage" class="guide-error">
        <el-alert
          title="환경 데이터를 가져오지 못했습니다."
          :description="errorMessage"
          type="error"
          show-icon
          :closable="false"
        ></el-alert>
        <el-button type="primary" @click="loadAirQuality">다시 시도</el-button>
      </div>

      <template v-else-if="airQualityData">
        <div class="data-summary">
          <span>
            📍 <strong>{{ selectedCity.name }}</strong>
          </span>
          <span>업데이트: {{ formattedUpdateTime }}</span>
        </div>

        <el-row :gutter="14">
          <el-col :xs="24" :sm="12" :lg="6">
            <el-card class="metric-card" shadow="hover">
              <div class="metric-heading">
                <span>통합 대기질</span>
                <el-tag :type="aqiStatus.type" effect="dark" round>{{ aqiStatus.label }}</el-tag>
              </div>
              <el-statistic
                title="US AQI"
                :value="Math.round(airQualityData.us_aqi ?? 0)"
              ></el-statistic>
            </el-card>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="6">
            <el-card class="metric-card" shadow="hover">
              <div class="metric-heading">
                <span>미세먼지</span>
                <el-tag effect="plain">PM10</el-tag>
              </div>
              <el-statistic
                :value="Math.round(airQualityData.pm10 ?? 0)"
                :suffix="airQualityUnits.pm10 ?? 'μg/m³'"
              ></el-statistic>
            </el-card>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="6">
            <el-card class="metric-card" shadow="hover">
              <div class="metric-heading">
                <span>초미세먼지</span>
                <el-tag effect="plain">PM2.5</el-tag>
              </div>
              <el-statistic
                :value="Math.round(airQualityData.pm2_5 ?? 0)"
                :suffix="airQualityUnits.pm2_5 ?? 'μg/m³'"
              ></el-statistic>
            </el-card>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="6">
            <el-card class="metric-card" shadow="hover">
              <div class="metric-heading">
                <span>자외선 지수</span>
                <el-tag :type="uvStatus.type" effect="dark" round>{{ uvStatus.label }}</el-tag>
              </div>
              <el-statistic
                :value="Number((airQualityData.uv_index ?? 0).toFixed(1))"
                :suffix="airQualityUnits.uv_index ?? ''"
              ></el-statistic>
            </el-card>
          </el-col>
        </el-row>

        <section class="action-guide">
          <el-alert
            :title="actionGuide.title"
            :description="actionGuide.description"
            :type="actionGuide.type"
            show-icon
            :closable="false"
          ></el-alert>

          <div class="action-list">
            <h3>오늘의 행동요령</h3>
            <ul>
              <li v-for="action in actionGuide.actions" :key="action">{{ action }}</li>
            </ul>
          </div>
        </section>

        <p class="data-source">
          데이터 출처:
          <a href="https://open-meteo.com/en/docs/air-quality-api" target="_blank" rel="noopener">
            Open-Meteo Air Quality API
          </a>
        </p>
      </template>
    </el-card>

    <div class="section-heading">
      <h2>상황별 기본 행동요령</h2>
      <p>실시간 수치와 함께 날씨 상황별 기본 준비 사항도 확인하세요.</p>
    </div>

    <el-row :gutter="18">
      <el-col v-for="tip in weatherTips" :key="tip.id" :xs="24" :md="8">
        <el-card class="tip-card" shadow="hover">
          <span class="tip-icon">{{ tip.icon }}</span>
          <h2>{{ tip.title }}</h2>
          <p>{{ tip.content }}</p>

          <el-divider></el-divider>

          <el-check-tag v-for="item in tip.checklist" :key="item" checked class="check-tag">
            {{ item }}
          </el-check-tag>
        </el-card>
      </el-col>
    </el-row>

    <div class="page-action">
      <el-button type="primary" size="large" @click="router.push('/weather')">
        날씨 대시보드로 돌아가기
      </el-button>
    </div>
  </main>
</template>

<style scoped>
.guide-page {
  width: min(1040px, 100%);
  margin: 0 auto;
}

.guide-hero {
  margin-bottom: 20px;
  padding: 34px;
  color: white;
  background: #173b6c;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgb(23 59 108 / 14%);
}

.guide-hero h1 {
  margin: 12px 0 4px;
  font-size: clamp(28px, 5vw, 42px);
}

.guide-hero p {
  margin: 0;
}

.guide-alert {
  margin-bottom: 18px;
}

.live-guide-card {
  margin-bottom: 30px;
  border: 1px solid #dce5f0;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgb(23 59 108 / 5%);
}

.live-guide-header,
.city-controls,
.metric-heading,
.data-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.live-guide-header h2,
.live-guide-header p,
.section-heading h2,
.section-heading p {
  margin: 0;
}

.live-guide-header p,
.section-heading p {
  margin-top: 4px;
  color: #909399;
}

.city-controls :deep(.el-select) {
  width: 150px;
}

.guide-error .el-button {
  margin-top: 12px;
}

.data-summary {
  margin-bottom: 16px;
  padding: 12px 14px;
  color: #606266;
  background: #f4f7fb;
  border: 1px solid #dce5f0;
  border-radius: 10px;
}

.metric-card {
  min-height: 148px;
  margin-bottom: 14px;
  border: 1px solid #dce5f0;
  border-radius: 12px;
}

.metric-heading {
  margin-bottom: 18px;
  color: #606266;
  font-weight: 600;
}

.action-guide {
  margin-top: 8px;
}

.action-list {
  margin-top: 14px;
  padding: 16px 20px;
  background: #f4f7fb;
  border: 1px solid #dce5f0;
  border-radius: 12px;
}

.action-list h3 {
  margin: 0 0 8px;
}

.action-list ul {
  margin: 0;
  padding-left: 20px;
}

.action-list li + li {
  margin-top: 6px;
}

.data-source {
  margin: 14px 0 0;
  color: #909399;
  font-size: 12px;
  text-align: right;
}

.data-source a {
  color: #409eff;
}

.section-heading {
  margin-bottom: 16px;
}

.tip-card {
  min-height: 320px;
  margin-bottom: 18px;
  border: 1px solid #dce5f0;
  border-radius: 14px;
}

.tip-card h2 {
  margin: 10px 0 6px;
}

.tip-card p {
  margin: 0;
  color: #606266;
}

.tip-icon {
  font-size: 38px;
}

.check-tag {
  display: block;
  margin-bottom: 8px;
  text-align: center;
}

.page-action {
  margin-top: 16px;
  text-align: center;
}

@media (max-width: 720px) {
  .live-guide-header,
  .city-controls,
  .data-summary {
    align-items: stretch;
    flex-direction: column;
  }

  .city-controls :deep(.el-select) {
    width: 100%;
  }
}
</style>
