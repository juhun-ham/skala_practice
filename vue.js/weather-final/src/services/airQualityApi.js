import axios from 'axios'

const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

// Open-Meteo에서 선택한 좌표의 현재 공기질과 자외선 데이터를 가져옵니다.
export const fetchAirQuality = async (latitude, longitude) => {
  const response = await axios.get(AIR_QUALITY_URL, {
    params: {
      latitude,
      longitude,
      current: ['us_aqi', 'pm10', 'pm2_5', 'uv_index'].join(','),
      timezone: 'Asia/Seoul',
    },
  })

  return {
    current: response.data.current,
    units: response.data.current_units,
  }
}
