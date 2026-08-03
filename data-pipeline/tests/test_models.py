import pytest
from pydantic import ValidationError

from models import HourlyWeather, IPData


def test_valid_hourly_weather() -> None:
    """정상적인 시간별 날씨 데이터는 검증을 통과해야 한다."""
    valid_data = {
        "time": ["2026-08-03T00:00"],
        "temperature_2m": [25.0],
        "precipitation_probability": [10],
    }

    weather = HourlyWeather.model_validate(valid_data)

    assert weather.temperature_2m == [25.0]
    assert weather.precipitation_probability == [10]


def test_precipitation_probability_range() -> None:
    """강수확률이 100을 초과하면 검증에 실패해야 한다."""
    invalid_data = {
        "time": ["2026-08-03T00:00"],
        "temperature_2m": [25.0],
        "precipitation_probability": [101],
    }

    with pytest.raises(ValidationError):
        HourlyWeather.model_validate(invalid_data)


def test_hourly_array_lengths() -> None:
    """시간별 데이터 배열의 길이가 다르면 검증에 실패해야 한다."""
    invalid_data = {
        "time": ["2026-08-03T00:00", "2026-08-03T01:00"],
        "temperature_2m": [25.0],
        "precipitation_probability": [10, 20],
    }

    with pytest.raises(ValidationError, match="배열 길이가 서로 다릅니다"):
        HourlyWeather.model_validate(invalid_data)


def test_ip_latitude_range() -> None:
    """IP 위치의 위도가 허용 범위를 벗어나면 검증에 실패해야 한다."""
    invalid_data = {
        "status": "success",
        "country": "United States",
        "countryCode": "US",
        "regionName": "Virginia",
        "city": "Ashburn",
        "lat": 91,
        "lon": -77.5,
        "timezone": "America/New_York",
        "query": "8.8.8.8",
    }

    with pytest.raises(ValidationError):
        IPData.model_validate(invalid_data)
