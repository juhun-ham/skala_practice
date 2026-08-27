<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const developmentSteps = [
  {
    title: "과제 1 · Weather Mockup",
    description: "한 파일에서 v-for, v-if, v-model과 이벤트를 사용해 날씨 화면의 기본 기능을 구현했습니다.",
    skills: ["v-for", "v-if", "v-model", "event"],
  },
  {
    title: "과제 2 · Composition API",
    description: "ref, computed, watch, watchEffect로 검색·필터·선택 상태를 반응형으로 관리했습니다.",
    skills: ["ref", "computed", "watch", "watchEffect"],
  },
  {
    title: "과제 3 · Vue Components",
    description: "검색창, 공통 카드, 날씨 카드를 분리하고 props, emits, slot으로 서로 통신하게 만들었습니다.",
    skills: ["props", "emits", "slot", "scoped CSS"],
  },
  {
    title: "과제 4 · Vue Router",
    description: "대시보드·소개·가이드·도시 상세 페이지를 URL로 연결하고 404 화면을 추가했습니다.",
    skills: ["RouterLink", "RouterView", "동적 경로", "404"],
  },
  {
    title: "과제 5 · Pinia Store",
    description: "어느 화면에서나 같은 섭씨·화씨 단위와 더움 기준을 사용하도록 전역 상태를 만들었습니다.",
    skills: ["state", "getters", "actions", "global state"],
  },
  {
    title: "최종 서비스 · Axios & OpenWeather",
    description: "Mock 데이터를 실제 날씨 API로 교체하고 로딩·오류 처리와 5일 예보 기능을 추가했습니다.",
    skills: ["Axios", "async/await", "OpenWeather API", "error handling"],
  },
];

const currentFeatures = [
  { icon: "🌍", title: "실시간 날씨", description: "서울·수원·부산의 최신 기상 데이터를 조회합니다." },
  { icon: "🔎", title: "즉시 검색", description: "한글을 입력하는 동시에 도시 목록을 필터링합니다." },
  { icon: "🌡️", title: "단위와 기준 설정", description: "섭씨·화씨를 전환하고 더움 기준 온도를 조절합니다." },
  { icon: "📅", title: "상세 예보", description: "도시별 현재 날씨와 5일 예보를 별도 URL에서 제공합니다." },
  { icon: "🧭", title: "SPA 라우팅", description: "새로고침 없이 대시보드·소개·가이드·상세 화면을 이동합니다." },
  { icon: "🛡️", title: "안정적인 요청", description: "API 로딩, 실패 안내와 다시 시도 기능을 제공합니다." },
];
</script>

<template>
  <main class="about-page">
    <section class="about-hero">
      <el-tag type="success" effect="dark" round>PROJECT STORY</el-tag>
      <h1>날씨 서비스가 만들어진 과정</h1>
      <p>작은 Vue 문법 실습에서 시작해 실제 API를 사용하는 하나의 서비스로 발전했습니다.</p>
    </section>

    <el-card class="story-card" shadow="never">
      <template #header>
        <div class="card-heading">
          <div>
            <h2>단계별 개발 기록</h2>
            <p>각 과제에서 배운 개념이 현재 서비스에 어떻게 연결됐는지 확인할 수 있습니다.</p>
          </div>
          <el-tag>{{ developmentSteps.length }}단계</el-tag>
        </div>
      </template>

      <el-timeline>
        <el-timeline-item
          v-for="(step, index) in developmentSteps"
          :key="step.title"
          :timestamp="`${index + 1}단계`"
          placement="top"
          :type="index === developmentSteps.length - 1 ? 'success' : 'primary'"
          :hollow="index !== developmentSteps.length - 1"
        >
          <div class="timeline-content">
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
            <div class="skill-tags">
              <el-tag v-for="skill in step.skills" :key="skill" size="small" effect="plain">
                {{ skill }}
              </el-tag>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <section class="feature-section">
      <div class="section-title">
        <div>
          <h2>현재 제공하는 기능</h2>
          <p>학습한 Vue 기능들이 실제 사용자 기능으로 연결된 결과입니다.</p>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col
          v-for="feature in currentFeatures"
          :key="feature.title"
          :xs="24"
          :sm="12"
          :lg="8"
        >
          <el-card class="feature-card" shadow="hover">
            <span class="feature-icon">{{ feature.icon }}</span>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <div class="page-action">
      <el-button type="primary" size="large" @click="router.push('/weather')">
        실시간 대시보드 보기
      </el-button>
    </div>
  </main>
</template>

<style scoped>
.about-page {
  width: min(1040px, 100%);
  margin: 0 auto;
}

.about-hero {
  margin-bottom: 24px;
  padding: 36px;
  color: white;
  background: linear-gradient(135deg, #0f766e, #34d399);
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(15, 118, 110, 0.16);
}

.about-hero h1 {
  margin: 14px 0 6px;
  font-size: clamp(28px, 5vw, 42px);
}

.about-hero p,
.card-heading p,
.section-title p,
.timeline-content p,
.feature-card p {
  margin: 0;
}

.story-card {
  border-radius: 16px;
}

.card-heading,
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.card-heading h2,
.section-title h2,
.timeline-content h3,
.feature-card h3 {
  margin: 0;
}

.card-heading p,
.section-title p,
.timeline-content p,
.feature-card p {
  margin-top: 5px;
  color: #606266;
}

.timeline-content {
  padding: 14px 16px;
  background: #f8fafc;
  border: 1px solid #ebeef5;
  border-radius: 12px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.feature-section {
  margin-top: 32px;
}

.section-title {
  margin-bottom: 16px;
}

.feature-card {
  min-height: 180px;
  margin-bottom: 16px;
  border-radius: 14px;
}

.feature-icon {
  display: block;
  margin-bottom: 14px;
  font-size: 30px;
}

.page-action {
  margin-top: 16px;
  text-align: center;
}
</style>
