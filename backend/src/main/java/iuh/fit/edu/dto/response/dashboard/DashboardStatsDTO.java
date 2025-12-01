package iuh.fit.edu.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalBooks;
    private long totalCustomers;
    private long outOfStockBooks; // Sách hết hàng (quantity = 0)
    private long lowStockBooks; // Sách sắp hết (quantity <= 10 và > 0)
    private long totalOrders;
    private double totalRevenue;
    private double totalProfit;
    private double customerGrowthRate; // % khách hàng mới trong tháng
    private double cancelledOrderRate; // % đơn hủy
    private long newCustomersThisMonth; // Số khách hàng mới trong tháng
    private long cancelledOrders; // Số đơn hủy
}
