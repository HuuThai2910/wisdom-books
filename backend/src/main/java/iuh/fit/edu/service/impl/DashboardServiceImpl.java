package iuh.fit.edu.service.impl;

import iuh.fit.edu.dto.response.dashboard.CategoryBookDTO;
import iuh.fit.edu.dto.response.dashboard.DashboardOverviewDTO;
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

import java.time.OffsetDateTime;
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
    public DashboardStatsDTO getStats(OffsetDateTime startDate, OffsetDateTime endDate) {
        // Tổng khách hàng (user có role CUSTOMER) - dùng để tính tỷ lệ tăng trưởng
        long totalCustomers = userRepository.countCustomers();
        
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

        // Số sách mới nhập trong khoảng thời gian (dựa trên createdAt của sách)
        long newBooksImported = bookRepository.countNewBooksByDateRange(startDate, endDate);
        
        // Tỷ lệ tăng trưởng khách hàng = (khách hàng mới / tổng khách hàng) * 100
        double customerGrowthRate = totalCustomers > 0 ? (newCustomersThisMonth * 100.0 / totalCustomers) : 0;
        
        // Số đơn hủy trong khoảng thời gian
        long cancelledOrders = orderRepository.countCancelledOrdersByDateRange(startDate, endDate);
        
        // Tỷ lệ hủy đơn = (đơn hủy / tổng đơn) * 100
        double cancelledOrderRate = totalOrders > 0 ? (cancelledOrders * 100.0 / totalOrders) : 0;
        
        DashboardStatsDTO stats = new DashboardStatsDTO();

        stats.setTotalOrders(totalOrders);
        stats.setTotalRevenue(totalRevenue);
        stats.setTotalProfit(totalProfit);
        stats.setCustomerGrowthRate(customerGrowthRate);
        stats.setCancelledOrderRate(cancelledOrderRate);
        stats.setNewCustomersThisMonth(newCustomersThisMonth);
        stats.setNewBooksImported(newBooksImported);
        stats.setCancelledOrders(cancelledOrders);
        
        return stats;
    }

    // Doanh thu, số đơn hàng theo từng tháng.
    @Override
    public List<MonthlyRevenueDTO> getMonthlyRevenue(int year) {
        List<Object[]> results = orderRepository.getMonthlyRevenueByYear(year);
        
        // Tạo list 12 tháng với giá trị mặc định là 0
        List<MonthlyRevenueDTO> monthlyRevenue = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            monthlyRevenue.add(new MonthlyRevenueDTO("Tháng " + i, 0, 0));
        }
        
        for (Object[] result : results) {
            int month = result[0] instanceof Number ? ((Number) result[0]).intValue() : Integer.parseInt(result[0].toString());
            double revenue = result[1] instanceof Number ? ((Number) result[1]).doubleValue() : Double.parseDouble(result[1].toString());
            long orders = result[2] instanceof Number ? ((Number) result[2]).longValue() : Long.parseLong(result[2].toString());
            monthlyRevenue.set(month - 1, new MonthlyRevenueDTO("Tháng " + month, revenue, orders));
        }
        
        return monthlyRevenue;
    }

    // Lấy dữ liệu top 10 đầu sách bán chạy  
    @Override
    public List<TopBookDTO> getTopBooks(OffsetDateTime startDate, OffsetDateTime endDate, int limit) {
        List<Object[]> results = orderRepository.getTopBooksByDateRange(startDate, endDate);
        return results.stream()
                .limit(limit)
                .map(result -> {
                    String name = result[0] != null ? result[0].toString() : "";
                    long sales = 0L;
                    if (result.length > 1 && result[1] != null) {
                        sales = result[1] instanceof Number ? ((Number) result[1]).longValue() : Long.parseLong(result[1].toString());
                    }
                    return new TopBookDTO(name, sales);
                })
                .collect(Collectors.toList());
    }

    // Lấy dữ liệu top 10 loại sách bán chạy  
    @Override
    public List<TopCategoryDTO> getTopCategories(OffsetDateTime startDate, OffsetDateTime endDate, int limit) {
        List<Object[]> results = orderRepository.getTopCategoriesByDateRange(startDate, endDate);
        return results.stream()
                .limit(limit)
                .map(result -> {
                    Long categoryId = result[0] != null ? ((Number) result[0]).longValue() : null;
                    String category = result[1] != null ? result[1].toString() : "";
                    long sales = 0L;
                    if (result.length > 2 && result[2] != null) {
                        sales = result[2] instanceof Number ? ((Number) result[2]).longValue() : Long.parseLong(result[2].toString());
                    }
                    return new TopCategoryDTO(categoryId, category, sales);
                })
                .collect(Collectors.toList());
    }

    // Lấy dữ liệu tổng quan (Các dữ liệu không bị thay đổi bởi lọc theo thời gian)
    @Override
    public DashboardOverviewDTO getOverview() {
        long totalBooks = inventoryRepository.getTotalQuantity();
        long totalCustomers = userRepository.countCustomers();
        long outOfStockBooks = bookRepository.countOutOfStockBooks();
        long lowStockBooks = bookRepository.countLowStockBooks();

        return new iuh.fit.edu.dto.response.dashboard.DashboardOverviewDTO(
                totalBooks,
                totalCustomers,
                outOfStockBooks,
                lowStockBooks
        );
    }

    @Override
    public List<CategoryBookDTO> getCategoryBooks(Long categoryId, OffsetDateTime startDate, OffsetDateTime endDate) {
        List<Object[]> results = orderRepository.findTopBooksByCategory(categoryId, startDate, endDate);
        
        return results.stream()
                .map(row -> new iuh.fit.edu.dto.response.dashboard.CategoryBookDTO(
                        (Long) row[0],      // bookId
                        (String) row[1],    // bookTitle
                        (Long) row[2],      // sales
                        (Double) row[3]     // revenue
                ))
                .collect(Collectors.toList());
    }
}
