package iuh.fit.edu.service;

import iuh.fit.edu.dto.response.dashboard.CategoryBookDTO;
import iuh.fit.edu.dto.response.dashboard.DashboardOverviewDTO;
import iuh.fit.edu.dto.response.dashboard.DashboardStatsDTO;
import iuh.fit.edu.dto.response.dashboard.MonthlyRevenueDTO;
import iuh.fit.edu.dto.response.dashboard.TopBookDTO;
import iuh.fit.edu.dto.response.dashboard.TopCategoryDTO;

import java.time.OffsetDateTime;
import java.util.List;

public interface DashboardService {
    DashboardStatsDTO getStats(OffsetDateTime startDate, OffsetDateTime endDate);
    DashboardOverviewDTO getOverview();
    List<MonthlyRevenueDTO> getMonthlyRevenue(int year);
    List<TopBookDTO> getTopBooks(OffsetDateTime startDate, OffsetDateTime endDate, int limit);
    List<TopCategoryDTO> getTopCategories(OffsetDateTime startDate, OffsetDateTime endDate, int limit);
    List<CategoryBookDTO> getCategoryBooks(Long categoryId, OffsetDateTime startDate, OffsetDateTime endDate);
}
