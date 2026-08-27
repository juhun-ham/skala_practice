<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('overview')
const activeStep = ref(0)

const developmentSteps = [
  {
    title: '과제 1 · Weather Mockup',
    description:
      '한 파일에서 v-for, v-if, v-model과 이벤트를 사용해 날씨 화면의 기본 기능을 구현했습니다.',
    result: '정적인 데이터가 검색·선택에 반응하는 첫 날씨 대시보드',
    skills: ['v-for', 'v-if', 'v-model', 'event'],
  },
  {
    title: '과제 2 · Composition API',
    description:
      'ref, computed, watch, watchEffect로 검색·필터·선택 상태를 반응형으로 관리했습니다.',
    result: '데이터가 바뀌면 화면도 자동으로 갱신되는 구조',
    skills: ['ref', 'computed', 'watch', 'watchEffect'],
  },
  {
    title: '과제 3 · Vue Components',
    description:
      '검색창, 공통 카드, 날씨 카드를 분리하고 props, emits, slot으로 서로 통신하게 만들었습니다.',
    result: '역할별로 나뉘어 재사용하고 관리하기 쉬운 화면',
    skills: ['props', 'emits', 'slot', 'scoped CSS'],
  },
  {
    title: '과제 4 · Vue Router',
    description: '대시보드·소개·가이드·도시 상세 페이지를 URL로 연결하고 404 화면을 추가했습니다.',
    result: '새로고침 없이 이동하는 SPA 날씨 서비스',
    skills: ['RouterLink', 'RouterView', '동적 경로', '404'],
  },
  {
    title: '과제 5 · Pinia Store',
    description:
      '모든 화면에서 같은 섭씨·화씨 단위와 더움 기준을 사용하도록 전역 상태를 만들었습니다.',
    result: '페이지를 이동해도 유지되는 공통 사용자 설정',
    skills: ['state', 'getters', 'actions', 'global state'],
  },
  {
    title: '최종 서비스 · API & UI',
    description:
      'OpenWeather와 Open-Meteo를 연결하고 환경 행동요령과 Element Plus 기반 반응형 UI를 추가했습니다.',
    result: '실제 외부 데이터를 활용하는 완성형 생활 날씨 서비스',
    skills: ['Axios', 'OpenWeather', 'Open-Meteo', 'Element Plus'],
  },
]

const currentFeatures = [
  {
    icon: '🌍',
    title: '실시간 날씨',
    description: '서울·수원·부산의 최신 기상 데이터를 조회합니다.',
  },
  {
    icon: '🔎',
    title: '즉시 검색',
    description: '한글을 입력하는 동시에 도시 목록을 필터링합니다.',
  },
  {
    icon: '🌡️',
    title: '사용자 설정',
    description: '섭씨·화씨를 전환하고 더움 기준 온도를 조절합니다.',
  },
  {
    icon: '🕒',
    title: '시간별·5일 예보',
    description: '가까운 시간부터 앞으로의 날씨 흐름을 비교합니다.',
  },
  {
    icon: '🌿',
    title: '환경 정보',
    description: '도시별 AQI·미세먼지·초미세먼지·자외선을 조회합니다.',
  },
  {
    icon: '🧴',
    title: '맞춤 행동요령',
    description: '환경 수치에 따라 오늘 필요한 행동을 자동 계산합니다.',
  },
  {
    icon: '🧭',
    title: 'SPA 라우팅',
    description: '새로고침 없이 소개·가이드·상세 화면을 이동합니다.',
  },
  {
    icon: '🛡️',
    title: '안정적인 요청',
    description: '로딩·오류·빈 결과와 다시 시도 상태를 제공합니다.',
  },
]

const apiSources = [
  { name: 'OpenWeather', role: '현재 날씨와 시간별·5일 예보', badge: '기상 데이터' },
  { name: 'Open-Meteo', role: 'AQI, 미세먼지, 초미세먼지, 자외선', badge: '환경 데이터' },
  { name: 'Pinia Store', role: '단위와 더움 기준을 모든 화면에서 공유', badge: '전역 설정' },
]
</script>

