// Thư viện table: TanStack Table
// npm install @tanstack/react-table

// Thư viện in phiếu (react-to-print)
// npm install react-to-print

// Format ngày tháng (dd/MM/yyyy)
// npm install date-fns

// Đọc file Excel (.xlsx, .xls)
// npm install xlsx
// npm install --save-dev @types/xlsx    # (không bắt buộc nhưng tốt cho TypeScript)

// Đọc file CSV
// npm install papaparse
// npm install --save-dev @types/papaparse   # (tốt cho TypeScript)
import { useMemo, useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import bookApi from "../../api/bookApi";
import entryFormApi from "../../api/entryFormApi";
import { EntryForm, EntryFormDetail } from "../../types";
import { Book as ApiBook } from "../../types";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  RefreshCw,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import CreateImportModal from "../../components/warehouse/CreateImportModal";
import EntryFormDetailModal from "../../components/warehouse/EntryFormDetailModal";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaTrash,
  FaDownload,
} from "react-icons/fa";

export default function WarehousePage() {
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [bookPageSize, setBookPageSize] = useState(10);
  const [bookCurrentPage, setBookCurrentPage] = useState(0);
  const [bookTotalPages, setBookTotalPages] = useState(1);
  const [entryForms, setEntryForms] = useState<EntryForm[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [totalPagesHistory, setTotalPagesHistory] = useState(1);
  const [totalEntryForms, setTotalEntryForms] = useState(0);
  const [activeTab, setActiveTab] = useState<"inventory" | "history">(
    "inventory"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [historySearchTerm, setHistorySearchTerm] = useState("");
  const [importPriceRange, setImportPriceRange] = useState({
    min: "",
    max: "",
  });
  const [sellingPriceRange, setSellingPriceRange] = useState({
    min: "",
    max: "",
  });
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    stt: true,
    isbn: true,
    title: true,
    year: true,
    importPrice: true,
    sellingPrice: true,
    quantity: true,
    status: true,
  });
  const [visibleHistoryColumns, setVisibleHistoryColumns] = useState({
    stt: true,
    id: true,
    totalQuantity: true,
    totalAmount: true,
    createdDate: true,
    createdBy: true,
  });
  const [showCreateImportModal, setShowCreateImportModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedImport, setSelectedImport] = useState<EntryForm | null>(null);
  const [entryFormDetails, setEntryFormDetails] = useState<EntryFormDetail[]>(
    []
  );
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    totalQuantityMin: "",
    totalQuantityMax: "",
    totalAmountMin: "",
    totalAmountMax: "",
  });
  const [sortBy, setSortBy] = useState<string>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [historySortBy, setHistorySortBy] = useState<string>("createdAt");
  const [historySortDirection, setHistorySortDirection] = useState<
    "asc" | "desc"
  >("desc");

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, bookCurrentPage, bookPageSize]);

  useEffect(() => {
    if (activeTab === "inventory") {
      fetchBooks();
    } else {
      fetchEntryForms();
    }
  }, [
    activeTab,
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
    importPriceRange.min,
    importPriceRange.max,
    sellingPriceRange.min,
    sellingPriceRange.max,
  ]);

  useEffect(() => {
    if (activeTab === "history") {
      const timer = setTimeout(() => {
        fetchEntryForms();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [historySearchTerm]);

  useEffect(() => {
    if (activeTab === "history") {
      fetchEntryForms();
    }
  }, [
    historySortBy,
    historySortDirection,
    advancedFilters.totalQuantityMin,
    advancedFilters.totalQuantityMax,
    advancedFilters.totalAmountMin,
    advancedFilters.totalAmountMax,
    dateRange.from,
    dateRange.to,
  ]);

  const fetchEntryForms = async () => {
    try {
      setLoadingHistory(true);
      const filterParts: string[] = [];

      // Search by ID or user's full name
      if (historySearchTerm.trim()) {
        const searchValue = historySearchTerm.trim();
        // Check if search term is a number (ID search)
        if (/^\d+$/.test(searchValue)) {
          filterParts.push(`id:${searchValue}`);
        } else {
          // Search by user's full name
          filterParts.push(`user.fullName~'*${searchValue}*'`);
        }
      }

      // Filter by total quantity
      if (advancedFilters.totalQuantityMin) {
        filterParts.push(`totalQuantity>=${advancedFilters.totalQuantityMin}`);
      }
      if (advancedFilters.totalQuantityMax) {
        filterParts.push(`totalQuantity<=${advancedFilters.totalQuantityMax}`);
      }

      // Filter by total amount (totalPrice)
      if (advancedFilters.totalAmountMin) {
        filterParts.push(`totalPrice>=${advancedFilters.totalAmountMin}`);
      }
      if (advancedFilters.totalAmountMax) {
        filterParts.push(`totalPrice<=${advancedFilters.totalAmountMax}`);
      }

      // Filter by date range
      if (dateRange.from) {
        filterParts.push(`createdAt>='${dateRange.from}T00:00:00'`);
      }
      if (dateRange.to) {
        filterParts.push(`createdAt<='${dateRange.to}T23:59:59'`);
      }

      const filterQuery = filterParts.join(" and ");
      const sortQuery = `${historySortBy},${historySortDirection}`;

      const response = await entryFormApi.getAllEntryForms({
        page: currentPage,
        size: pageSize,
        sort: sortQuery,
        filter: filterQuery || undefined,
      });

      if (response.data) {
        const { result, meta } = response.data;
        setEntryForms(result || []);
        setTotalPagesHistory(meta?.pages || 1);
        setTotalEntryForms(meta?.total || 0);
      }
    } catch (error) {
      console.error("Error fetching entry forms:", error);
      toast.error("Không thể tải dữ liệu lịch sử nhập kho");
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const filterParts: string[] = [];

      // Search by title or ISBN
      if (searchTerm.trim()) {
        filterParts.push(`(title~'*${searchTerm}*' or isbn~'*${searchTerm}*')`);
      }

      // Filter by import price range
      if (importPriceRange.min) {
        filterParts.push(`importPrice>=${importPriceRange.min}`);
      }
      if (importPriceRange.max) {
        filterParts.push(`importPrice<=${importPriceRange.max}`);
      }

      // Filter by selling price range
      if (sellingPriceRange.min) {
        filterParts.push(`sellingPrice>=${sellingPriceRange.min}`);
      }
      if (sellingPriceRange.max) {
        filterParts.push(`sellingPrice<=${sellingPriceRange.max}`);
      }

      const filterQuery = filterParts.join(" and ");
      // Ưu tiên sort theo quantity để hết hàng lên đầu
      const sortQuery =
        sortBy === "quantity" ? `${sortBy},${sortDirection}` : `quantity,asc`;

      const response = await bookApi.getAllBooks({
        page: bookCurrentPage,
        size: bookPageSize,
        sort: sortQuery,
        filter: filterQuery || undefined,
      });

      if (response.data) {
        const { result, meta } = response.data;
        setBooks(result || []);
        setBookTotalPages(meta?.pages || 1);
        setTotalBooks(meta?.total || 0);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Không thể tải dữ liệu sách");
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = entryForms;

  const handleOpenCreateImportModal = () => {
    setShowCreateImportModal(true);
  };

  const handleSubmitImport = async (importData: {
    supplier: string;
    invoiceNumber: string;
    books: any[];
  }) => {
    try {
      await entryFormApi.createEntryForm(importData);
      toast.success("Tạo phiếu nhập kho thành công!");
      setShowCreateImportModal(false);
      fetchEntryForms();
      if (activeTab === "inventory") {
        fetchBooks();
      }
    } catch (error: any) {
      console.error("Error creating import:", error);
      const errorMessage =
        error.response?.data?.message || "Không thể tạo phiếu nhập kho";
      toast.error(errorMessage);
    }
  };

  const handleViewDetail = async (importItem: EntryForm) => {
    setSelectedImport(importItem);
    setShowDetailModal(true);
    setLoadingDetails(true);
    try {
      const response = await entryFormApi.getEntryFormDetails(importItem.id);
      if (response.data) {
        setEntryFormDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching entry form details:", error);
      toast.error("Không thể tải chi tiết phiếu nhập kho");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handlePrintInvoice = async (importItem: EntryForm) => {
    const loadingToast = toast.loading("Đang tạo file PDF...");
    try {
      const response = await entryFormApi.getEntryFormDetails(importItem.id);
      if (response.data) {
        const { downloadEntryFormPDF } = await import(
          "../../util/pdfGenerator"
        );
        downloadEntryFormPDF(importItem, response.data);
        toast.success("Đã tải xuống phiếu nhập kho", { id: loadingToast });
      } else {
        toast.error("Không có dữ liệu chi tiết", { id: loadingToast });
      }
    } catch (error: any) {
      console.error("Error printing invoice:", error);
      toast.error(
        `Không thể tải PDF: ${error?.message || "Lỗi không xác định"}`,
        { id: loadingToast }
      );
    }
  };

  const handleReset = () => {
    if (activeTab === "inventory") {
      setSearchTerm("");
      setImportPriceRange({ min: "", max: "" });
      setSellingPriceRange({ min: "", max: "" });
      setSortBy("title");
      setSortDirection("asc");
      setCurrentPage(0);
    } else {
      setHistorySearchTerm("");
      setDateRange({ from: "", to: "" });
      setAdvancedFilters({
        totalQuantityMin: "",
        totalQuantityMax: "",
        totalAmountMin: "",
        totalAmountMax: "",
      });
      setHistorySortBy("createdAt");
      setHistorySortDirection("desc");
      setCurrentPage(0);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(0);
    if (activeTab === "inventory") {
      fetchBooks();
    } else {
      fetchEntryForms();
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return {
        label: "Hết hàng",
        className: "bg-red-100 text-red-800",
      };
    } else if (quantity < 10) {
      return {
        label: "Gần hết hàng",
        className: "bg-yellow-100 text-yellow-800",
      };
    } else {
      return {
        label: "Còn hàng",
        className: "bg-green-100 text-green-800",
      };
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <FaSortUp className="ml-1 text-blue-500" />
    ) : (
      <FaSortDown className="ml-1 text-blue-500" />
    );
  };

  const handleHistorySort = (column: string) => {
    if (historySortBy === column) {
      setHistorySortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setHistorySortBy(column);
      setHistorySortDirection("asc");
    }
  };

  const renderHistorySortIcon = (column: string) => {
    if (historySortBy !== column) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return historySortDirection === "asc" ? (
      <FaSortUp className="ml-1 text-blue-500" />
    ) : (
      <FaSortDown className="ml-1 text-blue-500" />
    );
  };

  const toggleColumn = (key: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleHistoryColumn = (key: keyof typeof visibleHistoryColumns) => {
    setVisibleHistoryColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAllColumns = () => {
    if (activeTab === "inventory") {
      const allVisible = Object.values(visibleColumns).every((v) => v);
      const newState = Object.keys(visibleColumns).reduce(
        (acc, key) => ({ ...acc, [key]: !allVisible }),
        {} as typeof visibleColumns
      );
      setVisibleColumns(newState);
    } else {
      const allVisible = Object.values(visibleHistoryColumns).every((v) => v);
      const newState = Object.keys(visibleHistoryColumns).reduce(
        (acc, key) => ({ ...acc, [key]: !allVisible }),
        {} as typeof visibleHistoryColumns
      );
      setVisibleHistoryColumns(newState);
    }
  };

  const startIndex = currentPage * pageSize;
  const paginatedBooks = books;
  const paginatedHistory = entryForms;
  const currentTotalPages =
    activeTab === "inventory" ? bookTotalPages : totalPagesHistory;

  const handlePageChange = (page: number) => {
    if (activeTab === "inventory") {
      setBookCurrentPage(page);
    } else {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    const current = activeTab === "inventory" ? bookCurrentPage : currentPage;
    let start = Math.max(0, current - Math.floor(maxVisible / 2));
    let end = Math.min(currentTotalPages - 1, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            current === i
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-6">
            Quản Lý Kho
          </h1>

          {activeTab === "inventory" ? (
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
                      setImportPriceRange((prev) => ({
                        ...prev,
                        min: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={importPriceRange.max}
                    onChange={(e) =>
                      setImportPriceRange((prev) => ({
                        ...prev,
                        max: e.target.value,
                      }))
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
                      setSellingPriceRange((prev) => ({
                        ...prev,
                        min: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={sellingPriceRange.max}
                    onChange={(e) =>
                      setSellingPriceRange((prev) => ({
                        ...prev,
                        max: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-semibold transition-colors"
                >
                  Làm lại
                </button>
              </div>
            </div>
          ) : (
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
                  onClick={() => setShowAdvancedFilter(true)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold transition-colors"
                >
                  Lọc tổng hợp
                </button>

                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-semibold transition-colors"
                >
                  Làm lại
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-4 pt-4">
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
                <button
                  onClick={handleOpenCreateImportModal}
                  className="p-2 px-4 bg-green-600 text-white hover:bg-green-700 font-bold rounded-md transition-colors flex items-center gap-2"
                  title="Tạo phiếu nhập kho"
                >
                  <Plus size={18} />
                  Tạo phiếu nhập
                </button>
                <button
                  onClick={handleRefresh}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="Làm mới"
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
                        <span className="font-semibold text-gray-700">
                          Cấu hình
                        </span>
                        <button
                          onClick={toggleAllColumns}
                          className="text-sm text-blue-500 hover:text-blue-600"
                        >
                          Cột hiện thị
                        </button>
                      </div>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {activeTab === "inventory"
                          ? Object.entries(visibleColumns).map(
                              ([key, value]) => (
                                <label
                                  key={key}
                                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                >
                                  <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={() =>
                                      toggleColumn(
                                        key as keyof typeof visibleColumns
                                      )
                                    }
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
                              )
                            )
                          : Object.entries(visibleHistoryColumns).map(
                              ([key, value]) => (
                                <label
                                  key={key}
                                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                >
                                  <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={() =>
                                      toggleHistoryColumn(
                                        key as keyof typeof visibleHistoryColumns
                                      )
                                    }
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
          </div>

          <div className="overflow-x-auto">
            {activeTab === "inventory" ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {visibleColumns.stt && (
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        STT
                      </th>
                    )}
                    {visibleColumns.isbn && (
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleSort("isbn")}
                      >
                        <div className="flex items-center">
                          ISBN
                          {renderSortIcon("isbn")}
                        </div>
                      </th>
                    )}
                    {visibleColumns.title && (
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleSort("title")}
                      >
                        <div className="flex items-center">
                          Tên Sách
                          {renderSortIcon("title")}
                        </div>
                      </th>
                    )}
                    {visibleColumns.year && (
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleSort("year")}
                      >
                        <div className="flex items-center">
                          Năm XB
                          {renderSortIcon("year")}
                        </div>
                      </th>
                    )}
                    {visibleColumns.importPrice && (
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleSort("importPrice")}
                      >
                        <div className="flex items-center">
                          Giá nhập
                          {renderSortIcon("importPrice")}
                        </div>
                      </th>
                    )}
                    {visibleColumns.sellingPrice && (
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleSort("sellingPrice")}
                      >
                        <div className="flex items-center">
                          Giá bán
                          {renderSortIcon("sellingPrice")}
                        </div>
                      </th>
                    )}
                    {visibleColumns.quantity && (
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleSort("quantity")}
                      >
                        <div className="flex items-center">
                          Tồn kho
                          {renderSortIcon("quantity")}
                        </div>
                      </th>
                    )}
                    {visibleColumns.status && (
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-36">
                        Trạng thái
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={
                          Object.values(visibleColumns).filter((v) => v).length
                        }
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="animate-spin" size={18} />
                          <span>Đang tải dữ liệu...</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedBooks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={
                          Object.values(visibleColumns).filter((v) => v).length
                        }
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    paginatedBooks.map((book, index) => (
                      <tr
                        key={book.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {visibleColumns.stt && (
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {startIndex + index + 1}
                          </td>
                        )}
                        {visibleColumns.isbn && (
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {book.isbn}
                          </td>
                        )}
                        {visibleColumns.title && (
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            {book.title}
                          </td>
                        )}
                        {visibleColumns.year && (
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {book.yearOfPublication}
                          </td>
                        )}
                        {visibleColumns.importPrice && (
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            {book.importPrice.toLocaleString()}₫
                          </td>
                        )}
                        {visibleColumns.sellingPrice && (
                          <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                            {book.sellingPrice.toLocaleString()}₫
                          </td>
                        )}
                        {visibleColumns.quantity && (
                          <td className="px-4 py-3 text-sm w-20">
                            <span
                              className={`font-bold ${
                                book.quantity === 0
                                  ? "text-red-600"
                                  : book.quantity < 20
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              }`}
                            >
                              {book.quantity}
                            </span>
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                getStockStatus(book.quantity).className
                              }`}
                            >
                              {getStockStatus(book.quantity).label}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {visibleHistoryColumns.stt && (
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        STT
                      </th>
                    )}
                    {visibleHistoryColumns.id && (
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleHistorySort("id")}
                      >
                        <div className="flex items-center">
                          Mã phiếu
                          {renderHistorySortIcon("id")}
                        </div>
                      </th>
                    )}
                    {visibleHistoryColumns.totalQuantity && (
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleHistorySort("totalQuantity")}
                      >
                        <div className="flex items-center">
                          Tổng số lượng
                          {renderHistorySortIcon("totalQuantity")}
                        </div>
                      </th>
                    )}
                    {visibleHistoryColumns.totalAmount && (
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleHistorySort("totalPrice")}
                      >
                        <div className="flex items-center">
                          Tổng tiền
                          {renderHistorySortIcon("totalPrice")}
                        </div>
                      </th>
                    )}
                    {visibleHistoryColumns.createdDate && (
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleHistorySort("createdAt")}
                      >
                        <div className="flex items-center">
                          Ngày tạo
                          {renderHistorySortIcon("createdAt")}
                        </div>
                      </th>
                    )}
                    {visibleHistoryColumns.createdBy && (
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleHistorySort("user.fullName")}
                      >
                        <div className="flex items-center">
                          Người tạo
                          {renderHistorySortIcon("user.fullName")}
                        </div>
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Tác vụ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loadingHistory ? (
                    <tr>
                      <td
                        colSpan={
                          Object.values(visibleHistoryColumns).filter((v) => v)
                            .length + 1
                        }
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="animate-spin" size={18} />
                          <span>Đang tải dữ liệu...</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedHistory.length === 0 ? (
                    <tr>
                      <td
                        colSpan={
                          Object.values(visibleHistoryColumns).filter((v) => v)
                            .length + 1
                        }
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    paginatedHistory.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {visibleHistoryColumns.stt && (
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {startIndex + index + 1}
                          </td>
                        )}
                        {visibleHistoryColumns.id && (
                          <td className="px-4 py-3 text-sm text-blue-600 font-semibold">
                            {item.id}
                          </td>
                        )}
                        {visibleHistoryColumns.totalQuantity && (
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.totalQuantity}
                          </td>
                        )}
                        {visibleHistoryColumns.totalAmount && (
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            {item.totalPrice.toLocaleString()}₫
                          </td>
                        )}
                        {visibleHistoryColumns.createdDate && (
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {format(
                              new Date(item.createdAt),
                              "dd/MM/yyyy HH:mm"
                            )}
                          </td>
                        )}
                        {visibleHistoryColumns.createdBy && (
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.createdBy}
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetail(item)}
                              className="hover:text-blue-600 transition-colors"
                              title="Xem chi tiết"
                            >
                              <FaEye size={16} color="blue" />
                            </button>
                            <button
                              onClick={() => handlePrintInvoice(item)}
                              className="hover:text-green-600 transition-colors"
                              title="Tải PDF"
                            >
                              <FaDownload size={16} color="green" />
                            </button>
                            <button
                              className="hover:text-red-600 transition-colors"
                              title="Xóa"
                            >
                              <FaTrash size={16} color="red" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              {activeTab === "inventory" ? (
                <>
                  Hiển thị {bookCurrentPage * bookPageSize + 1}-
                  {Math.min((bookCurrentPage + 1) * bookPageSize, totalBooks)}{" "}
                  trên {totalBooks} sách
                </>
              ) : (
                <>
                  {currentPage * pageSize + 1}-
                  {Math.min(
                    (currentPage + 1) * pageSize,
                    filteredHistory.length
                  )}{" "}
                  trên {filteredHistory.length} rows
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(0)}
                disabled={
                  (activeTab === "inventory"
                    ? bookCurrentPage
                    : currentPage) === 0
                }
                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title="Trang đầu"
              >
                <span className="text-gray-600 text-sm font-medium">«</span>
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="text-gray-600" size={18} />
              </button>

              <div className="flex gap-1">{renderPagination()}</div>

              <button
                onClick={() =>
                  handlePageChange(
                    (activeTab === "inventory"
                      ? bookCurrentPage
                      : currentPage) + 1
                  )
                }
                disabled={
                  (activeTab === "inventory" ? bookCurrentPage : currentPage) >=
                  currentTotalPages - 1
                }
                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="text-gray-600" size={18} />
              </button>
              <button
                onClick={() => handlePageChange(currentTotalPages - 1)}
                disabled={
                  (activeTab === "inventory" ? bookCurrentPage : currentPage) >=
                  currentTotalPages - 1
                }
                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title="Trang cuối"
              >
                <span className="text-gray-600 text-sm font-medium">»</span>
              </button>

              <select
                value={activeTab === "inventory" ? bookPageSize : pageSize}
                onChange={(e) => {
                  if (activeTab === "inventory") {
                    setBookPageSize(Number(e.target.value));
                    setBookCurrentPage(0);
                  } else {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(0);
                  }
                }}
                className="ml-2 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={50}>50 / trang</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <CreateImportModal
        isOpen={showCreateImportModal}
        onClose={() => setShowCreateImportModal(false)}
        onSubmit={handleSubmitImport}
      />

      <EntryFormDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        entryForm={selectedImport}
        details={entryFormDetails}
        loading={loadingDetails}
      />

      {showAdvancedFilter && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl">
            <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-bold">Lọc tổng hợp</h2>
              <button
                onClick={() => setShowAdvancedFilter(false)}
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
                      setDateRange((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Từ ngày"
                  />
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        to: e.target.value,
                      }))
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
                    value={advancedFilters.totalQuantityMin}
                    onChange={(e) =>
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        totalQuantityMin: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Từ"
                  />
                  <input
                    type="number"
                    value={advancedFilters.totalQuantityMax}
                    onChange={(e) =>
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        totalQuantityMax: e.target.value,
                      }))
                    }
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
                    value={advancedFilters.totalAmountMin}
                    onChange={(e) =>
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        totalAmountMin: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Từ (VNĐ)"
                  />
                  <input
                    type="number"
                    value={advancedFilters.totalAmountMax}
                    onChange={(e) =>
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        totalAmountMax: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Đến (VNĐ)"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 pb-6">
              <button
                onClick={() => {
                  setAdvancedFilters({
                    totalQuantityMin: "",
                    totalQuantityMax: "",
                    totalAmountMin: "",
                    totalAmountMax: "",
                  });
                  setDateRange({ from: "", to: "" });
                  setCurrentPage(0);
                }}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
              >
                Xóa bộ lọc
              </button>
              <button
                onClick={() => {
                  setCurrentPage(0);
                  setShowAdvancedFilter(false);
                  fetchEntryForms();
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
