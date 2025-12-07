import { Plus, RefreshCw, Settings, FileDown } from "lucide-react";

interface WarehouseTableHeaderProps {
  activeTab: "inventory" | "history";
  setActiveTab: (tab: "inventory" | "history") => void;
  onCreateImport: () => void;
  onRefresh: () => void;
  onReset?: () => void;
  onExport?: () => void;
  showColumnConfig: boolean;
  setShowColumnConfig: (value: boolean) => void;
  visibleColumns: any;
  visibleHistoryColumns: any;
  toggleColumn: (key: any) => void;
  toggleHistoryColumn: (key: any) => void;
  toggleAllColumns: () => void;
  setBookCurrentPage: (page: number) => void;
  setCurrentPage: (page: number) => void;
}

export default function WarehouseTableHeader({
  activeTab,
  setActiveTab,
  onCreateImport,
  onRefresh,
  onReset,
  onExport,
  showColumnConfig,
  setShowColumnConfig,
  visibleColumns,
  visibleHistoryColumns,
  toggleColumn,
  toggleHistoryColumn,
  toggleAllColumns,
  setBookCurrentPage,
  setCurrentPage,
}: WarehouseTableHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex gap-1">
        <button
          onClick={() => {
            setActiveTab("inventory");
            setBookCurrentPage(0);
          }}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === "inventory"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Danh sách Tồn kho
        </button>
        <button
          onClick={() => {
            setActiveTab("history");
            setCurrentPage(0);
          }}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === "history"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Lịch sử Nhập kho
        </button>
      </div>

      <div className="flex items-center gap-2">
        {activeTab === "inventory" && onExport && (
          <button
            onClick={onExport}
            className="p-2 px-4 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-md transition-colors flex items-center gap-2"
            title="Xuất Excel"
          >
            <FileDown size={18} />
            Xuất Excel
          </button>
        )}
        <button
          onClick={onCreateImport}
          className="p-2 px-4 bg-green-600 text-white hover:bg-green-700 font-bold rounded-md transition-colors flex items-center gap-2"
          title="Tạo phiếu nhập kho"
        >
          <Plus size={18} />
          Tạo phiếu nhập
        </button>
        <button
          onClick={() => {
            // First perform refresh action
            onRefresh && onRefresh();
            // Then reset filters if provided
            onReset && onReset();
          }}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title="Làm mới / Đặt lại bộ lọc"
        >
          <RefreshCw className="text-gray-600" size={18} />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowColumnConfig(!showColumnConfig)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Cấu hình cột"
          >
            <Settings className="text-gray-600" size={18} />
          </button>

          {showColumnConfig && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 w-64">
              <div className="flex items-center justify-between mb-3 pb-2 border-b">
                <span className="font-semibold text-gray-700">Cấu hình</span>
                <button
                  onClick={toggleAllColumns}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Cột hiện thị
                </button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {activeTab === "inventory"
                  ? Object.entries(visibleColumns).map(([key, value]) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={() => toggleColumn(key)}
                          className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {key === "stt" && "STT"}
                          {key === "isbn" && "ISBN"}
                          {key === "title" && "Tên Sách"}
                          {key === "year" && "Năm XB"}
                          {key === "importPrice" && "Giá nhập"}
                          {key === "sellingPrice" && "Giá bán"}
                          {key === "quantity" && "Tồn kho"}
                          {key === "status" && "Trạng thái"}
                        </span>
                      </label>
                    ))
                  : Object.entries(visibleHistoryColumns).map(
                      ([key, value]) => (
                        <label
                          key={key}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={value as boolean}
                            onChange={() => toggleHistoryColumn(key)}
                            className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {key === "stt" && "STT"}
                            {key === "id" && "Mã phiếu"}
                            {key === "totalQuantity" && "Tổng số lượng"}
                            {key === "totalAmount" && "Tổng tiền"}
                            {key === "createdDate" && "Ngày tạo"}
                            {key === "createdBy" && "Người tạo"}
                          </span>
                        </label>
                      )
                    )}
              </div>
              <button
                onClick={() => setShowColumnConfig(false)}
                className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
              >
                Đóng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
