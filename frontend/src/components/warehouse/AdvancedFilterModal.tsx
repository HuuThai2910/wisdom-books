interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: { from: string; to: string };
  setDateRange: (value: { from: string; to: string }) => void;
  advancedFilters: {
    totalQuantityMin: string;
    totalQuantityMax: string;
    totalAmountMin: string;
    totalAmountMax: string;
  };
  setAdvancedFilters: (value: {
    totalQuantityMin: string;
    totalQuantityMax: string;
    totalAmountMin: string;
    totalAmountMax: string;
  }) => void;
  onApply: () => void;
  onClearFilters: () => void;
}

export default function AdvancedFilterModal({
  isOpen,
  onClose,
  dateRange,
  setDateRange,
  advancedFilters,
  setAdvancedFilters,
  onApply,
  onClearFilters,
}: AdvancedFilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl">
        <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold">Lọc tổng hợp</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày tạo:
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Từ ngày"
              />
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Đến ngày"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tổng số lượng:
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                value={advancedFilters.totalQuantityMin}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || parseFloat(value) >= 0) {
                    setAdvancedFilters({
                      ...advancedFilters,
                      totalQuantityMin: value,
                    });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Từ"
              />
              <input
                type="number"
                min="0"
                value={advancedFilters.totalQuantityMax}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || parseFloat(value) >= 0) {
                    setAdvancedFilters({
                      ...advancedFilters,
                      totalQuantityMax: value,
                    });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Đến"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tổng tiền:
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                value={advancedFilters.totalAmountMin}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || parseFloat(value) >= 0) {
                    setAdvancedFilters({
                      ...advancedFilters,
                      totalAmountMin: value,
                    });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Từ (VNĐ)"
              />
              <input
                type="number"
                min="0"
                value={advancedFilters.totalAmountMax}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || parseFloat(value) >= 0) {
                    setAdvancedFilters({
                      ...advancedFilters,
                      totalAmountMax: value,
                    });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Đến (VNĐ)"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClearFilters}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
          >
            Xóa bộ lọc
          </button>
          <button
            onClick={onApply}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}
