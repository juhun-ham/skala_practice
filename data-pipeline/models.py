from datetime import datetime
from ipaddress import IPv4Address
from typing import Annotated, Literal, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

Latitude = Annotated[float, Field(ge=-90, le=90)]
Longitude = Annotated[float, Field(ge=-180, le=180)]
Temperature = Annotated[float, Field(ge=-90, le=60)]
Probability = Annotated[int, Field(ge=0, le=100)]
CountryCode2 = Annotated[str, Field(pattern=r"^[A-Z]{2}$")]
CountryCode3 = Annotated[str, Field(pattern=r"^[A-Z]{3}$")]


class APIModel(BaseModel):
    # 필요한 필드만 모델에 선언하고 API의 나머지 필드는 제외한다.
    model_config = ConfigDict(extra="ignore")


class HourlyWeather(APIModel):
    time: list[datetime] = Field(min_length=1)
    temperature_2m: list[Temperature] = Field(min_length=1)
    precipitation_probability: list[Probability] = Field(min_length=1)

    @model_validator(mode="after")
    def validate_array_lengths(self) -> Self:
        """시간별 날씨 데이터의 배열 길이가 서로 같은지 확인한다."""
        lengths = {
            len(self.time),
            len(self.temperature_2m),
            len(self.precipitation_probability),
        }
        if len(lengths) != 1:
            raise ValueError("시간별 날씨 데이터의 배열 길이가 서로 다릅니다.")
        return self


class WeatherData(APIModel):
    latitude: Latitude
    longitude: Longitude
    timezone: str = Field(min_length=1)
    hourly: HourlyWeather


class CountryData(APIModel):
    name: str = Field(min_length=1)
    capital: str = Field(min_length=1)
    region: str = Field(min_length=1)
    alpha2_code: CountryCode2 = Field(alias="alpha2Code")
    alpha3_code: CountryCode3 = Field(alias="alpha3Code")
    latlng: tuple[Latitude, Longitude]


class IPData(APIModel):
    status: Literal["success"]
    country: str = Field(min_length=1)
    country_code: CountryCode2 = Field(alias="countryCode")
    region_name: str = Field(alias="regionName", min_length=1)
    city: str = Field(min_length=1)
    latitude: Latitude = Field(alias="lat")
    longitude: Longitude = Field(alias="lon")
    timezone: str = Field(min_length=1)
    ip_address: IPv4Address = Field(alias="query")


class PipelineData(APIModel):
    weather: WeatherData
    country: CountryData
    ip_info: IPData
