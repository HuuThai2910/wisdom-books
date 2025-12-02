import { FaRedo } from "react-icons/fa";

interface InventoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  importPriceRange: { min: string; max: string };
  setImportPriceRange: (value: { min: string; max: string }) => void;
  sellingPriceRange: { min: string; max: string };
  setSellingPriceRange: (value: { min: string; max: string }) => void;
  onReset: () => void;
}

export default function InventoryFilters({
  searchTerm,
  setSearchTerm,
  importPriceRange,
  setImportPriceRange,
  sellingPriceRange,
  setSellingPriceRange,
  onReset,
}: InventoryFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên sách / ISBN:
        </label>
        <input
          type="text"
          placeholder="Nhập tên sách hoặc ISBN"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Giá nhập:
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Từ"
            min="0"
            value={importPriceRange.min}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || parseFloat(value) >= 0) {
                setImportPriceRange({
                  ...importPriceRange,
                  min: value,
                });
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <input
            type="number"
            placeholder="Đến"
            min="0"
            value={importPriceRange.max}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || parseFloat(value) >= 0) {
                setImportPriceRange({
                  ...importPriceRange,
                  max: value,
                });
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Giá bán:
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Từ"
            min="0"
            value={sellingPriceRange.min}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || parseFloat(value) >= 0) {
                setSellingPriceRange({
                  ...sellingPriceRange,
                  min: value,
                });
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <input
            type="number"
            placeholder="Đến"
            min="0"
            value={sellingPriceRange.max}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || parseFloat(value) >= 0) {
                setSellingPriceRange({
                  ...sellingPriceRange,
                  max: value,
                });
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>
      </div>

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
  );
}
