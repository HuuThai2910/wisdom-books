package iuh.fit.edu.service;

import iuh.fit.edu.dto.response.dashboard.DashboardStatsDTO;
import iuh.fit.edu.dto.response.dashboard.MonthlyRevenueDTO;
import iuh.fit.edu.dto.response.dashboard.TopBookDTO;
import iuh.fit.edu.dto.response.dashboard.TopCategoryDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface DashboardService {
    DashboardStatsDTO getStats(LocalDateTime startDate, LocalDateTime endDate);
    List<MonthlyRevenueDTO> getMonthlyRevenue(int year);
    List<TopBookDTO> getTopBooks(LocalDateTime startDate, LocalDateTime endDate, int limit);
    List<TopCategoryDTO> getTopCategories(LocalDateTime startDate, LocalDateTime endDate, int limit);
}
