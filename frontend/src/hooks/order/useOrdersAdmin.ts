// Hook quản lý dữ liệu đơn hàng cho trang Admin
// - Đóng gói gọi API (fetch) và cập nhật trạng thái (updateStatus)
// - Tách khỏi component để tuân thủ Single Responsibility
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import {
    fetchAllOrders,
    selectOrders,
    selectOrdersMeta,
    selectOrderStatus,
    updateOrderStatus,
    optimisticUpdateOrderStatus,
} from "../../features/order/orderSlice";
import {
    buildOrderFilter,
    OrderFilterInput,
} from "../../util/orderFilterBuilder";

export function useOrdersAdmin() {
    const dispatch = useAppDispatch();
    const orders = useAppSelector(selectOrders);
    const meta = useAppSelector(selectOrdersMeta);
    const loadingStatus = useAppSelector(selectOrderStatus);
    const loading = loadingStatus === "loading";

    const fetch = useCallback(
        async (
            page: number,
            size: number,
            filters: OrderFilterInput,
            sortField?: string, // Trường cần sort (vd: orderCode, orderDate, finalTotal)
            sortDirection?: "asc" | "desc" // Hướng sort: asc = tăng dần, desc = giảm dần
        ) => {
            // Chuẩn bị query params chung (page/size/sort)
            // Mặc định sort theo ngày đặt hàng giảm dần nếu không có sort params
            const sortQuery = sortField
                ? `${sortField},${sortDirection || "asc"}`
                : "orderDate,desc";
            const params: any = { page, size, sort: sortQuery };
            // Xây chuỗi filter từ util dựa trên search/status/date
            const filter = buildOrderFilter(filters);
            if (filter) params.filter = filter;
            // Log để kiểm tra nhanh params gửi lên backend
            // eslint-disable-next-line no-console
            console.log("Fetching orders with params:", params);
            await dispatch(fetchAllOrders(params));
        },
        [dispatch]
    );

    const updateStatus = useCallback(
        async (id: number, status: string) => {
            // Optimistic update: cập nhật ngay trên UI trước khi API trả về
            dispatch(
                optimisticUpdateOrderStatus({ id, status: status as any })
            );
            // Sau đó gọi API cập nhật thật sự
            await dispatch(updateOrderStatus({ id, status: status as any }));
        },
        [dispatch]
    );

    return { orders, meta, loading, fetch, updateStatus };
}
