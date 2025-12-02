// Bộ lọc cho trang quản lý đơn hàng (UI):
// - Input tìm kiếm đa trường (mã đơn, tên KH, SĐT)
// - Chọn khoảng ngày (một ngày hoặc từ ngày - đến ngày)
// - Chọn trạng thái
// - Nút Tìm kiếm (không auto-search)
import { Search, XCircle, Calendar } from "lucide-react";
import { Order } from "../../types";

// Props nhận từ trang cha để điều khiển state (controlled inputs)
interface OrderFiltersProps {
  searchTerm: string;
  selectedStatus: Order["status"] | "";
  startDate: string;
  endDate: string;
  onSearchTermChange: (value: string) => void;
  onStatusChange: (value: Order["status"] | "") => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSearch: () => void;
}

const OrderFilters = ({
  searchTerm,
  selectedStatus,
  startDate,
  endDate,
  onSearchTermChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onSearch,
}: OrderFiltersProps) => {
  // Bấm Enter trong ô tìm kiếm sẽ kích hoạt tìm kiếm (giống nút)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    // Nền xám nhạt, bo góc, đổ bóng nhẹ
    <div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex flex-col gap-4">
        {/* Hàng 1: Ô tìm kiếm đa trường */}
        <div className="w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo mã đơn, tên khách hàng, số điện thoại..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchTermChange("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Hàng 2: Ngày bắt đầu/kết thúc, Trạng thái và nút Tìm kiếm */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Chọn khoảng ngày (có thể chỉ chọn 1 trong 2) */}
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            {/* Từ ngày: có nút X để xóa nhanh */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="Từ ngày"
                  />
                </div>
                {startDate && (
                  <button
                    onClick={() => onStartDateChange("")}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                    type="button"
                    title="Xóa"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Đến ngày: khóa min = startDate để tránh chọn lùi */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    min={startDate || undefined}
                    className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="Đến ngày"
                  />
                </div>
                {endDate && (
                  <button
                    onClick={() => onEndDateChange("")}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                    type="button"
                    title="Xóa"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Trạng thái đơn hàng */}
          <div className="w-full md:w-64">
            <select
              value={selectedStatus}
              onChange={(e) =>
                onStatusChange(e.target.value as Order["status"] | "")
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="SHIPPING">Đang vận chuyển</option>
              <option value="DELIVERED">Đã giao</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          {/* Nút kích hoạt tìm kiếm (không auto-search) */}
          <div className="w-full md:w-auto">
            <button
              onClick={onSearch}
              className="w-full md:w-auto px-8 py-2 bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Search className="h-5 w-5" />
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
