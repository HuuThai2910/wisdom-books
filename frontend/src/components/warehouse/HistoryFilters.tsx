import { FaRedo } from "react-icons/fa";

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
          className="px-5 py-2.5 border border-gray-300 bg-white rounded-lg text-sm 
              font-medium transition-all duration-200 hover:bg-gray-50 flex items-center gap-2"
        >
          Lọc tổng hợp
        </button>
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="flex items-center gap-2 bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <FaRedo className="text-sm" />
            Làm lại
          </button>
        </div>
      </div>
    </div>
  );
}
