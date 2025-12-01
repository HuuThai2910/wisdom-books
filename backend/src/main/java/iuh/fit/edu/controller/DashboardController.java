package iuh.fit.edu.controller;

import iuh.fit.edu.dto.response.dashboard.DashboardStatsDTO;
import iuh.fit.edu.service.DashboardService;
import iuh.fit.edu.util.anotation.ApiMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

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
}
