import { RefreshCw } from "lucide-react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { Book as ApiBook } from "../../types";

interface InventoryTableProps {
  books: ApiBook[];
  loading: boolean;
  visibleColumns: {
    stt: boolean;
    isbn: boolean;
    title: boolean;
    year: boolean;
    importPrice: boolean;
    sellingPrice: boolean;
    quantity: boolean;
    status: boolean;
  };
  startIndex: number;
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
}

export default function InventoryTable({
  books,
  loading,
  visibleColumns,
  startIndex,
  sortBy,
  sortDirection,
  onSort,
}: InventoryTableProps) {
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

  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          {visibleColumns.stt && (
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              STT
            </th>
          )}
          {visibleColumns.isbn && (
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => onSort("isbn")}
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
              onClick={() => onSort("title")}
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
              onClick={() => onSort("year")}
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
              onClick={() => onSort("importPrice")}
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
              onClick={() => onSort("sellingPrice")}
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
              onClick={() => onSort("quantity")}
            >
              <div className="flex items-center">
                Tồn kho
                {renderSortIcon("quantity")}
              </div>
            </th>
          )}
          {visibleColumns.status && (
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-36">
              Trạng thái
            </th>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {loading ? (
          <tr>
            <td
              colSpan={Object.values(visibleColumns).filter((v) => v).length}
              className="px-4 py-8 text-center text-gray-500"
            >
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="animate-spin" size={18} />
                <span>Đang tải dữ liệu...</span>
              </div>
            </td>
          </tr>
        ) : books.length === 0 ? (
          <tr>
            <td
              colSpan={Object.values(visibleColumns).filter((v) => v).length}
              className="px-4 py-8 text-center text-gray-500"
            >
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          books.map((book, index) => (
            <tr key={book.id} className="hover:bg-gray-50 transition-colors">
              {visibleColumns.stt && (
                <td className="px-4 py-3 text-sm text-gray-900 text-center">
                  {startIndex + index + 1}
                </td>
              )}
              {visibleColumns.isbn && (
                <td className="px-4 py-3 text-sm text-gray-600">{book.isbn}</td>
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
  );
}
