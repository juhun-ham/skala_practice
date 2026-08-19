-- Q11. 0으로 나누기 방지 함수 비교

-- f_safe_div: 분모가 0이면 0을 반환한다.
SELECT
    ecom.f_safe_div(10, 2) AS normal_result,
    ecom.f_safe_div(10, 0) AS zero_denominator;

-- safe_div: 분모가 0 또는 NULL이면 NULL을 반환한다.
SELECT
    ecom.safe_div(10, 2) AS normal_result,
    ecom.safe_div(10, 0) AS zero_denominator,
    ecom.safe_div(10, NULL) AS null_denominator;

-- 비율을 0으로 표시해야 할 때는 f_safe_div가 편리하지만,
-- 계산 불가능과 실제 0을 구분해야 할 때는 safe_div가 적절하다.
SELECT
    ecom.f_safe_div(SUM(amount), COUNT(*)) AS avg_amount_or_zero,
    ecom.safe_div(SUM(amount), COUNT(*)) AS avg_amount_or_null
FROM ecom.payments
WHERE 1 = 0;
