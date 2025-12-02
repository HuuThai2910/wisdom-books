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
            value={importPriceRange.min}
            onChange={(e) =>
              setImportPriceRange({
                ...importPriceRange,
                min: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <input
            type="number"
            placeholder="Đến"
            value={importPriceRange.max}
            onChange={(e) =>
              setImportPriceRange({
                ...importPriceRange,
                max: e.target.value,
              })
            }
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
            value={sellingPriceRange.min}
            onChange={(e) =>
              setSellingPriceRange({
                ...sellingPriceRange,
                min: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <input
            type="number"
            placeholder="Đến"
            value={sellingPriceRange.max}
            onChange={(e) =>
              setSellingPriceRange({
                ...sellingPriceRange,
                max: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>
      </div>

      <div className="flex items-end gap-2">
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