<template>
  <main class="about-page">
    <section class="about-hero">
      <el-tag type="primary" effect="dark" round>WEATHER DESK</el-tag>
      <h1>날씨를 확인하고, 오늘의 행동까지 결정하세요.</h1>
      <p>
        기상 예보와 생활 환경 데이터를 한 화면에 모아 어려운 수치를 쉬운 말과 행동요령으로 전달하는
        Vue 기반 날씨 서비스입니다.
      </p>
    </section>

    <el-card class="about-shell" shadow="never">
      <el-tabs v-model="activeTab" class="about-tabs" stretch>
        <el-tab-pane label="서비스 개요" name="overview">
          <section class="tab-section overview-layout">
            <div class="overview-copy">
              <span class="eyebrow">SERVICE MISSION</span>
              <h2>숫자를 보여주는 데서 끝나지 않는 날씨 서비스</h2>
              <p>
                현재 기온뿐 아니라 시간별 변화, 5일 예보, 공기질과 자외선을 함께 제공합니다.
                사용자는 여러 사이트를 오가지 않고 오늘 무엇을 준비할지 판단할 수 있습니다.
              </p>
              <el-button type="primary" size="large" @click="router.push('/weather')"
                >실시간 날씨 확인하기</el-button
              >
            </div>
            <div class="service-summary">
              <div><strong>3</strong><span>조회 도시</span></div>
              <div><strong>2</strong><span>외부 API</span></div>
              <div><strong>6</strong><span>개발 단계</span></div>
              <div><strong>1</strong><span>통합 서비스</span></div>
            </div>
          </section>
          <section class="data-section">
            <h2>서비스를 구성하는 데이터</h2>
            <div class="source-list">
              <div v-for="source in apiSources" :key="source.name" class="source-row">
                <el-tag effect="plain">{{ source.badge }}</el-tag>
                <strong>{{ source.name }}</strong>
                <span>{{ source.role }}</span>
              </div>
            </div>
          </section>
        </el-tab-pane>

        <el-tab-pane label="현재 기능" name="features">
          <section class="tab-section">
            <div class="section-title">
              <h2>현재 제공하는 기능</h2>
              <p>학습한 Vue 개념이 실제 사용자 기능으로 연결된 결과입니다.</p>
            </div>
            <div class="feature-grid">
              <article v-for="feature in currentFeatures" :key="feature.title" class="feature-card">
                <span class="feature-icon">{{ feature.icon }}</span>
                <div>
                  <h3>{{ feature.title }}</h3>
                  <p>{{ feature.description }}</p>
                </div>
              </article>
            </div>
          </section>
        </el-tab-pane>

        <el-tab-pane label="개발 과정" name="development">
          <section class="tab-section">
            <div class="section-title">
              <h2>단계별 개발 기록</h2>
              <p>왼쪽 단계를 선택하면 그 과정에서 배운 내용과 결과만 볼 수 있습니다.</p>
            </div>
            <div class="development-layout">
              <nav class="step-navigation" aria-label="개발 단계">
                <button
                  v-for="(step, index) in developmentSteps"
                  :key="step.title"
                  type="button"
                  :class="{ active: activeStep === index }"
                  @click="activeStep = index"
                >
                  <span>{{ index + 1 }}</span
                  >{{ step.title }}
                </button>
              </nav>
              <article class="step-detail">
                <div class="step-status">
                  <span>STEP {{ activeStep + 1 }}</span>
                  <el-tag
                    :type="activeStep === developmentSteps.length - 1 ? 'success' : 'primary'"
                    >{{ activeStep === developmentSteps.length - 1 ? '현재' : '완료' }}</el-tag
                  >
                </div>
                <h3>{{ developmentSteps[activeStep].title }}</h3>
                <p>{{ developmentSteps[activeStep].description }}</p>
                <div class="result-box">
                  <small>이 단계의 결과</small
                  ><strong>{{ developmentSteps[activeStep].result }}</strong>
                </div>
                <div class="skill-tags">
                  <el-tag
                    v-for="skill in developmentSteps[activeStep].skills"
                    :key="skill"
                    effect="plain"
                    >{{ skill }}</el-tag
                  >
                </div>
              </article>
            </div>
          </section>
        </el-tab-pane>

        <el-tab-pane label="기술 구조" name="architecture">
          <section class="tab-section">
            <div class="section-title">
              <h2>데이터가 화면에 도착하는 흐름</h2>
              <p>각 파일은 한 가지 역할에 집중하고 Vue가 그 사이를 연결합니다.</p>
            </div>
            <div class="architecture-flow">
              <div><span>1</span><strong>외부 API</strong><small>실제 날씨·환경 데이터</small></div>
              <b>→</b>
              <div>
                <span>2</span><strong>services</strong><small>Axios 요청과 응답 처리</small>
              </div>
              <b>→</b>
              <div>
                <span>3</span><strong>views</strong><small>데이터와 페이지 상태 관리</small>
              </div>
              <b>→</b>
              <div>
                <span>4</span><strong>components</strong><small>사용자에게 UI로 표시</small>
              </div>
            </div>
            <el-alert
              title="Pinia는 단위와 더움 기준처럼 여러 페이지가 함께 쓰는 설정을 별도로 관리합니다."
              type="info"
              :closable="false"
              show-icon
            />
          </section>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </main>
</template>

