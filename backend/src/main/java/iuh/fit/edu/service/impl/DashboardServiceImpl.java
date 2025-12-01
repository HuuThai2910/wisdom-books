package iuh.fit.edu.service.impl;

import iuh.fit.edu.dto.response.dashboard.DashboardStatsDTO;
import iuh.fit.edu.repository.BookRepository;
import iuh.fit.edu.repository.InventoryRepository;
import iuh.fit.edu.repository.OrderRepository;
import iuh.fit.edu.repository.UserRepository;
import iuh.fit.edu.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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
}
