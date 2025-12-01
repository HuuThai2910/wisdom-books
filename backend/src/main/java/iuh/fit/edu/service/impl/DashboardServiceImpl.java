package iuh.fit.edu.service.impl;

import iuh.fit.edu.dto.response.dashboard.DashboardStatsDTO;
import iuh.fit.edu.dto.response.dashboard.MonthlyRevenueDTO;
import iuh.fit.edu.dto.response.dashboard.TopBookDTO;
import iuh.fit.edu.dto.response.dashboard.TopCategoryDTO;
import iuh.fit.edu.repository.BookRepository;
import iuh.fit.edu.repository.InventoryRepository;
import iuh.fit.edu.repository.OrderRepository;
import iuh.fit.edu.repository.UserRepository;
import iuh.fit.edu.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;

    @Override
    public DashboardStatsDTO getStats(LocalDateTime startDate, LocalDateTime endDate) {
        // Tổng sách trong kho (tổng quantity từ Inventory)
        long totalBooks = inventoryRepository.getTotalQuantity();
        
        // Tổng khách hàng (user có role CUSTOMER)
        long totalCustomers = userRepository.countCustomers();
        
        // Sách hết hàng (quantity = 0)
        long outOfStockBooks = bookRepository.countOutOfStockBooks();
        
        // Sách sắp hết (0 < quantity <= 10)
        long lowStockBooks = bookRepository.countLowStockBooks();
        
        // Tổng đơn hàng trong khoảng thời gian
        long totalOrders = orderRepository.countOrdersByDateRange(startDate, endDate);
        
        // Tổng doanh thu (tổng totalPrice của đơn hàng đã thanh toán)
        double totalRevenue = orderRepository.sumRevenueByDateRange(startDate, endDate);
        
        // Tổng chi phí nhập (tổng quantity * importPrice của các sách trong đơn đã thanh toán)
        double totalImportCost = orderRepository.sumImportCostByDateRange(startDate, endDate);
        
        // Lợi nhuận = Doanh thu - Chi phí nhập
        double totalProfit = totalRevenue - totalImportCost;
        
        // Số khách hàng mới trong khoảng thời gian
        long newCustomersThisMonth = userRepository.countNewCustomersByDateRange(startDate, endDate);
        
        // Tỷ lệ tăng trưởng khách hàng = (khách hàng mới / tổng khách hàng) * 100
        double customerGrowthRate = totalCustomers > 0 ? (newCustomersThisMonth * 100.0 / totalCustomers) : 0;
        
        // Số đơn hủy trong khoảng thời gian
        long cancelledOrders = orderRepository.countCancelledOrdersByDateRange(startDate, endDate);
        
        // Tỷ lệ hủy đơn = (đơn hủy / tổng đơn) * 100
        double cancelledOrderRate = totalOrders > 0 ? (cancelledOrders * 100.0 / totalOrders) : 0;
        
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalBooks(totalBooks);
        stats.setTotalCustomers(totalCustomers);
        stats.setOutOfStockBooks(outOfStockBooks);
        stats.setLowStockBooks(lowStockBooks);
        stats.setTotalOrders(totalOrders);
        stats.setTotalRevenue(totalRevenue);
        stats.setTotalProfit(totalProfit);
        stats.setCustomerGrowthRate(customerGrowthRate);
        stats.setCancelledOrderRate(cancelledOrderRate);
        stats.setNewCustomersThisMonth(newCustomersThisMonth);
        stats.setCancelledOrders(cancelledOrders);
        
        return stats;
    }

    @Override
    public List<MonthlyRevenueDTO> getMonthlyRevenue(int year) {
        List<Object[]> results = orderRepository.getMonthlyRevenueByYear(year);
        
        // Tạo list 12 tháng với giá trị mặc định là 0
        List<MonthlyRevenueDTO> monthlyRevenue = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            monthlyRevenue.add(new MonthlyRevenueDTO("Tháng " + i, 0, 0));
        }
        
        // Cập nhật dữ liệu thực tế
        for (Object[] result : results) {
            int month = (int) result[0];
            double revenue = (double) result[1];
            long orders = (long) result[2];
            monthlyRevenue.set(month - 1, new MonthlyRevenueDTO("Tháng " + month, revenue, orders));
        }
        
        return monthlyRevenue;
    }

    @Override
    public List<TopBookDTO> getTopBooks(LocalDateTime startDate, LocalDateTime endDate, int limit) {
        List<Object[]> results = orderRepository.getTopBooksByDateRange(startDate, endDate);
        
        return results.stream()
                .limit(limit)
                .map(result -> new TopBookDTO(
                        (String) result[0],  // name
                        (Long) result[1]     // sales
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<TopCategoryDTO> getTopCategories(LocalDateTime startDate, LocalDateTime endDate, int limit) {
        List<Object[]> results = orderRepository.getTopCategoriesByDateRange(startDate, endDate);
        
        return results.stream()
                .limit(limit)
                .map(result -> new TopCategoryDTO(
                        (String) result[0],  // category
                        (Long) result[1]     // sales
                ))
                .collect(Collectors.toList());
    }
}
