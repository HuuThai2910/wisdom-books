import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSync } from "react-icons/fa";
// Dùng hook chuyên trách dữ liệu để tách rời logic fetch/cập nhật khỏi UI
import { useOrdersAdmin } from "../../hooks/order/useOrdersAdmin";
import AdminPagination from "../../components/common/AdminPagination";
import OrderFilters from "../../components/admin/OrderFilters";
import OrderTableRow from "../../components/admin/OrderTableRow";
import OrderTableHeader from "../../components/admin/OrderTableHeader";
import OrderDetailModal from "../../components/admin/OrderDetailModal";
import OrderStatusUpdateModal from "../../components/admin/OrderStatusUpdateModal";
import { Order } from "../../types";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";

export default function OrderManagement() {
  const { orders, meta, loading, fetch, updateStatus } = useOrdersAdmin(); // SRP: component chỉ điều phối UI

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Order["status"] | "">(
    ""
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Sort states - quản lý trường và hướng sắp xếp
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Cờ kích hoạt tìm kiếm khi người dùng bấm nút (tránh auto fetch mỗi ký tự)
  const [shouldSearch, setShouldSearch] = useState(false);

  // Lấy dữ liệu khi vào trang/lúc đổi trang, đổi page size hoặc đổi sort
  useEffect(() => {
    fetch(
      currentPage,
      pageSize,
      {
        searchTerm,
        status: selectedStatus || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      },
      sortField || undefined,
      sortDirection
    );
  }, [currentPage, pageSize, sortField, sortDirection]);

  // Lấy dữ liệu khi người dùng bấm tìm kiếm
  useEffect(() => {
    if (shouldSearch) {
      fetchOrdersData();
      setShouldSearch(false);
    }
  }, [shouldSearch]);

  const fetchOrdersData = async () => {
    try {
      await fetch(
        currentPage,
        pageSize,
        {
          searchTerm,
          status: selectedStatus || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
        sortField || undefined,
        sortDirection
      );
    } catch (error: any) {
      toast.error(error || "Không thể tải danh sách đơn hàng");
    }
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(0);
    setShouldSearch(true);
  };

  const handleSearch = () => {
    // Khi tìm kiếm: reset về trang 0 và bật cờ shouldSearch
    setCurrentPage(0);
    setShouldSearch(true);
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleConfirmUpdateStatus = async (
    orderId: number,
    newStatus: Order["status"]
  ) => {
    try {
      // Optimistic update: cập nhật ngay trên UI, API theo sau ở hook
      await updateStatus(orderId, newStatus);

      toast.success("Cập nhật trạng thái thành công!");
      setShowStatusModal(false);
      setSelectedOrder(null);
    } catch (error: any) {
      toast.error(error || "Không thể cập nhật trạng thái");
      // Refetch to get correct state
      fetchOrdersData();
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < (meta?.pages || 1)) {
      setCurrentPage(page);
    }
  };

  // Xử lý thay đổi sort: nếu click vào cột đang sort thì đảo hướng, nếu cột khác thì sort mới
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Đảo hướng sort nếu đang sort cột này
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Sort cột mới, mặc định tăng dần
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <AdminLayout>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <h1 className="text-3xl font-bold wisbook-gradient-text mb-6">
          Quản Lý Đơn Hàng
        </h1>

        {/* Filters */}
        <OrderFilters
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
          startDate={startDate}
          endDate={endDate}
          onSearchTermChange={setSearchTerm}
          onStatusChange={setSelectedStatus}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSearch={handleSearch}
        />
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        {/* Table Header Actions */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Danh sách Đơn hàng
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Làm mới"
            >
              <FaSync className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {/* Cột STT không sort */}
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  STT
                </th>
                {/* Các cột có thể sort: Mã đơn hàng, Ngày đặt, Tổng tiền */}
                <OrderTableHeader
                  label="Mã đơn hàng"
                  sortField="orderCode"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="left"
                />
                {/* Tên khách hàng không sort */}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tên khách hàng
                </th>
                <OrderTableHeader
                  label="Ngày đặt"
                  sortField="orderDate"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="left"
                />
                <OrderTableHeader
                  label="Tổng tiền"
                  sortField="totalPrice"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="left"
                />
                {/* Trạng thái và Thao tác không sort */}
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <OrderTableRow
                    key={order.id}
                    order={order}
                    index={currentPage * pageSize + index}
                    onViewDetail={handleViewDetail}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && (
          <AdminPagination
            meta={meta}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(0);
            }}
          />
        )}
      </motion.div>

      {/* Modals */}
      <OrderDetailModal
        isOpen={showDetailModal}
        order={selectedOrder}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedOrder(null);
        }}
      />

      <OrderStatusUpdateModal
        isOpen={showStatusModal}
        order={selectedOrder}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleConfirmUpdateStatus}
      />
    </AdminLayout>
  );
}
