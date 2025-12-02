import { useState } from "react";

interface UserTableHeaderProps {
  onAddUser: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterRole: string;
  filterStatus: string;
  onFilterRoleChange: (value: string) => void;
  onFilterStatusChange: (value: string) => void;
  selectedCount: number;
  onExportExcel: () => void;
}

const UserTableHeader = ({
  onAddUser,
  searchValue,
  onSearchChange,
  filterRole,
  filterStatus,
  onFilterRoleChange,
  onFilterStatusChange,
  selectedCount,
  onExportExcel,
}: UserTableHeaderProps) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  return (
    <div className="flex flex-col md:flex-row justify-between text-black items-start md:items-center gap-4 mb-8 mt-2">
      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-[300px]">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="px-5 py-2.5 border border-gray-300 bg-white rounded-lg text-sm 
              font-medium transition-all duration-200 hover:bg-gray-50 flex items-center gap-2"
          >
            Lọc{" "}
            {(filterRole || filterStatus) && (
              <span className="ml-1 bg-[#2196F3] text-white text-xs px-2 py-0.5 rounded-full">
                •
              </span>
            )}
          </button>
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => onFilterRoleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Tất cả</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STAFF">Nhân viên</option>
                  <option value="CUSTOMER">Khách hàng</option>
                  <option value="WARE_HOUSE_STAFF">Thủ kho</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => onFilterStatusChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Tất cả</option>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Ngừng hoạt động</option>
                </select>
              </div>
              <button
                onClick={() => {
                  onFilterRoleChange("");
                  onFilterStatusChange("");
                }}
                className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onExportExcel}
          disabled={selectedCount === 0}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold 
            transition-all flex items-center gap-2 shadow-md
            ${
              selectedCount > 0
                ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transform hover:scale-105 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Xuất Excel {selectedCount > 0 && `(${selectedCount})`}
        </button>

        <button
          onClick={onAddUser}
          className="px-5 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-semibold 
            transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          + Thêm mới
        </button>
      </div>
    </div>
  );
};

export default UserTableHeader;
