// Tiện ích: Xây dựng chuỗi filter cho Spring Filter (Turkraft)
// Mục tiêu: tách logic ghép điều kiện filter ra khỏi component để dễ test/bảo trì
export interface OrderFilterInput {
    searchTerm?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

// Builds Spring Filter (Turkraft) expression string based on inputs
// Quy ước backend (đã kiểm chứng qua Postman):
// - LIKE dùng toán tử ~ với wildcard *: field~'*text*'
// - Enum status cũng dùng ~ với literal có nháy đơn: status~'PROCESSING'
// - Khoảng ngày: >= 'YYYY-MM-DDT00:00:00' và <= 'YYYY-MM-DDT23:59:59'
export function buildOrderFilter({
    searchTerm,
    status,
    startDate,
    endDate,
}: OrderFilterInput): string | undefined {
    const parts: string[] = [];

    if (searchTerm && searchTerm.trim()) {
        // Tìm kiếm đa trường theo dạng LIKE: orderCode, user.fullName, receiverPhone
        const pattern = `*${searchTerm.trim()}*`;
        parts.push(
            `(orderCode~'${pattern}' or user.fullName~'${pattern}' or receiverPhone~'${pattern}')`
        );
    }

    if (status) {
        // Trạng thái enum: backend chấp nhận cú pháp status~'VALUE'
        parts.push(`status~'${status}'`);
    }

    if (startDate && endDate) {
        // Chọn đủ khoảng ngày: từ đầu ngày start đến cuối ngày end
        parts.push(
            `(orderDate >= '${startDate}T00:00:00' and orderDate <= '${endDate}T23:59:59')`
        );
    } else if (startDate) {
        // Chỉ từ ngày: lấy từ đầu ngày
        parts.push(`orderDate >= '${startDate}T00:00:00'`);
    } else if (endDate) {
        // Chỉ đến ngày: lấy đến cuối ngày
        parts.push(`orderDate <= '${endDate}T23:59:59'`);
    }

    // Không có điều kiện thì trả undefined để không gửi param filter
    return parts.length ? parts.join(" and ") : undefined;
}
