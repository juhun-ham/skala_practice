<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const weatherTips = [
  {
    id: 1,
    icon: "☀️",
    title: "더운 날",
    content: "물을 자주 마시고 야외 활동을 줄이세요.",
    checklist: ["물병 챙기기", "자외선 차단제 사용", "한낮 야외 활동 줄이기"],
  },
  {
    id: 2,
    icon: "🌧️",
    title: "비 오는 날",
    content: "우산을 준비하고 미끄러운 길을 조심하세요.",
    checklist: ["우산 준비", "미끄럼 방지 신발", "교통 지연 확인"],
  },
  {
    id: 3,
    icon: "💨",
    title: "바람이 강한 날",
    content: "간판과 낙하물을 주의하세요.",
    checklist: ["창문 잠금 확인", "야외 물건 고정", "낙하물 주의"],
  },
];
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
  background: linear-gradient(135deg, #c2410c, #fbbf24);
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(194, 65, 12, 0.15);
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

.tip-card {
  min-height: 320px;
  margin-bottom: 18px;
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
</style>
