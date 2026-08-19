# JOIN·서브쿼리·윈도우 함수 실습

PostgreSQL의 `lab` 스키마를 이용해 JOIN 유형부터 집계, 서브쿼리, 재귀 CTE, 윈도우 함수까지 단계적으로 실습한 내용입니다. 원본 보고서에는 SQL이 캡처로만 남아 있어, 문서의 문제 설명과 테이블 스키마를 기준으로 실행 가능한 형태로 복원했습니다.

## 사용 테이블

| 테이블 | 주요 컬럼 | 용도 |
| --- | --- | --- |
| `lab.student` | `student_id`, `name`, `major`, `gpa` | 학생 정보 |
| `lab.enroll` | `student_id`, `course`, `grade` | 수강 기록 |
| `lab.customers` | `customer_id`, `customer_name` | 고객 정보 |
| `lab.orders` | `order_id`, `customer_id`, `amount` | 주문 정보 |
| `lab.emp` | `emp_id`, `name`, `manager_id` | 직원 계층 |

`enroll`에는 학생 테이블에 없는 1001번과 1010번 수강 기록이 있어 외부 JOIN의 차이를 관찰할 수 있습니다. 반대로 일부 학생은 수강 기록이 없어 `LEFT JOIN`, `NOT EXISTS` 실습에 사용됩니다.

## SQL 구성

- [Q1~Q6 기본 JOIN과 존재 여부](queries/q01-q06-basic-joins.sql)
- [Q7~Q12 집계와 셀프 JOIN](queries/q07-q12-aggregation.sql)
- [Q13~Q20 CROSS JOIN과 서브쿼리](queries/q13-q20-subqueries.sql)
- [Q21~Q22 ROLLUP과 재귀 CTE](queries/q21-q22-advanced-grouping.sql)
- [Q23~Q25 윈도우 함수](queries/q23-q25-window-functions.sql)

## 핵심 정리

- `INNER JOIN`은 양쪽에 일치하는 행만, `LEFT/RIGHT JOIN`은 기준 테이블의 모든 행을, `FULL OUTER JOIN`은 양쪽의 일치하지 않는 행까지 반환한다.
- 존재 여부만 필요하면 JOIN 후 중복을 제거하기보다 `EXISTS`와 `NOT EXISTS`가 의도를 명확하게 표현한다.
- `CROSS JOIN`은 모든 조합을 생성하므로 입력 행 수의 곱만큼 커질 수 있다. 이후 제외 조건과 `LIMIT`을 신중히 사용해야 한다.
- 상관 서브쿼리는 바깥 행의 값을 참조하며 행마다 평가될 수 있다. 동일 결과를 JOIN이나 사전 집계로 바꿀 수 있는지도 검토한다.
- `ROLLUP`은 상세 집계, 소계, 전체 합계를 한 번에 만들고 `GROUPING()`은 실제 NULL과 집계용 NULL을 구분한다.
- 재귀 CTE는 조직도처럼 부모·자식 관계를 반복 탐색하며, 실제 서비스 데이터에서는 순환 참조 방지도 고려해야 한다.
- 윈도우 함수는 행을 줄이지 않고 순위, 이전 행, 누적합, 이동평균 같은 분석값을 추가한다.

> Q12의 과목-매니저 배정 로직은 보고서 설명을 기준으로 재구성했습니다. 실제 운영 환경에서는 별도의 기준 데이터로 관리하는 편이 적절합니다.
