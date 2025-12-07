import { useState, useEffect, useCallback } from "react";
import { Order } from "../../types";
import orderApi from "../../api/orderApi";
import paymentApi from "../../api/paymentApi";
import toast from "react-hot-toast";

// Type cho các tab trạng thái đơn hàng
type OrderStatus = "ALL" | Order["status"];

/**
 * Custom hook quản lý logic trang đơn hàng
 * Xử lý: lấy danh sách đơn, lọc/tìm kiếm, xem chi tiết, thanh toán lại, hủy đơn
 * @returns Tất cả state và hàm xử lý cho trang đơn hàng
 */
export const useOrders = () => {
    // === STATE QUẢN LÝ DANH SÁCH ĐƠN HÀNG ===

    // Danh sách đơn hàng gốc từ API
    const [orders, setOrders] = useState<Order[]>([]);

    // Danh sách đơn hàng sau khi lọc/tìm kiếm
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

    // Trạng thái loading khi fetch đơn hàng
    const [loading, setLoading] = useState(true);

    // Tab trạng thái hiện tại đang xem (ALL, PENDING, PROCESSING...)
    const [activeTab, setActiveTab] = useState<OrderStatus>("ALL");

    // Từ khóa tìm kiếm
    const [searchQuery, setSearchQuery] = useState<string>("");

    // === STATE QUẢN LÝ CHI TIẾT ĐƠN HÀNG ===

    // ID của đơn hàng đang được mở rộng (xem chi tiết)
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    // Cache chi tiết đơn hàng đã lấy (key: orderId, value: Order)
    const [orderDetails, setOrderDetails] = useState<{ [key: number]: Order }>(
        {}
    );

    // Trạng thái loading cho từng đơn hàng khi lấy chi tiết
    const [loadingDetails, setLoadingDetails] = useState<{
        [key: number]: boolean;
    }>({});

    // === STATE QUẢN LÝ MODAL ===

    // Hiển thị modal thông báo đơn hàng hết hạn thanh toán
    const [showExpiredModal, setShowExpiredModal] = useState(false);

    // Hiển thị modal xác nhận hủy đơn hàng
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Đơn hàng đang chọn để hủy
    const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

    // Trạng thái đang xử lý hủy đơn
    const [isCancelling, setIsCancelling] = useState(false);

    /**
     * Hàm lấy danh sách đơn hàng từ API
     * Gọi API fetchOrdersByUser để lấy tất cả đơn hàng của user hiện tại
     */
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await orderApi.fetchOrdersByUser();
            setOrders(response.data.data);
        } catch (error: any) {
            toast.error("Không thể tải danh sách đơn hàng");
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Hàm lọc và tìm kiếm đơn hàng
     * Lọc theo:
     * - Tab trạng thái (ALL, PENDING, PROCESSING...)
     * - Từ khóa tìm kiếm (mã đơn, ngày đặt, trạng thái)
     *
     * Hỗ trợ tìm kiếm tiếng Việt có dấu/không dấu và các từ đồng nghĩa
     */
    const filterOrders = useCallback(() => {
        /**
         * Chuẩn hóa chuỗi: viết thường, bỏ dấu tiếng Việt, trim
         * VD: "Công Nghệ" -> "cong nghe"
         */
        const normalize = (s: string) =>
            s
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();

        /**
         * Format ngày theo kiểu Việt Nam: dd/mm/yyyy
         * @param dateStr - Chuỗi ngày ISO hoặc Date string
         * @returns Chuỗi ngày định dạng dd/mm/yyyy
         */
        const formatDateVi = (dateStr: string) => {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return "";
            const dd = String(d.getDate()).padStart(2, "0");
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const yyyy = d.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        };

        /**
         * Bảng từ đồng nghĩa cho các trạng thái đơn hàng
         * Cho phép tìm kiếm theo nhiều cách gọi khác nhau
         * VD: "chờ xác nhận", "pending", "đang chuẩn bị" đều khớp với PENDING
         */
        const statusSynonyms: Record<Order["status"], string[]> = {
            PENDING: [
                "cho xac nhan",
                "choxacnhan",
                "pending",
                "dang chuan bi",
                "đang chuẩn bị",
            ].map(normalize),
            PROCESSING: [
                "dang xu ly",
                "dangxuly",
                "processing",
                "xu ly",
                "xuly",
            ].map(normalize),
            SHIPPING: [
                "dang van chuyen",
                "dangvanchuyen",
                "shipping",
                "van chuyen",
                "vanchuyen",
            ].map(normalize),
            DELIVERED: [
                "da giao",
                "dagiao",
                "da van chuyen",
                "davan chuyen",
                "davanchuyen",
                "hoan thanh",
                "hoanthanh",
                "delivered",
            ].map(normalize),
            CANCELLED: ["da huy", "dahuy", "huy", "cancelled", "canceled"].map(
                normalize
            ),
        };

        // Chuẩn hóa từ khóa tìm kiếm
        const q = normalize(searchQuery);

        /**
         * Kiểm tra xem đơn hàng có khớp với từ khóa tìm kiếm không
         * Kiểm tra theo:
         * 1. Mã đơn hàng (orderCode)
         * 2. Ngày đặt hàng (hỗ trợ tìm một phần: dd/mm/yyyy, dd/mm, mm/yyyy)
         * 3. Trạng thái (trực tiếp hoặc từ đồng nghĩa)
         */
        const matchesQuery = (order: Order) => {
            // Nếu không có từ khóa, hiển tất cả
            if (!q) return true;

            // Kiểm tra khớp với mã đơn hàng
            const codeMatch = normalize(order.orderCode).includes(q);

            // Kiểm tra khớp với ngày (hỗ trợ tìm một phần: dd/mm/yyyy, dd/mm, mm/yyyy)
            const orderDateFormatted = normalize(formatDateVi(order.orderDate));
            const dateMatch = orderDateFormatted.includes(q);

            // Kiểm tra khớp với trạng thái
            const statusKey = order.status;
            // Khớp trực tiếp với key trạng thái (PENDING, PROCESSING...)
            const directKeyMatch = normalize(statusKey).includes(q);
            // Khớp với từ đồng nghĩa
            const synonyms = statusSynonyms[statusKey] || [];
            const synonymMatch = synonyms.includes(q);

            // Khớp nếu bất kỳ điều kiện nào đúng
            return codeMatch || dateMatch || directKeyMatch || synonymMatch;
        };

        // Bước 1: Lọc theo tab trạng thái
        const byTab =
            activeTab === "ALL"
                ? orders // Nếu tab "Tất cả", lấy hết
                : orders.filter((o) => o.status === activeTab); // Không thì lọc theo trạng thái

        // Bước 2: Lọc theo từ khóa tìm kiếm
        const result = byTab.filter((o) => matchesQuery(o));

        // Cập nhật danh sách đã lọc
        setFilteredOrders(result);
    }, [activeTab, orders, searchQuery]);

    /**
     * Hàm xử lý mở/đóng chi tiết đơn hàng
     * @param orderId - ID của đơn hàng muốn xem chi tiết
     *
     * Logic:
     * - Nếu đơn đang mở -> đóng lại
     * - Nếu đơn đang đóng -> mở và fetch chi tiết (nếu chưa có trong cache)
     */
    const handleToggleDetail = useCallback(
        async (orderId: number) => {
            if (expandedOrderId === orderId) {
                setExpandedOrderId(null);
            } else {
                setExpandedOrderId(orderId);

                if (!orderDetails[orderId]) {
                    setLoadingDetails({ ...loadingDetails, [orderId]: true });
                    try {
                        const response = await orderApi.getOrderDetail(orderId);
                        setOrderDetails({
                            ...orderDetails,
                            [orderId]: response.data.data,
                        });
                    } catch (error) {
                        toast.error("Không thể tải chi tiết đơn hàng");
                    } finally {
                        setLoadingDetails({
                            ...loadingDetails,
                            [orderId]: false,
                        });
                    }
                }
            }
        },
        [expandedOrderId, orderDetails, loadingDetails]
    );

    const handleRetryPayment = useCallback(
        async (orderCode: string, expiredAt: string) => {
            const now = new Date().getTime();
            const expiryTime = new Date(expiredAt).getTime();

            if (now >= expiryTime) {
                setShowExpiredModal(true);
                return;
            }

            try {
                const response = await paymentApi.retryVNPay(orderCode);
                if (response.data.data.paymentUrl) {
                    window.location.href = response.data.data
                        .paymentUrl as string;
                } else {
                    toast.error("Không thể lấy link thanh toán");
                }
            } catch (error: any) {
                toast.error(
                    error.response?.data?.message ||
                        "Có lỗi xảy ra khi thanh toán"
                );
            }
        },
        []
    );

    const handleConfirmExpired = useCallback(async () => {
        setShowExpiredModal(false);
        await fetchOrders();
    }, [fetchOrders]);

    const handleCancelExpired = useCallback(() => {
        setShowExpiredModal(false);
    }, []);

    // Xử lý mở modal hủy đơn hàng (chỉ cho đơn PENDING)
    const handleOpenCancelModal = useCallback((order: Order) => {
        setOrderToCancel(order);
        setShowCancelModal(true);
    }, []);

    // Xử lý đóng modal hủy
    const handleCloseCancelModal = useCallback(() => {
        setShowCancelModal(false);
        setOrderToCancel(null);
    }, []);

    // Xử lý xác nhận hủy đơn hàng (gọi API)
    const handleConfirmCancel = useCallback(
        async (orderId: number) => {
            try {
                setIsCancelling(true);
                await orderApi.cancelOrder(orderId);
                toast.success("Đã hủy đơn hàng thành công");
                // Refresh danh sách đơn hàng
                await fetchOrders();
                handleCloseCancelModal();
            } catch (error: any) {
                toast.error(
                    error.response?.data?.message ||
                        "Không thể hủy đơn hàng. Vui lòng thử lại!"
                );
            } finally {
                setIsCancelling(false);
            }
        },
        [fetchOrders, handleCloseCancelModal]
    );

    const getTabCount = useCallback(
        (status: OrderStatus) => {
            if (status === "ALL") return orders.length;
            return orders.filter((order) => order.status === status).length;
        },
        [orders]
    );

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        filterOrders();
    }, [filterOrders]);

    return {
        orders,
        filteredOrders,
        loading,
        activeTab,
        searchQuery,
        expandedOrderId,
        orderDetails,
        loadingDetails,
        showExpiredModal,
        // States và handlers cho cancel order
        showCancelModal,
        orderToCancel,
        isCancelling,
        setActiveTab,
        setSearchQuery,
        handleToggleDetail,
        handleRetryPayment,
        handleConfirmExpired,
        handleCancelExpired,
        handleOpenCancelModal,
        handleCloseCancelModal,
        handleConfirmCancel,
        getTabCount,
        clearSearch: () => setSearchQuery(""),
    };
};
