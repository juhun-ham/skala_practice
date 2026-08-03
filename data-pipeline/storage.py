from pathlib import Path
from statistics import mean
from time import perf_counter

import pandas as pd

from models import PipelineData


def build_dataframe(data: PipelineData) -> pd.DataFrame:
    """시간별 날씨에 국가와 IP 정보를 결합해 표 형태로 변환한다."""
    country = data.country
    ip_info = data.ip_info
    common_fields = {
        "country_name": country.name,
        "country_code": country.alpha2_code,
        "capital": country.capital,
        "ip_address": str(ip_info.ip_address),
        "ip_country": ip_info.country,
        "ip_region": ip_info.region_name,
        "ip_city": ip_info.city,
        "ip_latitude": ip_info.latitude,
        "ip_longitude": ip_info.longitude,
    }

    rows = [
        {
            "forecast_time": forecast_time,
            "temperature_c": temperature,
            "precipitation_probability": probability,
            **common_fields,
        }
        for forecast_time, temperature, probability in zip(
            data.weather.hourly.time,
            data.weather.hourly.temperature_2m,
            data.weather.hourly.precipitation_probability,
            strict=True,
        )
    ]
    return pd.DataFrame(rows)


def benchmark_storage(
    dataframe: pd.DataFrame,
    output_dir: Path = Path("data"),
    runs: int = 5,
) -> dict[str, dict[str, float]]:
    """CSV와 Parquet의 읽기·쓰기 시간을 여러 번 측정해 평균을 반환한다."""
    output_dir.mkdir(parents=True, exist_ok=True)
    csv_path = output_dir / "weather_data.csv"
    parquet_path = output_dir / "weather_data.parquet"
    csv_write_times: list[float] = []
    csv_read_times: list[float] = []
    parquet_write_times: list[float] = []
    parquet_read_times: list[float] = []

    # 최초 라이브러리 로딩 비용이 특정 포맷의 측정에만 포함되지 않게 준비 실행한다.
    dataframe.to_csv(csv_path, index=False)
    pd.read_csv(csv_path, parse_dates=["forecast_time"])
    dataframe.to_parquet(parquet_path, index=False)
    pd.read_parquet(parquet_path)

    # 작은 파일은 측정 편차가 크므로 같은 작업을 반복해 평균을 사용한다.
    for _ in range(runs):
        started_at = perf_counter()
        dataframe.to_csv(csv_path, index=False)
        csv_write_times.append(perf_counter() - started_at)

        started_at = perf_counter()
        pd.read_csv(csv_path, parse_dates=["forecast_time"])
        csv_read_times.append(perf_counter() - started_at)

        started_at = perf_counter()
        dataframe.to_parquet(parquet_path, index=False)
        parquet_write_times.append(perf_counter() - started_at)

        started_at = perf_counter()
        pd.read_parquet(parquet_path)
        parquet_read_times.append(perf_counter() - started_at)

    return {
        "CSV": {
            "write_ms": mean(csv_write_times) * 1000,
            "read_ms": mean(csv_read_times) * 1000,
            "size_kb": csv_path.stat().st_size / 1024,
        },
        "Parquet": {
            "write_ms": mean(parquet_write_times) * 1000,
            "read_ms": mean(parquet_read_times) * 1000,
            "size_kb": parquet_path.stat().st_size / 1024,
        },
    }


def print_benchmark(metrics: dict[str, dict[str, float]], runs: int) -> None:
    """보고서 캡처에 적합한 형태로 성능 측정 결과를 출력한다."""
    print(f"[성능 비교] {runs}회 평균")
    for file_format, values in metrics.items():
        print(
            f"- {file_format:7} | 쓰기 {values['write_ms']:.3f} ms "
            f"| 읽기 {values['read_ms']:.3f} ms "
            f"| 크기 {values['size_kb']:.2f} KB"
        )
