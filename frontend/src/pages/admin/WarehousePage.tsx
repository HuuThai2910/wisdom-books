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

import { useMemo, useState } from "react";
import AdminLayout from "../admin/AdminLayout";
import { FaSync, FaCog, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Book {
  id: number;
  isbn: string;
  title: string;
  yearOfPublication: number;
  sellingPrice: number;
  importPrice: number;
  quantity: number;
}

const mockBooks: Book[] = [
  {
    id: 1,
    isbn: "978-0-395-19395-9",
    title: "Harry Potter và Hòn đá Phù thủy",
    yearOfPublication: 1997,
    sellingPrice: 150000,
    importPrice: 95000,
    quantity: 0,
  },
  {
    id: 2,
    isbn: "978-0-7432-4722-1",
    title: "Đắc Nhân Tâm",
    yearOfPublication: 1936,
    sellingPrice: 89000,
    importPrice: 55000,
    quantity: 0,
  },
  {
    id: 3,
    isbn: "978-0-452-28423-4",
    title: "1984 - George Orwell",
    yearOfPublication: 1949,
    sellingPrice: 120000,
    importPrice: 78000,
    quantity: 25,
  },
  {
    id: 4,
    isbn: "978-0-06-112008-7",
    title: "Nhà Giả Kim",
    yearOfPublication: 1988,
    sellingPrice: 99000,
    importPrice: 62000,
    quantity: 12,
  },
  {
    id: 5,
    isbn: "978-0-14-017739-8",
    title: "Ông Già Và Biển Cả",
    yearOfPublication: 1952,
    sellingPrice: 85000,
    importPrice: 50000,
    quantity: 0,
  },
  {
    id: 6,
    isbn: "978-0-553-21311-9",
    title: "Chúa tể những chiếc nhẫn",
    yearOfPublication: 1954,
    sellingPrice: 280000,
    importPrice: 180000,
    quantity: 8,
  },
];

export default function WarehousePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [importPriceRange, setImportPriceRange] = useState({
    min: "",
    max: "",
  });
  const [sellingPriceRange, setSellingPriceRange] = useState({
    min: "",
    max: "",
  });
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
  });
  const [showCreateImportModal, setShowCreateImportModal] = useState(false);

  // Lọc sách dựa trên tiêu chí tìm kiếm và bộ lọc
  const filteredBooks = useMemo(() => {
    return mockBooks.filter((book) => {
      const matchSearch =
        searchTerm === "" ||
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm);

      const matchImportPrice =
        (importPriceRange.min === "" ||
          book.importPrice >= Number(importPriceRange.min)) &&
        (importPriceRange.max === "" ||
          book.importPrice <= Number(importPriceRange.max));

      const matchSellingPrice =
        (sellingPriceRange.min === "" ||
          book.sellingPrice >= Number(sellingPriceRange.min)) &&
        (sellingPriceRange.max === "" ||
          book.sellingPrice <= Number(sellingPriceRange.max));

      return matchSearch && matchImportPrice && matchSellingPrice;
    });
  }, [searchTerm, importPriceRange, sellingPriceRange]);

  // Mở modal tạo phiếu nhập kho
  const handleOpenCreateImportModal = () => {
    setShowCreateImportModal(true);
  };

  // Đặt lại bộ lọc
  const handleReset = () => {
    setSearchTerm("");
    setImportPriceRange({ min: "", max: "" });
    setSellingPriceRange({ min: "", max: "" });
  };

  // Làm mới dữ liệu
  const handleRefresh = () => {
    handleReset();
  };

  // Chuyển đổi cột, sử dụng cho cấu hình cột
  const toggleColumn = (key: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Chuyển đổi tất cả cột, sử dụng cho nút "Cột hiện thị"
  const toggleAllColumns = () => {
    const allVisible = Object.values(visibleColumns).every((v) => v);
    const newState = Object.keys(visibleColumns).reduce(
      (acc, key) => ({ ...acc, [key]: !allVisible }),
      {} as typeof visibleColumns
    );
    setVisibleColumns(newState);
  };

  // Phân trang
  const totalPages = Math.ceil(filteredBooks.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i
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
      <div className="bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold wisbook-gradient-text mb-6">
              Quản Lý Kho
            </h1>

            {/* Filter Section */}
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
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Table Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Danh sách Tồn kho
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenCreateImportModal()}
                  className="p-2 px-4 bg-green-900 text-white hover:bg-green-600 font-bold rounded-md transition-colors"
                  title="Tạo phiếu nhập kho"
                >
                  Tạo phiếu nhập kho
                </button>
                <button
                  onClick={handleRefresh}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="Làm mới"
                >
                  <FaSync className="text-gray-600" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowColumnConfig(!showColumnConfig)}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    title="Cấu hình cột"
                  >
                    <FaCog className="text-gray-600" />
                  </button>

                  {/* Column Config Dropdown */}
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
                        {Object.entries(visibleColumns).map(([key, value]) => (
                          <label
                            key={key}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() =>
                                toggleColumn(key as keyof typeof visibleColumns)
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
                            </span>
                          </label>
                        ))}
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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {visibleColumns.stt && (
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        STT
                      </th>
                    )}
                    {visibleColumns.isbn && (
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        ISBN
                      </th>
                    )}
                    {visibleColumns.title && (
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Tên Sách
                      </th>
                    )}
                    {visibleColumns.year && (
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Năm XB
                      </th>
                    )}
                    {visibleColumns.importPrice && (
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Giá nhập
                      </th>
                    )}
                    {visibleColumns.sellingPrice && (
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Giá bán
                      </th>
                    )}
                    {visibleColumns.quantity && (
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Tồn kho
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedBooks.length === 0 ? (
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
                          <td className="px-4 py-3 text-sm">
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                {currentPage * pageSize + 1}-
                {Math.min((currentPage + 1) * pageSize, filteredBooks.length)}{" "}
                trên {filteredBooks.length} rows
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="text-gray-600" />
                </button>

                <div className="flex gap-1">{renderPagination()}</div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="text-gray-600" />
                </button>

                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(0);
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
      </div>

      {/* Modal tạo phiếu nhập kho */}
      {showCreateImportModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto p-4">
          <div className="bg-white w-full max-w-6xl rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-2xl font-bold">Tạo phiếu nhập kho</h2>
              <button
                onClick={() => setShowCreateImportModal(false)}
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

            <div className="p-6">
              {/* PHẦN 1: PHIẾU NHẬP KHO (Ở TRÊN) */}
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800 uppercase">
                    Phiếu nhập kho
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Ngày:{" "}
                    <span className="font-semibold text-gray-800">
                      {new Date().toLocaleDateString("vi-VN")}
                    </span>
                    {" - "}
                    Số:{" "}
                    <span className="font-semibold text-blue-600">NK00012</span>
                  </p>
                </div>

                {/* Thông tin người giao */}
                <div className="mb-4 space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Người giao:</span>{" "}
                    <span className="text-gray-900">
                      CÔNG TY TNHH THIẾT BỊ TÂN AN PHÁT
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Hóa đơn số:</span>{" "}
                    <span className="text-gray-900">1379</span>
                    {" - "}
                    <span className="text-gray-600">ngày 14/07/2022</span>
                  </p>
                </div>

                {/* Bảng sách đã thêm */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="border border-gray-300 px-3 py-2 text-gray-700">
                          STT
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-gray-700">
                          ISBN
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-gray-700">
                          Tên sách
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-gray-700">
                          Năm XB
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-gray-700">
                          Giá nhập
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-gray-700">
                          Số lượng
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-gray-700">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">
                          1
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-gray-800">
                          9786043557121
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-gray-800">
                          Lập trình React từ A-Z
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">
                          2024
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-gray-800">
                          165.000
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">
                          200
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-gray-800">
                          33.000.000
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">
                          2
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-gray-800">
                          9786042112345
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-gray-800">
                          JavaScript Nâng Cao
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">
                          2023
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-gray-800">
                          150.000
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">
                          100
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-gray-800">
                          15.000.000
                        </td>
                      </tr>
                      <tr className="bg-blue-50 font-bold">
                        <td
                          colSpan={6}
                          className="border border-gray-300 px-3 py-2 text-right text-gray-800"
                        >
                          Tổng cộng:
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-blue-600">
                          48.000.000
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Tổng tiền bằng chữ */}
                <div className="mt-4 text-gray-700">
                  <p>
                    <span className="font-medium">
                      - Tổng số tiền (Viết bằng chữ):
                    </span>{" "}
                    <span className="border-b border-gray-400 inline-block min-w-[400px] text-gray-900">
                      Bốn mươi tám triệu đồng chẵn
                    </span>
                  </p>
                  <p className="mt-2">
                    <span className="font-medium">
                      - Số chứng từ gốc kèm theo:
                    </span>{" "}
                    <span className="border-b border-gray-400 inline-block w-32 text-center text-gray-900"></span>
                  </p>
                </div>

                <p className="text-right mt-6 text-gray-700">
                  Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1}{" "}
                  năm {new Date().getFullYear()}
                </p>

                {/* Phần chữ ký - 4 cột */}
                <div className="grid grid-cols-4 gap-4 text-center mt-8 mb-30 text-gray-700">
                  <div>
                    <p className="font-bold text-gray-800">Người lập phiếu</p>
                    <p className="italic text-sm text-gray-600">(Ký, họ tên)</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Người giao hàng</p>
                    <p className="italic text-sm text-gray-600">(Ký, họ tên)</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Thủ kho</p>
                    <p className="italic text-sm text-gray-600">(Ký, họ tên)</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Kế toán trưởng</p>
                    <p className="italic text-sm text-gray-600">
                      (Hoặc bộ phận có nhu cầu nhập)
                    </p>
                  </div>
                </div>
              </div>

              {/* PHẦN 2: TÌM KIẾM VÀ THÊM SÁCH (Ở DƯỚI) */}
              <div className="bg-white border border-gray-300 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Thêm sách vào phiếu
                </h3>

                {/* Thanh tìm kiếm và nút Import Excel */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Tìm kiếm sách theo tên hoặc ISBN..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                  <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Import Excel
                  </button>
                </div>

                {/* Bảng kết quả tìm kiếm */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          ISBN
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Tên sách
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Năm XB
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Giá nhập
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Tồn kho
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockBooks.slice(0, 3).map((book) => (
                        <tr key={book.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-800">
                            {book.isbn}
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {book.title}
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {book.yearOfPublication}
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {book.importPrice.toLocaleString()}₫
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {book.quantity}
                          </td>
                          <td className="px-4 py-3">
                            <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition">
                              Thêm
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateImportModal(false)}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
                >
                  Hủy
                </button>
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                  Lưu phiếu nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
