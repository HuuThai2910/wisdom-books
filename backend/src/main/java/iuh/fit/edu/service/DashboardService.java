package iuh.fit.edu.service;

import iuh.fit.edu.dto.response.dashboard.DashboardStatsDTO;

import java.time.LocalDateTime;

public interface DashboardService {
    DashboardStatsDTO getStats(LocalDateTime startDate, LocalDateTime endDate);
}
