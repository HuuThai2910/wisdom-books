import { RefreshCw, Eye, Download } from "lucide-react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { format } from "date-fns";
import { EntryForm } from "../../types";

interface HistoryTableProps {
  entryForms: EntryForm[];
  loading: boolean;
  visibleColumns: {
    stt: boolean;
    id: boolean;
    totalQuantity: boolean;
    totalAmount: boolean;
    createdDate: boolean;
    createdBy: boolean;
  };
  startIndex: number;
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  onViewDetail: (item: EntryForm) => void;
  onPrintInvoice: (item: EntryForm) => void;
}

export default function HistoryTable({
  entryForms,
  loading,
  visibleColumns,
  startIndex,
  sortBy,
  sortDirection,
  onSort,
  onViewDetail,
  onPrintInvoice,
}: HistoryTableProps) {
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
          {visibleColumns.id && (
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => onSort("id")}
            >
              <div className="flex items-center">
                Mã phiếu
                {renderSortIcon("id")}
              </div>
            </th>
          )}
          {visibleColumns.totalQuantity && (
            <th
              className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => onSort("totalQuantity")}
            >
              <div className="flex items-center">
                Tổng số lượng
                {renderSortIcon("totalQuantity")}
              </div>
            </th>
          )}
          {visibleColumns.totalAmount && (
            <th
              className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => onSort("totalPrice")}
            >
              <div className="flex items-center">
                Tổng tiền
                {renderSortIcon("totalPrice")}
              </div>
            </th>
          )}
          {visibleColumns.createdDate && (
            <th
              className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => onSort("createdAt")}
            >
              <div className="flex items-center">
                Ngày tạo
                {renderSortIcon("createdAt")}
              </div>
            </th>
          )}
          {visibleColumns.createdBy && (
            <th
              className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => onSort("user.fullName")}
            >
              <div className="flex items-center">
                Người tạo
                {renderSortIcon("user.fullName")}
              </div>
            </th>
          )}
          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Thao tác
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {loading ? (
          <tr>
            <td
              colSpan={
                Object.values(visibleColumns).filter((v) => v).length + 1
              }
              className="px-4 py-8 text-center text-gray-500"
            >
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="animate-spin" size={18} />
                <span>Đang tải dữ liệu...</span>
              </div>
            </td>
          </tr>
        ) : entryForms.length === 0 ? (
          <tr>
            <td
              colSpan={
                Object.values(visibleColumns).filter((v) => v).length + 1
              }
              className="px-4 py-8 text-center text-gray-500"
            >
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          entryForms.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              {visibleColumns.stt && (
                <td className="px-4 py-3 text-sm text-gray-900 text-center">
                  {startIndex + index + 1}
                </td>
              )}
              {visibleColumns.id && (
                <td className="px-4 py-3 text-sm text-blue-600 font-semibold">
                  {item.id}
                </td>
              )}
              {visibleColumns.totalQuantity && (
                <td className="px-4 py-3 text-sm text-gray-900">
                  {item.totalQuantity}
                </td>
              )}
              {visibleColumns.totalAmount && (
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {item.totalPrice.toLocaleString()}₫
                </td>
              )}
              {visibleColumns.createdDate && (
                <td className="px-4 py-3 text-sm text-gray-600">
                  {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm")}
                </td>
              )}
              {visibleColumns.createdBy && (
                <td className="px-4 py-3 text-sm text-gray-900">
                  {item.createdBy}
                </td>
              )}
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => onViewDetail(item)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onPrintInvoice(item)}
                    className="text-green-600 hover:text-green-800 transition-colors"
                    title="Tải PDF"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
