package iuh.fit.edu.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRevenueDTO {
    private String month; // Tháng (format: "Tháng 1", "Tháng 2", ...)
    private double revenue; // Doanh thu
    private long orders; // Số đơn hàng
}
