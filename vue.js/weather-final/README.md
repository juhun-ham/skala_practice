# 실시간 날씨 서비스

Vue 3, Vue Router, Pinia, Axios와 OpenWeather API로 만든 최종 날씨 프로젝트입니다.

## 주요 기능

- 서울·수원·부산 실시간 날씨 조회
- 도시 검색과 더운 도시 필터
- 섭씨·화씨 단위 전환 및 더움 기준 조절
- 도시별 현재 날씨와 5일 예보 상세 페이지
- 서비스 소개, 날씨 가이드, 404 페이지 라우팅

## 실행 방법

```sh
npm install
cp .env.example .env.local
npm run dev
```

`.env.local`에 발급받은 OpenWeather API 키를 입력합니다.

```env
VITE_OPENWEATHER_API_KEY=발급받은_API_KEY
```

브라우저에서 `http://localhost:5173/weather`에 접속합니다.

## 배포용 빌드

```sh
npm run build
```

API 키가 담긴 `.env.local`은 Git에 올리지 않습니다.
