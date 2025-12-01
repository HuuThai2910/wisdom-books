import { useState, useEffect, useCallback } from "react";
import { Order } from "../../types";
import orderApi from "../../api/orderApi";
import paymentApi from "../../api/paymentApi";
import toast from "react-hot-toast";

type OrderStatus = "ALL" | Order["status"];

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<OrderStatus>("ALL");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [orderDetails, setOrderDetails] = useState<{ [key: number]: Order }>(
        {}
    );
    const [loadingDetails, setLoadingDetails] = useState<{
        [key: number]: boolean;
    }>({});
    const [showExpiredModal, setShowExpiredModal] = useState(false);
    // State quản lý modal hủy đơn hàng
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

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

    const filterOrders = useCallback(() => {
        const normalize = (s: string) =>
            s
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();

        const formatDateVi = (dateStr: string) => {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return "";
            const dd = String(d.getDate()).padStart(2, "0");
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const yyyy = d.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        };

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

        const q = normalize(searchQuery);

        const matchesQuery = (order: Order) => {
            if (!q) return true;

            // Check order code
            const codeMatch = normalize(order.orderCode).includes(q);

            // Check date fragment (supports dd/mm/yyyy, dd/mm, mm/yyyy)
            const orderDateFormatted = normalize(formatDateVi(order.orderDate));
            const dateMatch = orderDateFormatted.includes(q);

            // Check status (synonyms or direct key)
            const statusKey = order.status;
            const directKeyMatch = normalize(statusKey).includes(q);
            const synonyms = statusSynonyms[statusKey] || [];
            const synonymMatch = synonyms.includes(q);

            return codeMatch || dateMatch || directKeyMatch || synonymMatch;
        };

        const byTab =
            activeTab === "ALL"
                ? orders
                : orders.filter((o) => o.status === activeTab);

        const result = byTab.filter((o) => matchesQuery(o));
        setFilteredOrders(result);
    }, [activeTab, orders, searchQuery]);

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
