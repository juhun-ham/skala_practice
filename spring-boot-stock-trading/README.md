# Spring Boot Stock Trading

사용자·종목·거래·포트폴리오를 관리하고 투자 현황을 분석하는 REST API입니다. 매수·매도 과정의 잔액, 보유 수량, 거래 이력을 하나의 트랜잭션으로 처리합니다.

## 주요 기능

- 사용자와 종목 CRUD
- 주식 매수·매도 및 거래 내역 조회
- 포트폴리오 수량·평균 매입가·평가손익 계산
- 총자산·수익률·일별 거래 통계 조회
- 거래 감사 로그 기록
- Swagger 기반 API 문서 제공

## 기술 구성

- Java 21, Spring Boot 3.2
- Spring Web, Spring Data JPA, Validation
- MyBatis, H2 Database
- Swagger/OpenAPI, Gradle, Docker

## 구조

```text
Controller -> Service -> Repository -> H2
                  |          |
                  |          +-- JPA / MyBatis
                  +-- Transaction / Business Logic
```

## 실행

```bash
./gradlew bootRun
```

실행 후 다음 주소에서 API를 확인할 수 있습니다.

- Swagger UI: <http://localhost:8080/swagger-ui.html>
- H2 Console: <http://localhost:8080/h2-console>

Docker로 실행하려면 다음 명령을 사용합니다.

```bash
docker build -t stock-trading-api .
docker run --rm -p 8080:8080 stock-trading-api
```

H2는 메모리 모드로 동작하며 애플리케이션 종료 시 데이터가 초기화됩니다.
