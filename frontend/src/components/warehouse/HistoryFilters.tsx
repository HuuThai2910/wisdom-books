interface HistoryFiltersProps {
  historySearchTerm: string;
  setHistorySearchTerm: (value: string) => void;
  onShowAdvancedFilter: () => void;
  onReset: () => void;
}

export default function HistoryFilters({
  historySearchTerm,
  setHistorySearchTerm,
  onShowAdvancedFilter,
  onReset,
}: HistoryFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="md:col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mã phiếu / Người tạo:
        </label>
        <input
          type="text"
          placeholder="Nhập mã phiếu hoặc tên người tạo"
          value={historySearchTerm}
          onChange={(e) => setHistorySearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
      </div>

      <div className="md:col-span-2 flex items-end gap-4">
        <button
          onClick={onShowAdvancedFilter}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold transition-colors"
        >
          Lọc tổng hợp
        </button>

        <button
          onClick={onReset}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-semibold transition-colors"
        >
          Làm lại
        </button>
      </div>
    </div>
  );
}
