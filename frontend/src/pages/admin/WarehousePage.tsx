import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import WarehouseLayout from "../warehouse/WarehouseLayout";
import bookApi from "../../api/bookApi";
import entryFormApi from "../../api/entryFormApi";
import { EntryForm, EntryFormDetail } from "../../types";
import { Book as ApiBook } from "../../types";
import toast from "react-hot-toast";
import CreateImportModal from "../../components/warehouse/CreateImportModal";
import EntryFormDetailModal from "../../components/warehouse/EntryFormDetailModal";
import ExportInventoryModal from "../../components/warehouse/ExportInventoryModal";
import InventoryFilters from "../../components/warehouse/InventoryFilters";
import HistoryFilters from "../../components/warehouse/HistoryFilters";
import AdvancedFilterModal from "../../components/warehouse/AdvancedFilterModal";
import WarehouseTableHeader from "../../components/warehouse/WarehouseTableHeader";
import InventoryTable from "../../components/warehouse/InventoryTable";
import HistoryTable from "../../components/warehouse/HistoryTable";
import TablePagination from "../../components/warehouse/TablePagination";

export default function WarehousePage() {
  const location = useLocation();
  const isWarehouseRoute = location.pathname.startsWith("/warehouse");
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [showExportModal, setShowExportModal] = useState(false);
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

  // Lấy dữ liệu sách từ API với bộ lọc và phân trang
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, bookCurrentPage, bookPageSize]);

  // Lấy dữ liệu khi thay đổi tab hoặc phân trang, sắp xếp, bộ lọc
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

  // Lấy dữ liệu sách từ API với bộ lọc và phân trang
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
      setBookCurrentPage(0);
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
    if (activeTab === "inventory") {
      setBookCurrentPage(0);
      fetchBooks();
    } else {
      setCurrentPage(0);
      fetchEntryForms();
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

  const handleHistorySort = (column: string) => {
    if (historySortBy === column) {
      setHistorySortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setHistorySortBy(column);
      setHistorySortDirection("asc");
    }
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

  const handleApplyAdvancedFilter = () => {
    setCurrentPage(0);
    setShowAdvancedFilter(false);
    fetchEntryForms();
  };

  const handleClearAdvancedFilters = () => {
    setAdvancedFilters({
      totalQuantityMin: "",
      totalQuantityMax: "",
      totalAmountMin: "",
      totalAmountMax: "",
    });
    setDateRange({ from: "", to: "" });
    setCurrentPage(0);
  };

  const startIndex =
    activeTab === "inventory"
      ? bookCurrentPage * bookPageSize
      : currentPage * pageSize;

  const LayoutComponent = isWarehouseRoute ? WarehouseLayout : AdminLayout;

  return (
    <LayoutComponent>
      <>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <h1 className="text-3xl font-bold wisbook-gradient-text mb-6">
            Quản Lý Kho
          </h1>

          {activeTab === "inventory" ? (
            // Lọc tồn kho
            <InventoryFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              importPriceRange={importPriceRange}
              setImportPriceRange={setImportPriceRange}
              sellingPriceRange={sellingPriceRange}
              setSellingPriceRange={setSellingPriceRange}
              onReset={handleReset}
            />
          ) : (
            // Lọc lịch sử nhập kho
            <HistoryFilters
              historySearchTerm={historySearchTerm}
              setHistorySearchTerm={setHistorySearchTerm}
              onShowAdvancedFilter={() => setShowAdvancedFilter(true)}
              onReset={handleReset}
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {/* Tiêu đề bảng */}
          <WarehouseTableHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onCreateImport={() => setShowCreateImportModal(true)}
            onRefresh={handleRefresh}
            onReset={handleReset}
            onExport={
              activeTab === "inventory"
                ? () => setShowExportModal(true)
                : undefined
            }
            showColumnConfig={showColumnConfig}
            setShowColumnConfig={setShowColumnConfig}
            visibleColumns={visibleColumns}
            visibleHistoryColumns={visibleHistoryColumns}
            toggleColumn={toggleColumn}
            toggleHistoryColumn={toggleHistoryColumn}
            toggleAllColumns={toggleAllColumns}
            setBookCurrentPage={setBookCurrentPage}
            setCurrentPage={setCurrentPage}
          />

          <div className="overflow-x-auto">
            {activeTab === "inventory" ? (
              // Bảng tồn kho
              <InventoryTable
                books={books}
                loading={loading}
                visibleColumns={visibleColumns}
                startIndex={startIndex}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            ) : (
              // Bảng lịch sử nhập kho
              <HistoryTable
                entryForms={entryForms}
                loading={loadingHistory}
                visibleColumns={visibleHistoryColumns}
                startIndex={startIndex}
                sortBy={historySortBy}
                sortDirection={historySortDirection}
                onSort={handleHistorySort}
                onViewDetail={handleViewDetail}
                onPrintInvoice={handlePrintInvoice}
              />
            )}
          </div>

          {/* Thanh tab */}
          <TablePagination
            currentPage={
              activeTab === "inventory" ? bookCurrentPage : currentPage
            }
            totalPages={
              activeTab === "inventory" ? bookTotalPages : totalPagesHistory
            }
            pageSize={activeTab === "inventory" ? bookPageSize : pageSize}
            totalItems={
              activeTab === "inventory" ? totalBooks : totalEntryForms
            }
            onPageChange={(page) => {
              if (activeTab === "inventory") {
                setBookCurrentPage(page);
              } else {
                setCurrentPage(page);
              }
            }}
            onPageSizeChange={(size) => {
              if (activeTab === "inventory") {
                setBookPageSize(size);
                setBookCurrentPage(0);
              } else {
                setPageSize(size);
                setCurrentPage(0);
              }
            }}
          />
        </motion.div>

        {/* Tạo phiếu nhập */}
        <CreateImportModal
          isOpen={showCreateImportModal}
          onClose={() => setShowCreateImportModal(false)}
          onSubmit={handleSubmitImport}
        />
        {/* Chi tiết phiếu nhập */}
        <EntryFormDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          entryForm={selectedImport}
          details={entryFormDetails}
          loading={loadingDetails}
        />
        {/* Xuất ra file Excel */}
        <ExportInventoryModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
        />

        {/* Lọc nâng cao */}
        <AdvancedFilterModal
          isOpen={showAdvancedFilter}
          onClose={() => setShowAdvancedFilter(false)}
          dateRange={dateRange}
          setDateRange={setDateRange}
          advancedFilters={advancedFilters}
          setAdvancedFilters={setAdvancedFilters}
          onApply={handleApplyAdvancedFilter}
          onClearFilters={handleClearAdvancedFilters}
        />
      </>
    </LayoutComponent>
  );
}
