import { useState, useEffect } from "react";
import bookApi from "../../api/bookApi";
import { Book as ApiBook } from "../../types";
import toast from "react-hot-toast";
import { X, Download, Search } from "lucide-react";
import * as XLSX from "xlsx";

interface ExportInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportInventoryModal({
  isOpen,
  onClose,
}: ExportInventoryModalProps) {
  const [allBooks, setAllBooks] = useState<ApiBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<ApiBook[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>(["all"]);
  const [bookPageSize, setBookPageSize] = useState(10);
  const [bookCurrentPage, setBookCurrentPage] = useState(0);
  const [bookTotalPages, setBookTotalPages] = useState(1);
  const [totalBooksCount, setTotalBooksCount] = useState(0);
  const [loadingBooks, setLoadingBooks] = useState(false);

  const fetchAllBooks = async () => {
    try {
      setLoadingBooks(true);
      const response = await bookApi.getAllBooks({
        page: bookCurrentPage,
        size: bookPageSize,
        sort: "quantity,asc",
        filter: undefined,
      });

      if (response.data) {
        const { result, meta } = response.data;
        const books = result || [];
        setAllBooks(books);
        setFilteredBooks(books);
        setBookTotalPages(meta?.pages || 1);
        setTotalBooksCount(meta?.total || 0);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Không thể tải dữ liệu sách");
    } finally {
      setLoadingBooks(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAllBooks();
      setSelectedBooks(new Set());
      setSearchKeyword("");
      setSearchYear("");
      setStatusFilter(["all"]);
    }
  }, [isOpen, bookCurrentPage, bookPageSize]);

  useEffect(() => {
    let filtered = [...allBooks];

    // Filter by search keyword
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.isbn.toLowerCase().includes(keyword) ||
          book.title.toLowerCase().includes(keyword)
      );
    }

    // Filter by year
    if (searchYear.trim()) {
      filtered = filtered.filter(
        (book) => book.yearOfPublication.toString() === searchYear
      );
    }

    // Filter by status
    if (!statusFilter.includes("all")) {
      filtered = filtered.filter((book) => {
        if (statusFilter.includes("outOfStock") && book.quantity === 0)
          return true;
        if (
          statusFilter.includes("lowStock") &&
          book.quantity > 0 &&
          book.quantity < 10
        )
          return true;
        if (statusFilter.includes("inStock") && book.quantity >= 10)
          return true;
        return false;
      });
    }

    setFilteredBooks(filtered);
  }, [searchKeyword, searchYear, statusFilter, allBooks]);

  const handleStatusChange = (status: string) => {
    if (status === "all") {
      setStatusFilter(["all"]);
    } else {
      const newFilter = statusFilter.filter((s) => s !== "all");
      if (newFilter.includes(status)) {
        const updated = newFilter.filter((s) => s !== status);
        setStatusFilter(updated.length === 0 ? ["all"] : updated);
      } else {
        setStatusFilter([...newFilter, status]);
      }
    }
  };

  const handleSelectBook = (isbn: string) => {
    const newSelected = new Set(selectedBooks);
    if (newSelected.has(isbn)) {
      newSelected.delete(isbn);
    } else {
      newSelected.add(isbn);
    }
    setSelectedBooks(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedBooks.size === filteredBooks.length) {
      setSelectedBooks(new Set());
    } else {
      setSelectedBooks(new Set(filteredBooks.map((b) => b.isbn)));
    }
  };

  const handleExportExcel = () => {
    if (selectedBooks.size === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sách để xuất Excel");
      return;
    }

    const booksToExport = allBooks.filter((book) =>
      selectedBooks.has(book.isbn)
    );

    // Prepare data for Excel
    const excelData = booksToExport.map((book) => ({
      ISBN: book.isbn,
      "Tên sách": book.title,
      "Năm xuất bản": book.yearOfPublication,
      "Giá nhập": book.importPrice,
      "Số lượng": book.quantity,
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    ws["!cols"] = [
      { wch: 15 }, // ISBN
      { wch: 50 }, // Tên sách
      { wch: 15 }, // Năm xuất bản
      { wch: 15 }, // Giá nhập
      { wch: 12 }, // Số lượng
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách tồn kho");

    // Generate filename with timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .substring(0, 19);
    const filename = `DanhSachTonKho_${timestamp}.xlsx`;

    // Download file
    XLSX.writeFile(wb, filename);
    toast.success(`Đã xuất ${selectedBooks.size} sách ra file Excel`);
    onClose();
  };

  const handleClose = () => {
    setSelectedBooks(new Set());
    setSearchKeyword("");
    setSearchYear("");
    setStatusFilter(["all"]);
    setBookCurrentPage(0);
    onClose();
  };

  if (!isOpen) return null;

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Hết hàng", color: "text-red-600" };
    if (quantity < 10) return { label: "Gần hết", color: "text-yellow-600" };
    return { label: "Còn hàng", color: "text-green-600" };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">Xuất Excel Danh Sách Tồn Kho</h2>
          <button
            onClick={handleClose}
            className="hover:bg-white/20 rounded-full p-2 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search by ISBN/Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm (ISBN/Tên sách)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập ISBN hoặc tên sách"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {/* Search by Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Năm xuất bản
              </label>
              <input
                type="number"
                placeholder="Nhập năm xuất bản"
                value={searchYear}
                onChange={(e) => setSearchYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statusFilter.includes("all")}
                    onChange={() => handleStatusChange("all")}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Tất cả</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statusFilter.includes("outOfStock")}
                    onChange={() => handleStatusChange("outOfStock")}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Hết hàng</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statusFilter.includes("lowStock")}
                    onChange={() => handleStatusChange("lowStock")}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Gần hết</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statusFilter.includes("inStock")}
                    onChange={() => handleStatusChange("inStock")}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Còn hàng</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Đã chọn:{" "}
              <span className="font-semibold">{selectedBooks.size}</span> /{" "}
              {filteredBooks.length} sách
            </p>
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {selectedBooks.size === filteredBooks.length
                ? "Bỏ chọn tất cả"
                : "Chọn tất cả"}
            </button>
          </div>
        </div>

        {/* Book List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loadingBooks ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Không tìm thấy sách nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredBooks.length > 0 &&
                          selectedBooks.size === filteredBooks.length
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ISBN
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tên sách
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Năm XB
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Giá nhập
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBooks.map((book) => {
                    const status = getStockStatus(book.quantity);
                    return (
                      <tr
                        key={book.isbn}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedBooks.has(book.isbn)}
                            onChange={() => handleSelectBook(book.isbn)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {book.isbn}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {book.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {book.yearOfPublication}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {book.importPrice.toLocaleString()}₫
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`font-bold ${status.color}`}>
                            {book.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={`font-semibold ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Hiển thị {bookCurrentPage * bookPageSize + 1}-
            {Math.min((bookCurrentPage + 1) * bookPageSize, totalBooksCount)}{" "}
            trên {totalBooksCount} sách
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setBookCurrentPage(Math.max(0, bookCurrentPage - 1))
              }
              disabled={bookCurrentPage === 0}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
            >
              Trước
            </button>
            <span className="text-sm text-gray-600">
              {bookCurrentPage + 1} / {bookTotalPages}
            </span>
            <button
              onClick={() =>
                setBookCurrentPage(
                  Math.min(bookTotalPages - 1, bookCurrentPage + 1)
                )
              }
              disabled={bookCurrentPage >= bookTotalPages - 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
            >
              Sau
            </button>
            <select
              value={bookPageSize}
              onChange={(e) => {
                setBookPageSize(Number(e.target.value));
                setBookCurrentPage(0);
              }}
              className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm text-gray-700"
            >
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-2xl border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition"
          >
            Hủy
          </button>
          <button
            onClick={handleExportExcel}
            disabled={selectedBooks.size === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download size={18} />
            Xuất Excel ({selectedBooks.size})
          </button>
        </div>
      </div>
    </div>
  );
}
