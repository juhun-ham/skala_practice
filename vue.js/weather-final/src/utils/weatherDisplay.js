// OpenWeather의 날씨 코드를 사용자가 이해하기 쉬운 이름과 이모지로 변환합니다.
export const getWeatherDisplay = (code, fallbackDescription = '') => {
  if (code >= 200 && code < 300) {
    return { label: '천둥번개', emoji: '⛈️', tagType: 'danger' }
  }

  if (code >= 300 && code < 400) {
    return { label: '약한 비', emoji: '🌦️', tagType: 'primary' }
  }

  if (code === 500) {
    return { label: '약한 비', emoji: '🌦️', tagType: 'primary' }
  }

  if (code === 501) {
    return { label: '비', emoji: '🌧️', tagType: 'primary' }
  }

  if (code >= 502 && code <= 504) {
    return { label: '강한 비', emoji: '🌧️', tagType: 'danger' }
  }

  if (code === 511) {
    return { label: '어는 비', emoji: '🌨️', tagType: 'warning' }
  }

  if (code >= 520 && code < 600) {
    return { label: '소나기', emoji: '🌦️', tagType: 'primary' }
  }

  if (code === 600) {
    return { label: '약한 눈', emoji: '🌨️', tagType: 'primary' }
  }

  if (code === 601) {
    return { label: '눈', emoji: '❄️', tagType: 'primary' }
  }

  if (code === 602) {
    return { label: '강한 눈', emoji: '🌨️', tagType: 'danger' }
  }

  if (code >= 611 && code <= 613) {
    return { label: '진눈깨비', emoji: '🌨️', tagType: 'warning' }
  }

  if (code >= 615 && code <= 616) {
    return { label: '비와 눈', emoji: '🌨️', tagType: 'warning' }
  }

  if (code >= 620 && code < 700) {
    return { label: '눈 소나기', emoji: '🌨️', tagType: 'primary' }
  }

  const atmosphereDisplay = {
    701: { label: '옅은 안개', emoji: '🌫️', tagType: 'info' },
    711: { label: '연기', emoji: '🌫️', tagType: 'info' },
    721: { label: '뿌연 날씨', emoji: '🌫️', tagType: 'info' },
    731: { label: '모래·먼지', emoji: '🌪️', tagType: 'warning' },
    741: { label: '안개', emoji: '🌫️', tagType: 'info' },
    751: { label: '모래바람', emoji: '🌪️', tagType: 'warning' },
    761: { label: '먼지', emoji: '🌫️', tagType: 'warning' },
    762: { label: '화산재', emoji: '🌋', tagType: 'danger' },
    771: { label: '돌풍', emoji: '💨', tagType: 'warning' },
    781: { label: '회오리바람', emoji: '🌪️', tagType: 'danger' },
  }

  if (atmosphereDisplay[code]) {
    return atmosphereDisplay[code]
  }

  const cloudDisplay = {
    800: { label: '맑음', emoji: '☀️', tagType: 'success' },
    801: { label: '대체로 맑음', emoji: '🌤️', tagType: 'success' },
    802: { label: '구름 조금', emoji: '⛅', tagType: 'info' },
    803: { label: '구름 많음', emoji: '🌥️', tagType: 'info' },
    804: { label: '흐림', emoji: '☁️', tagType: 'info' },
  }

  if (cloudDisplay[code]) {
    return cloudDisplay[code]
  }

  const easyFallback = {
    온흐림: '흐림',
    실비: '약한 비',
    튼구름: '구름 많음',
    '흩어진 구름': '구름 조금',
    박무: '옅은 안개',
    연무: '뿌연 날씨',
  }

  const fallbackLabel = easyFallback[fallbackDescription] ?? fallbackDescription

  return {
    label: fallbackLabel || '날씨 정보 없음',
    emoji: '🌡️',
    tagType: 'info',
  }
}
