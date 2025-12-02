import { useState } from 'react';

interface UserTableHeaderProps {
  onAddUser: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterRole: string;
  filterStatus: string;
  onFilterRoleChange: (value: string) => void;
  onFilterStatusChange: (value: string) => void;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (sortBy: string, direction: 'asc' | 'desc') => void;
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
  sortBy,
  sortDirection,
  onSortChange,
  selectedCount,
  onExportExcel
}: UserTableHeaderProps) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  return (
    <div className="flex flex-col md:flex-row justify-between text-black items-start md:items-center gap-4 mb-8 mt-2">
      <h1 className="text-2xl font-semibold text-gray-900">Quản lý người dùng</h1>
      
      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-[300px]">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm 
              outline-none transition-all duration-300 focus:border-[#2196F3] focus:ring-4 
              focus:ring-[#2196F3]/10"
          />
        </div>
        
        {/* Filter Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="px-5 py-2.5 border border-gray-300 bg-white rounded-lg text-sm 
              font-medium transition-all duration-200 hover:bg-gray-50 flex items-center gap-2">
            Lọc {(filterRole || filterStatus) && <span className="ml-1 bg-[#2196F3] text-white text-xs px-2 py-0.5 rounded-full">•</span>}
          </button>
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                <select
                  value={filterRole}
                  onChange={(e) => onFilterRoleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20 outline-none"
                >
                  <option value="">Tất cả</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STAFF">Nhân viên</option>
                  <option value="CUSTOMER">Khách hàng</option>
                  <option value="WARE_HOUSE_STAFF">Thủ kho</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select
                  value={filterStatus}
                  onChange={(e) => onFilterStatusChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20 outline-none"
                >
                  <option value="">Tất cả</option>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Ngừng hoạt động</option>
                </select>
              </div>
              <button
                onClick={() => {
                  onFilterRoleChange('');
                  onFilterStatusChange('');
                }}
                className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
        
        {/* Sort Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="px-5 py-2.5 border border-gray-300 bg-white rounded-lg text-sm 
              font-medium transition-all duration-200 hover:bg-gray-50 flex items-center gap-2">
            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
            Sắp xếp {sortBy && <span className="ml-1 bg-[#2196F3] text-white text-xs px-2 py-0.5 rounded-full">•</span>}
          </button>
          {showSortDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">
              <button
                onClick={() => { onSortChange('fullName', sortDirection); setShowSortDropdown(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex justify-between items-center"
              >
                Tên {sortBy === 'fullName' && '✓'}
              </button>
              <button
                onClick={() => { onSortChange('email', sortDirection); setShowSortDropdown(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex justify-between items-center"
              >
                Email {sortBy === 'email' && '✓'}
              </button>
              <button
                onClick={() => { onSortChange('role', sortDirection); setShowSortDropdown(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex justify-between items-center"
              >
                Vai trò {sortBy === 'role' && '✓'}
              </button>
              <button
                onClick={() => { onSortChange('status', sortDirection); setShowSortDropdown(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex justify-between items-center"
              >
                Trạng thái {sortBy === 'status' && '✓'}
              </button>
              <button
                onClick={() => { onSortChange('createdAt', sortDirection); setShowSortDropdown(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex justify-between items-center"
              >
                Ngày tạo {sortBy === 'createdAt' && '✓'}
              </button>
              <hr className="my-2" />
              <button
                onClick={() => { onSortChange(sortBy, sortDirection === 'asc' ? 'desc' : 'asc'); setShowSortDropdown(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-[#2196F3] font-medium"
              >
                {sortDirection === 'asc' ? '↓ Giảm dần' : '↑ Tăng dần'}
              </button>
              <button
                onClick={() => { onSortChange('', 'asc'); setShowSortDropdown(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-600"
              >
                Xóa sắp xếp
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={onExportExcel}
          disabled={selectedCount === 0}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold 
            transition-all duration-300 flex items-center gap-2
            ${
              selectedCount > 0 
                ? 'bg-green-600 text-white hover:-translate-y-0.5 hover:bg-green-700 shadow-lg hover:shadow-xl cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          Xuất Excel {selectedCount > 0 && `(${selectedCount})`}
        </button>
        
        <button
          onClick={onAddUser}
          className="px-5 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg text-sm font-semibold 
            transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          + Thêm mới
        </button>
      </div>
    </div>
  );
};

export default UserTableHeader;
