import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { Order } from "../../types";
import Breadcrumb from "../../components/common/Breadcrumb";
import OrderCard from "../../components/orders/OrderCard";
import OrderDetailAccordion from "../../components/orders/OrderDetailAccordion";
import ExpiredOrderModal from "../../components/orders/ExpiredOrderModal";
import { useOrders } from "../../hooks/order/useOrders";
import OrdersSearchBar from "../../components/orders/OrdersSearchBar";

type OrderStatus = "ALL" | Order["status"];

const TABS: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { key: "ALL", label: "Tất cả", icon: <Package className="w-4 h-4" /> },
    {
        key: "PENDING",
        label: "Chờ xác nhận",
        icon: <Clock className="w-4 h-4" />,
    },
    {
        key: "PROCESSING",
        label: "Đang xử lý",
        icon: <Clock className="w-4 h-4" />,
    },
    {
        key: "SHIPPING",
        label: "Đang vận chuyển",
        icon: <Truck className="w-4 h-4" />,
    },
    {
        key: "DELIVERED",
        label: "Đã vận chuyển",
        icon: <CheckCircle className="w-4 h-4" />,
    },
    {
        key: "CANCELLED",
        label: "Đã hủy",
        icon: <XCircle className="w-4 h-4" />,
    },
];

const OrdersPage = () => {
    const {
        filteredOrders,
        loading,
        activeTab,
        searchQuery,
        expandedOrderId,
        orderDetails,
        loadingDetails,
        showExpiredModal,
        setActiveTab,
        setSearchQuery,
        handleToggleDetail,
        handleRetryPayment,
        handleConfirmExpired,
        handleCancelExpired,
        getTabCount,
        clearSearch,
    } = useOrders();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-30 px-30">
                <div className="max-w-7xl mx-auto">
                    <Breadcrumb items={[{ label: "Đơn hàng của tôi" }]} />

                    <div className="mb-2.5 flex flex-col gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Lịch sử đơn hàng
                        </h1>
                        <div className="w-full">
                            <OrdersSearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                onClear={clearSearch}
                            />
                            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                                {searchQuery ? (
                                    <span>
                                        Tìm thấy{" "}
                                        <span className="font-medium text-gray-900">
                                            {filteredOrders.length}
                                        </span>{" "}
                                        đơn hàng
                                    </span>
                                ) : (
                                    <span className="invisible">
                                        placeholder
                                    </span>
                                )}
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Xóa tìm kiếm
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow-sm mb-6">
                        <div className="flex border-b overflow-x-auto justify-between">
                            {TABS.map((tab) => {
                                const count = getTabCount(tab.key);
                                const isActive = activeTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                                            isActive
                                                ? "border-blue-600 text-blue-600"
                                                : "border-transparent text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        {tab.icon}
                                        <span>{tab.label}</span>
                                        <span
                                            className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                                                isActive
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "bg-blue-100 text-blue-600"
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="space-y-4">
                        {filteredOrders.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                <div className="max-w-md mx-auto">
                                    {searchQuery ? (
                                        // Không tìm thấy kết quả
                                        <>
                                            <div className="mb-6">
                                                <div className="w-32 h-32 mx-auto bg-linear-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center">
                                                    <Package
                                                        className="w-16 h-16 text-gray-400"
                                                        strokeWidth={1.5}
                                                    />
                                                </div>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                                Không tìm thấy đơn hàng
                                            </h2>
                                            <p className="text-gray-500 mb-6 text-base">
                                                Không có đơn hàng nào khớp với
                                                từ khóa tìm kiếm của bạn
                                            </p>
                                            <button
                                                onClick={clearSearch}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                Xóa tìm kiếm
                                            </button>
                                        </>
                                    ) : (
                                        // Chưa có đơn hàng
                                        <>
                                            <div className="mb-6 relative">
                                                <div className="w-32 h-32 mx-auto bg-linear-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
                                                    <Package
                                                        className="w-16 h-16 text-blue-500"
                                                        strokeWidth={1.5}
                                                    />
                                                </div>
                                                <div className="absolute top-0 right-1/2 translate-x-16 -translate-y-2">
                                                    <div className="w-6 h-6 bg-indigo-400 rounded-full animate-pulse"></div>
                                                </div>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                                Bạn chưa có đơn hàng nào
                                            </h2>
                                            <p className="text-gray-500 mb-8 text-base">
                                                Hãy bắt đầu mua sắm để tạo đơn
                                                hàng đầu tiên của bạn!
                                            </p>
                                            <button
                                                onClick={() =>
                                                    (window.location.href =
                                                        "/books")
                                                }
                                                className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                            >
                                                <Package className="w-5 h-5" />
                                                <span>Khám phá sản phẩm</span>
                                            </button>
                                            <div className="mt-10 flex items-center justify-center gap-8 text-sm text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                    <span>Giao hàng nhanh</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-blue-400" />
                                                    <span>
                                                        Hoàn tiền dễ dàng
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            filteredOrders.map((order: Order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    isExpanded={expandedOrderId === order.id}
                                    onToggleDetail={handleToggleDetail}
                                    onRetryPayment={handleRetryPayment}
                                >
                                    {orderDetails[order.id] && (
                                        <OrderDetailAccordion
                                            order={orderDetails[order.id]}
                                            loading={
                                                loadingDetails[order.id] ||
                                                false
                                            }
                                        />
                                    )}
                                </OrderCard>
                            ))
                        )}
                    </div>
                </div>

                <ExpiredOrderModal
                    isOpen={showExpiredModal}
                    onClose={handleCancelExpired}
                    onConfirm={handleConfirmExpired}
                />
            </div>
        </>
    );
};

export default OrdersPage;
