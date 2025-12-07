package iuh.fit.edu.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardOverviewDTO {
    private long totalBooks;
    private long totalCustomers;
    private long outOfStockBooks;
    private long lowStockBooks;
}
