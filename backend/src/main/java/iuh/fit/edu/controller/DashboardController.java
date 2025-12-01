package iuh.fit.edu.controller;

import iuh.fit.edu.dto.response.dashboard.DashboardStatsDTO;
import iuh.fit.edu.dto.response.dashboard.MonthlyRevenueDTO;
import iuh.fit.edu.dto.response.dashboard.TopBookDTO;
import iuh.fit.edu.dto.response.dashboard.TopCategoryDTO;
import iuh.fit.edu.service.DashboardService;
import iuh.fit.edu.util.anotation.ApiMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @ApiMessage("Lấy thống kê dashboard")
    public ResponseEntity<DashboardStatsDTO> getStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        return ResponseEntity.ok(dashboardService.getStats(startDate, endDate));
    }

    @GetMapping("/monthly-revenue")
    @ApiMessage("Lấy doanh thu theo tháng")
    public ResponseEntity<List<MonthlyRevenueDTO>> getMonthlyRevenue(
            @RequestParam int year
    ) {
        return ResponseEntity.ok(dashboardService.getMonthlyRevenue(year));
    }

    @GetMapping("/top-books")
    @ApiMessage("Lấy top sách bán chạy")
    public ResponseEntity<List<TopBookDTO>> getTopBooks(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "5") int limit
    ) {
        return ResponseEntity.ok(dashboardService.getTopBooks(startDate, endDate, limit));
    }

    @GetMapping("/top-categories")
    @ApiMessage("Lấy top thể loại bán chạy")
    public ResponseEntity<List<TopCategoryDTO>> getTopCategories(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "5") int limit
    ) {
        return ResponseEntity.ok(dashboardService.getTopCategories(startDate, endDate, limit));
    }
}
