<script setup>
import { ref } from "vue";
import axios from "axios";

const weatherData = ref(null);
const isLoading = ref(false);
const errorMessage = ref("");

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const handleFetchWeather = async () => {
  if (!API_KEY) {
    errorMessage.value = ".env.local에 OpenWeatherMap API 키를 설정하세요.";

    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  weatherData.value = null;

  try {
    const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        lat: 35.158582,
        lon: 126.804975,
        appid: API_KEY,
        units: "metric",
        lang: "kr",
      },
    });

    console.log("Axios 응답 전체 객체:", response);

    console.log("핵심 날씨 데이터:", response.data);

    weatherData.value = response.data;
  } catch (error) {
    console.error("날씨 통신 오류:", error);

    errorMessage.value = error.response?.data?.message ?? "날씨 데이터를 가져오지 못했습니다.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="practice-section">
    <h2>⚡ Axios 통신 검증</h2>

    <button :disabled="isLoading" @click="handleFetchWeather">
      {{ isLoading ? "데이터 로딩 중..." : "실시간 날씨 데이터 가져오기" }}
    </button>

    <div v-if="weatherData" class="result-card">
      <p>
        📍 위치:
        <strong>{{ weatherData.name }}</strong>
      </p>

      <p>
        🌡️ 현재 기온:
        <strong> {{ weatherData.main.temp }}℃ </strong>
      </p>

      <p>
        ☁️ 날씨 상태:
        <strong>
          {{ weatherData.weather[0].description }}
        </strong>
      </p>

      <p>
        💧 습도:
        <strong> {{ weatherData.main.humidity }}% </strong>
      </p>
    </div>

    <p v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <p v-else>아직 가져온 데이터가 없습니다. 버튼을 눌러 통신을 시작하세요.</p>
  </div>
</template>

<style scoped>
.result-card {
  margin-top: 16px;
  padding: 16px;
  background-color: #eef9f4;
  border: 1px solid #42b883;
  border-radius: 8px;
}

.result-card p {
  margin: 8px 0;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  color: #d63031;
  background-color: #fff0f0;
  border-radius: 6px;
}

button {
  padding: 10px 14px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
