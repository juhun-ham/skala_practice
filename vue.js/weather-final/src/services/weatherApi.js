import axios from "axios";

const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const fetchCurrentWeather = async (latitude, longitude) => {
  if (!API_KEY) {
    throw new Error("OpenWeatherMap API 키가 설정되지 않았습니다.");
  }

  const response = await axios.get(API_URL, {
    params: {
      lat: latitude,
      lon: longitude,
      appid: API_KEY,
      units: "metric",
      lang: "kr",
    },
  });

  return response.data;
};

export const fetchWeatherForecast = async (latitude, longitude) => {
  if (!API_KEY) {
    throw new Error("OpenWeatherMap API 키가 설정되지 않았습니다.");
  }

  const response = await axios.get(FORECAST_URL, {
    params: {
      lat: latitude,
      lon: longitude,
      appid: API_KEY,
      units: "metric",
      lang: "kr",
    },
  });

  return response.data;
};