<style scoped>
.about-page {
  width: min(1080px, 100%);
  margin: 0 auto;
}
.about-hero {
  margin-bottom: 20px;
  padding: 40px;
  color: #fff;
  background: #173b6c;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgb(23 59 108 / 14%);
}
.about-hero h1 {
  max-width: none;
  margin: 16px 0 10px;
  font-size: clamp(28px, 3.2vw, 42px);
  line-height: 1.2;
  white-space: nowrap;
}
.about-hero p {
  max-width: none;
  margin: 0;
  color: #dce8f7;
  font-size: clamp(14px, 1.45vw, 17px);
  line-height: 1.7;
  white-space: nowrap;
}
.about-shell {
  border: 1px solid #dce5f0;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgb(23 59 108 / 5%);
}
.about-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
}
.about-tabs :deep(.el-tabs__item) {
  height: 56px;
  color: #475569;
  font-weight: 700;
}
.about-tabs :deep(.el-tabs__item.is-active) {
  color: #2458a6;
}
.tab-section {
  padding: 30px 8px 8px;
}
.overview-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr);
  align-items: center;
  gap: 40px;
}
.eyebrow {
  color: #2458a6;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
}
.overview-copy h2,
.section-title h2,
.data-section h2 {
  margin: 8px 0;
  color: #17233c;
}
.overview-copy p,
.section-title p {
  margin: 0 0 22px;
  color: #64748b;
  line-height: 1.7;
}
.service-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  overflow: hidden;
  background: #f4f7fb;
  border: 1px solid #dce5f0;
  border-radius: 14px;
}
.service-summary div {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 22px 12px;
  border-right: 1px solid #dce5f0;
  border-bottom: 1px solid #dce5f0;
}
.service-summary div:nth-child(2n) {
  border-right: none;
}
.service-summary div:nth-child(n + 3) {
  border-bottom: none;
}
.service-summary strong {
  color: #173b6c;
  font-size: 30px;
}
.service-summary span {
  color: #64748b;
  font-size: 13px;
}
.data-section {
  margin-top: 36px;
  padding: 28px 8px 8px;
  border-top: 1px solid #dce5f0;
}
.source-list {
  margin-top: 16px;
  border-top: 1px solid #dce5f0;
}
.source-row {
  display: grid;
  grid-template-columns: 110px 130px 1fr;
  align-items: center;
  gap: 16px;
  min-height: 62px;
  border-bottom: 1px solid #dce5f0;
}
.source-row > span:last-child {
  color: #64748b;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.feature-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border: 1px solid #dce5f0;
  border-radius: 12px;
}
.feature-icon {
  font-size: 28px;
}
.feature-card h3 {
  margin: 0 0 5px;
  color: #17233c;
}
.feature-card p {
  margin: 0;
  color: #64748b;
  line-height: 1.55;
}
.development-layout {
  display: grid;
  grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1.2fr);
  gap: 24px;
}
.step-navigation {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.step-navigation button {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 13px 14px;
  color: #475569;
  background: #fff;
  border: 1px solid #dce5f0;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
}
.step-navigation button span {
  display: grid;
  flex: none;
  width: 28px;
  height: 28px;
  place-items: center;
  color: #2458a6;
  background: #eaf1fb;
  border-radius: 50%;
  font-weight: 800;
}
.step-navigation button.active {
  color: #fff;
  background: #2458a6;
  border-color: #2458a6;
}
.step-navigation button.active span {
  color: #2458a6;
  background: #fff;
}
.step-detail {
  min-height: 390px;
  padding: 30px;
  background: #f4f7fb;
  border: 1px solid #dce5f0;
  border-radius: 14px;
}
.step-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.step-status > span {
  color: #2458a6;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
}
.step-detail h3 {
  margin: 34px 0 12px;
  color: #17233c;
  font-size: 26px;
}
.step-detail > p {
  color: #475569;
  line-height: 1.7;
}
.result-box {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin: 28px 0 18px;
  padding: 18px;
  background: #fff;
  border-left: 4px solid #2458a6;
}
.result-box small {
  color: #64748b;
}
.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.architecture-flow {
  display: grid;
  grid-template-columns: repeat(7, auto);
  align-items: center;
  gap: 12px;
  margin: 34px 0;
}
.architecture-flow div {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  min-height: 150px;
  padding: 20px 14px;
  background: #f4f7fb;
  border: 1px solid #dce5f0;
  border-radius: 12px;
  text-align: center;
}
.architecture-flow div > span {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  color: #fff;
  background: #2458a6;
  border-radius: 50%;
  font-weight: 700;
}
.architecture-flow small {
  color: #64748b;
  line-height: 1.5;
}
.architecture-flow > b {
  color: #8ba3c2;
  font-size: 24px;
}
@media (max-width: 760px) {
  .about-hero {
    padding: 28px 22px;
  }
  .about-hero h1,
  .about-hero p {
    white-space: normal;
  }
  .overview-layout,
  .development-layout,
  .feature-grid {
    grid-template-columns: 1fr;
  }
  .source-row {
    grid-template-columns: 1fr;
    gap: 7px;
    padding: 14px 0;
  }
  .architecture-flow {
    grid-template-columns: 1fr;
  }
  .architecture-flow > b {
    transform: rotate(90deg);
    text-align: center;
  }
}
</style>
