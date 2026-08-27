<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <main class="about-page">
    <h1>ℹ️ 날씨 서비스 소개</h1>

    <section class="about-content">
      <p>
        본 앱은 Vue 3와 Vue Router를 이용하여 만든
        지역별 날씨 조회 서비스입니다.
      </p>

      <ul>
        <li>도시 이름을 이용한 날씨 검색</li>
        <li>사용자가 정한 더움 기준에 따른 도시 필터링</li>
        <li>섭씨·화씨 단위 전환</li>
        <li>도시별 상세 기상 정보 제공</li>
        <li>OpenWeather API를 이용한 실시간 날씨와 예보 조회</li>
        <li>새로고침 없는 화면 전환</li>
      </ul>
    </section>

    <RouterLink
      to="/weather"
      class="home-link"
    >
      날씨 대시보드로 돌아가기
    </RouterLink>
  </main>
</template>

<style scoped>
.about-page {
  width: min(680px, calc(100% - 40px));
  margin: 40px auto;
  padding: 28px;
  background-color: white;
  border: 1px solid #dddddd;
  border-radius: 8px;
}

.about-page h1 {
  margin-top: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #dddddd;
  font-size: 24px;
}

.about-content {
  margin: 20px 0;
  padding: 20px;
  background-color: #f4f6f8;
  border-radius: 8px;
}

.about-content li {
  margin: 8px 0;
}

.home-link {
  display: block;
  padding: 12px;
  color: white;
  background-color: #0ea5e9;
  border-radius: 6px;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
}
</style>
