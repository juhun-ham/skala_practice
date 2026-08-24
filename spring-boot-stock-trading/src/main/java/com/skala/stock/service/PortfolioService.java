package com.skala.stock.service;

import com.skala.stock.entity.User;
import com.skala.stock.dto.PortfolioDto;
import com.skala.stock.entity.Portfolio;
import com.skala.stock.entity.Stock;
import com.skala.stock.repository.PortfolioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;

    public List<PortfolioDto> getUserPortfolio(Long userId) {
        List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);
        return portfolios.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /** [CRUD 9] 특정 사용자의 특정 종목 보유 현황 조회 */
    public PortfolioDto getUserStockPortfolio(Long userId, Long stockId) {
        Portfolio portfolio = portfolioRepository.findByUserIdAndStockId(userId, stockId)
                .orElseThrow(() -> new RuntimeException("보유하지 않은 종목입니다"));
        return convertToDto(portfolio);
        // convertToDto가 평가액(totalValue)과 손익(profitLoss)까지 계산해 줌
        // — 파일 아래쪽의 convertToDto를 열어 어떻게 계산하는지 꼭 읽어보세요! (분석 1에서 재활용됨)
    }

    /** [부품 0] 특정 사용자가 특정 종목을 보유 중인지 조회 (없으면 null 반환) */
    public Portfolio findPortfolio(Long userId, Long stockId) {
        // Repository에 이미 준비된 메서드를 사용 (열어서 확인해 보세요!)
        return portfolioRepository.findByUserIdAndStockId(userId, stockId)
                .orElse(null); // Optional이 비어있으면 null로 — "보유 안 함"의 의미
    }

    /** [부품 1: 매수-신규] 처음 사는 종목 → 포트폴리오에 새로 추가 */
    @Transactional
    public void addToPortfolio(User user, Stock stock, Long quantity, Long price) {
        Portfolio portfolio = Portfolio.builder()
                .user(user) // 누가
                .stock(stock) // 어떤 종목을
                .quantity(quantity) // 몇 주
                .averagePrice(price) // 첫 매수 → 평단가 = 지금 산 가격
                .build();
        portfolioRepository.save(portfolio);
    }

    /** [부품 2: 매수-추가] 이미 보유한 종목을 더 산다 → 수량과 평단가 갱신 */
    @Transactional
    public void updatePortfolio(Portfolio portfolio, Long quantity, Long price) {
        // 평단가 = (기존에 산 총액 + 이번에 산 총액) ÷ 전체 수량
        // 예) 2주를 70,000원에 보유 중 + 3주를 75,000원에 추가 매수하면
        // (2×70,000 + 3×75,000) ÷ 5주 = 73,000원
        Long oldTotal = portfolio.getQuantity() * portfolio.getAveragePrice();
        Long newTotal = quantity * price;
        Long totalQuantity = portfolio.getQuantity() + quantity;

        portfolio.setAveragePrice((oldTotal + newTotal) / totalQuantity);
        portfolio.setQuantity(totalQuantity);
        portfolioRepository.save(portfolio);
    }

    /** [부품 3: 매도] 수량 차감, 전량 매도면 목록에서 삭제 */
    @Transactional
    public void removeFromPortfolio(Portfolio portfolio, Long quantity) {
        Long remaining = portfolio.getQuantity() - quantity; // 팔고 남는 수량

        if (remaining == 0) {
            portfolioRepository.delete(portfolio); // 다 팔았으면 보유 목록에서 제거
        } else {
            portfolio.setQuantity(remaining); // 일부만 팔았으면 수량만 줄임
            portfolioRepository.save(portfolio); // ※ 평단가는 매도로 변하지 않음!
        }
    }

    private PortfolioDto convertToDto(Portfolio portfolio) {
        Stock stock = portfolio.getStock();
        Long currentPrice = stock.getCurrentPrice();
        Long totalValue = portfolio.getQuantity() * currentPrice;
        Long profitLoss = totalValue - (portfolio.getQuantity() * portfolio.getAveragePrice());

        return PortfolioDto.builder()
                .id(portfolio.getId())
                .userId(portfolio.getUser().getId())
                .username(portfolio.getUser().getUsername())
                .stockId(stock.getId())
                .stockCode(stock.getCode())
                .stockName(stock.getName())
                .quantity(portfolio.getQuantity())
                .averagePrice(portfolio.getAveragePrice())
                .currentPrice(currentPrice)
                .totalValue(totalValue)
                .profitLoss(profitLoss)
                .build();
    }
}
