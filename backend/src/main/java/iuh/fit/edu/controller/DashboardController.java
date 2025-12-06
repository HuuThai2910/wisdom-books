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
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @ApiMessage("Lấy thống kê dashboard")
    public ResponseEntity<DashboardStatsDTO> getStats(
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        OffsetDateTime start = parseToOffset(startDate);
        OffsetDateTime end = parseToOffset(endDate);
        return ResponseEntity.ok(dashboardService.getStats(start, end));
    }

    @GetMapping("/monthly-revenue")
    @ApiMessage("Lấy doanh thu theo tháng")
    public ResponseEntity<List<MonthlyRevenueDTO>> getMonthlyRevenue(
            @RequestParam int year
    ) {
        return ResponseEntity.ok(dashboardService.getMonthlyRevenue(year));
    }

    @GetMapping("/overview")
    @ApiMessage("Lấy thông tin tổng quan (không phụ thuộc lọc ngày)")
    public ResponseEntity<iuh.fit.edu.dto.response.dashboard.DashboardOverviewDTO> getOverview() {
        return ResponseEntity.ok(dashboardService.getOverview());
    }

    @GetMapping("/top-books")
    @ApiMessage("Lấy top sách bán chạy")
    public ResponseEntity<List<TopBookDTO>> getTopBooks(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(defaultValue = "5") int limit
    ) {
        OffsetDateTime start = parseToOffset(startDate);
        OffsetDateTime end = parseToOffset(endDate);
        return ResponseEntity.ok(dashboardService.getTopBooks(start, end, limit));
    }

    @GetMapping("/top-categories")
    @ApiMessage("Lấy top thể loại bán chạy")
    public ResponseEntity<List<TopCategoryDTO>> getTopCategories(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(defaultValue = "5") int limit
    ) {
        OffsetDateTime start = parseToOffset(startDate);
        OffsetDateTime end = parseToOffset(endDate);
        return ResponseEntity.ok(dashboardService.getTopCategories(start, end, limit));
    }

    @GetMapping("/category-books/{categoryId}")
    @ApiMessage("Lấy danh sách sách bán chạy theo danh mục")
    public ResponseEntity<List<iuh.fit.edu.dto.response.dashboard.CategoryBookDTO>> getCategoryBooks(
            @PathVariable Long categoryId,
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        OffsetDateTime start = parseToOffset(startDate);
        OffsetDateTime end = parseToOffset(endDate);
        return ResponseEntity.ok(dashboardService.getCategoryBooks(categoryId, start, end));
    }

    private OffsetDateTime parseToOffset(String value) {
        if (value == null) return null;
        // First try parsing as OffsetDateTime (handles strings with offset or Z)
        try {
            return OffsetDateTime.parse(value);
        } catch (DateTimeParseException ignored) {
        }

        // If that fails, try parsing as LocalDateTime and attach VN timezone
        try {
            LocalDateTime ldt = LocalDateTime.parse(value);
            return ldt.atZone(ZoneId.of("Asia/Ho_Chi_Minh")).toOffsetDateTime();
        } catch (DateTimeParseException ex) {
            // rethrow to produce a clear 400 later (let global handler map it),
            // but for now throw IllegalArgumentException to surface error.
            throw new IllegalArgumentException("Invalid date format: " + value, ex);
        }
    }
}
