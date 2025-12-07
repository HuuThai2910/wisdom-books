package iuh.fit.edu.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    // Filtered stats (depend on date range)
    private long totalOrders;
    private double totalRevenue;
    private double totalProfit;
    private double customerGrowthRate; // % khách hàng mới
    private double cancelledOrderRate; // % đơn hủy
    private long newCustomersThisMonth; // Số khách hàng mới trong khoảng thời gian
    private long cancelledOrders; // Số đơn hủy
    private long newBooksImported; // Số sách mới nhập trong khoảng thời gian
}
