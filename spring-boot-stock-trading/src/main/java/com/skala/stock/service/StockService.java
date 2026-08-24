package com.skala.stock.service;

import com.skala.stock.dto.StockDto;
import com.skala.stock.entity.Stock;
import com.skala.stock.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StockService {

    private final StockRepository stockRepository;

    @Transactional
    public StockDto createStock(StockDto stockDto) {
        if (stockRepository.existsByCode(stockDto.getCode())) {
            throw new RuntimeException("이미 존재하는 종목 코드입니다: " + stockDto.getCode());
        }

        Stock stock = Stock.builder()
                .code(stockDto.getCode())
                .name(stockDto.getName())
                .currentPrice(stockDto.getCurrentPrice())
                .previousPrice(stockDto.getPreviousPrice())
                .build();

        Stock savedStock = stockRepository.save(stock);
        return convertToDto(savedStock);
    }

    public StockDto getStockById(Long id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("주식을 찾을 수 없습니다: " + id));
        return convertToDto(stock);
    }

    public List<StockDto> getAllStocks() {
        return stockRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /** [CRUD 4] 주식 수정 */
    @Transactional // ★ 필수! 클래스가 readOnly=true라서, 이게 없으면 수정이 조용히 무시됨
    public StockDto updateStock(Long id, StockDto stockDto) { // stockDto: 새롭게 적용할 주식 정보
        // 1단계: 수정할 대상을 먼저 찾는다 (없는 id면 예외를 던져 명확한 에러를 줌)
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("주식을 찾을 수 없습니다: " + id));

        // 2단계: 찾은 객체의 값을 요청받은 새 값으로 교체
        // (code는 종목의 고유 식별자이므로 바꾸지 않는 것이 원칙)
        stock.setName(stockDto.getName());
        stock.setCurrentPrice(stockDto.getCurrentPrice());
        stock.setPreviousPrice(stockDto.getPreviousPrice());

        // 3단계: 저장하고, 화면에 돌려줄 DTO로 변환해 반환
        Stock updatedStock = stockRepository.save(stock);
        return convertToDto(updatedStock);
    }

    /** [CRUD 5] 주식 삭제 */
    @Transactional // 삭제도 데이터를 바꾸는 일이므로 필수!
    public void deleteStock(Long id) {
        // 없는 id를 지우려 할 때 "왜 안 되는지" 알려주기 위해 존재 확인을 먼저 한다
        if (!stockRepository.existsById(id)) {
            throw new RuntimeException("주식을 찾을 수 없습니다: " + id);
        }
        stockRepository.deleteById(id);
    }

    /** [CRUD 6] 종목 코드로 조회 */
    public StockDto getStockByCode(String code) {
        // 조회만 하므로 @Transactional 불필요 (클래스 기본값인 읽기 전용으로 충분)
        Stock stock = stockRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("주식을 찾을 수 없습니다: " + code));
        return convertToDto(stock);
    }

    private StockDto convertToDto(Stock stock) {
        return StockDto.builder()
                .id(stock.getId())
                .code(stock.getCode())
                .name(stock.getName())
                .currentPrice(stock.getCurrentPrice())
                .previousPrice(stock.getPreviousPrice())
                .build();
    }
}
