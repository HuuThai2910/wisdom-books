// Component phân trang dùng lại cho trang Admin
// Nhận meta (pages/total) và callback đổi trang, đổi pageSize
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
  meta?: { pages: number; total: number } | null;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function AdminPagination({
  meta,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: AdminPaginationProps) {
  // Không có meta thì không hiển thị phân trang
  if (!meta) return null;
  const totalPages = meta.pages;
  // Dùng React.ReactNode để tránh lỗi namespace JSX khi build
  const pages: React.ReactNode[] = [];
  const maxVisible = 5;

  pages.push(
    <button
      key={0}
      onClick={() => onPageChange(0)}
      className={`px-3 py-1 rounded ${
        currentPage === 0
          ? "bg-blue-500 text-white"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
      }`}
    >
      1
    </button>
  );

  if (totalPages <= maxVisible + 2) {
    // Ít trang: hiển thị tất cả
    for (let i = 1; i < totalPages - 1; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
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
  } else if (currentPage <= 3) {
    // Ở đầu danh sách: 1 2 3 4 5 ... N
    for (let i = 1; i < maxVisible; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
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
    pages.push(
      <span key="ellipsis-end" className="px-2 text-gray-500">
        ...
      </span>
    );
  } else if (currentPage >= totalPages - 4) {
    // Ở cuối danh sách: 1 ... N-4 N-3 N-2 N-1 N
    pages.push(
      <span key="ellipsis-start" className="px-2 text-gray-500">
        ...
      </span>
    );
    for (let i = totalPages - maxVisible; i < totalPages - 1; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
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
  } else {
    // Ở giữa: 1 ... P-1 P P+1 ... N
    pages.push(
      <span key="ellipsis-start" className="px-2 text-gray-500">
        ...
      </span>
    );
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
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
    pages.push(
      <span key="ellipsis-end" className="px-2 text-gray-500">
        ...
      </span>
    );
  }

  if (totalPages > 1) {
    pages.push(
      <button
        key={totalPages - 1}
        onClick={() => onPageChange(totalPages - 1)}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages - 1
            ? "bg-blue-500 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
      >
        {totalPages}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <div className="text-sm text-gray-700">
        Hiển thị {currentPage * pageSize + 1}-
        {Math.min((currentPage + 1) * pageSize, meta.total)} trên {meta.total}{" "}
        đơn hàng
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          title="Trang đầu"
        >
          <span className="text-gray-600 text-sm font-medium">«</span>
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="text-gray-600" size={18} />
        </button>
        {pages}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="text-gray-600" size={18} />
        </button>
        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          title="Trang cuối"
        >
          <span className="text-gray-600 text-sm font-medium">»</span>
        </button>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="ml-2 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        >
          <option value={5}>5 / trang</option>
          <option value={10}>10 / trang</option>
          <option value={20}>20 / trang</option>
          <option value={50}>50 / trang</option>
        </select>
      </div>
    </div>
  );
}
