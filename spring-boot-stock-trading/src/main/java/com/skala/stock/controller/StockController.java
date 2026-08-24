package com.skala.stock.controller;

import com.skala.stock.dto.StockDto;
import com.skala.stock.service.StockService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
@Tag(name = "주식 관리", description = "주식 CRUD API")
public class StockController {

    private final StockService stockService;

    @PostMapping
    @Operation(summary = "주식 생성", description = "새로운 주식을 등록합니다")
    public ResponseEntity<StockDto> createStock(@Valid @RequestBody StockDto stockDto) {
        StockDto createdStock = stockService.createStock(stockDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStock);
    }

    @GetMapping("/{id}")
    @Operation(summary = "주식 조회 (ID)", description = "ID로 주식을 조회합니다")
    public ResponseEntity<StockDto> getStockById(@PathVariable Long id) {
        StockDto stock = stockService.getStockById(id);
        return ResponseEntity.ok(stock);
    }

    @GetMapping
    @Operation(summary = "전체 주식 조회", description = "모든 주식을 조회합니다")
    public ResponseEntity<List<StockDto>> getAllStocks() {
        List<StockDto> stocks = stockService.getAllStocks();
        return ResponseEntity.ok(stocks);
    }

    @GetMapping("/code/{code}") // 최종 주소: GET /api/stocks/code/{code}
    // (클래스 맨 위 @RequestMapping("/api/stocks")과 합쳐짐)
    // ★ 왜 "/{code}"가 아니라 "/code/{code}"?
    // 이미 @GetMapping("/{id}")가 있어서 "/{code}"로 만들면 주소 모양이 완전히 같아짐
    // → 스프링이 어느 메서드를 부를지 몰라서 앱이 시작조차 안 됨! (Ambiguous mapping 에러)

    @Operation(summary = "주식 조회 (코드)", description = "종목 코드로 주식을 조회합니다")
    public ResponseEntity<StockDto> getStockByCode(@PathVariable String code) {
        StockDto stock = stockService.getStockByCode(code); // Service에 일을 시키고
        return ResponseEntity.ok(stock); // 결과를 200 OK로 반환
    }

    @PutMapping("/{id}") // PUT = 수정 요청 (GET=조회, POST=생성, DELETE=삭제)
    @Operation(summary = "주식 수정", description = "기존 주식 정보를 수정합니다")
    public ResponseEntity<StockDto> updateStock(@PathVariable Long id,
            @Valid @RequestBody StockDto stockDto) {
        // id는 주소에서 (@PathVariable), 수정할 내용은 요청 본문 JSON에서 (@RequestBody) 받는다
        StockDto updatedStock = stockService.updateStock(id, stockDto);
        return ResponseEntity.ok(updatedStock);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "주식 삭제", description = "주식을 삭제합니다")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        stockService.deleteStock(id);
        return ResponseEntity.noContent().build();
        // 204 No Content = "지웠고, 돌려줄 내용은 없음" — curl에서 아무것도 안 나와도 성공!
    }
}
