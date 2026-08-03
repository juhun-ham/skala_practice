import asyncio
import json
from pathlib import Path

import httpx
from pydantic import ValidationError

from models import PipelineData
from storage import benchmark_storage, build_dataframe, print_benchmark

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
COUNTRIES_URL = "https://countries.dev/alpha/KOR"
IP_API_URL = "http://ip-api.com/json/8.8.8.8"

# 서울의 3일치 시간별 날씨를 요청한다.
WEATHER_PARAMS = {
    "latitude": 37.5665,
    "longitude": 126.9780,
    "hourly": "temperature_2m,precipitation_probability",
    "forecast_days": 3,
    "timezone": "Asia/Seoul",
}


async def fetch_json(
    client: httpx.AsyncClient,
    name: str,
    url: str,
    params: dict[str, object] | None = None,
) -> dict:
    """API를 호출하고 정상 응답의 JSON을 반환한다."""
    max_attempts = 3
    for attempt in range(1, max_attempts + 1):
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            print(f"[수집 완료] {name}: HTTP {response.status_code}")
            return response.json()
        except (httpx.RequestError, httpx.HTTPStatusError) as error:
            status_code = getattr(getattr(error, "response", None), "status_code", 0)
            can_retry = status_code >= 500 or isinstance(error, httpx.RequestError)
            if not can_retry or attempt == max_attempts:
                raise

            # 외부 API의 일시적인 장애에 대비해 잠시 기다린 후 다시 요청한다.
            wait_seconds = 2 ** (attempt - 1)
            print(
                f"[재시도] {name}: {attempt}/{max_attempts}, "
                f"{wait_seconds}초 후 다시 요청"
            )
            await asyncio.sleep(wait_seconds)

    raise RuntimeError("도달할 수 없는 코드입니다.")


async def collect_all() -> dict[str, dict]:
    """하나의 HTTP 클라이언트로 세 API를 동시에 호출한다."""
    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
        # gather로 세 요청을 동시에 실행한다.
        weather, country, ip_info = await asyncio.gather(
            fetch_json(client, "Open-Meteo", OPEN_METEO_URL, WEATHER_PARAMS),
            fetch_json(client, "Countries.dev", COUNTRIES_URL),
            fetch_json(client, "ip-api", IP_API_URL),
        )

    return {"weather": weather, "country": country, "ip_info": ip_info}


async def main() -> None:
    try:
        collected_data = await collect_all()
    except (httpx.HTTPError, json.JSONDecodeError) as error:
        print(f"[수집 실패] {error}")
        return

    try:
        # 모델에 선언된 필드만 추출하고 타입과 범위를 검증한다.
        validated_data = PipelineData.model_validate(collected_data)
    except ValidationError as error:
        print(f"[검증 실패]\n{error}")
        return

    print("[검증 완료] Pydantic 타입·범위 검증 통과")
    output_path = Path("data/validated_data.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(validated_data.model_dump(mode="json"), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"[저장 완료] {output_path}")

    dataframe = build_dataframe(validated_data)
    benchmark_runs = 5
    metrics = benchmark_storage(dataframe, runs=benchmark_runs)
    print(f"[변환 완료] {len(dataframe)}행")
    print("[저장 완료] data/weather_data.csv, data/weather_data.parquet")
    print_benchmark(metrics, benchmark_runs)


if __name__ == "__main__":
    asyncio.run(main())
