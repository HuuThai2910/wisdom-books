import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Package,
  AlertTriangle,
  XCircle,
  FileText,
  Calendar,
} from "lucide-react";
import WarehouseLayout from "./WarehouseLayout";
import dashboardApi from "../../api/dashboardApi";
import entryFormApi from "../../api/entryFormApi";
import { EntryForm } from "../../types";

interface OverviewStats {
  totalBooks: number;
  lowStockBooks: number;
  outOfStockBooks: number;
}

export default function WarehouseDashboard() {
  const [user, setUser] = useState<string>("Thủ kho");
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [overview, setOverview] = useState<OverviewStats>({
    totalBooks: 0,
    lowStockBooks: 0,
    outOfStockBooks: 0,
  });
  const [recentEntryForms, setRecentEntryForms] = useState<EntryForm[]>([]);

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData.fullName || "Thủ kho");
      } catch (error) {
        setUser("Thủ kho");
      }
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch overview stats
      const overviewResponse = await dashboardApi.getOverview();
      if (overviewResponse.data.success) {
        setOverview(overviewResponse.data.data);
      }

      // Fetch recent entry forms (last 5)
      const entryFormsResponse = await entryFormApi.getAllEntryForms({
        page: 0,
        size: 5,
        sort: "createdAt,desc",
      });
      if (entryFormsResponse.success) {
        setRecentEntryForms(entryFormsResponse.data.result);
      }
    } catch (error) {
      console.error("Error fetching warehouse data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <WarehouseLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-200">
            <Calendar className="w-5 h-5 text-gray-500" />
            <p className="text-sm text-gray-500">Hôm nay</p>
            <p className="text-lg font-semibold text-gray-900">
              {format(now, "dd/MM/yyyy")}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tổng sách trong kho */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Tổng sách trong kho
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {overview.totalBooks.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Loại sách khác nhau
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Sách sắp hết */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Sách sắp hết
                    </p>
                    <p className="text-2xl font-bold text-yellow-600 mt-2">
                      {overview.lowStockBooks.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Cần nhập thêm</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Sách hết hàng */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Sách hết hàng
                    </p>
                    <p className="text-2xl font-bold text-red-600 mt-2">
                      {overview.outOfStockBooks.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Cần nhập ngay</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Phiếu nhập gần đây */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-700" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Phiếu Nhập Gần Đây
                  </h2>
                </div>
              </div>
              <div className="p-6">
                {recentEntryForms.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Chưa có phiếu nhập nào
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mã Phiếu
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày Tạo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Người Tạo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số Lượng
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tổng Tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentEntryForms.map((form) => (
                          <tr key={form.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{form.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {format(
                                new Date(form.createdAt),
                                "dd/MM/yyyy HH:mm"
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {form.createdBy}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {form.totalQuantity.toLocaleString()} cuốn
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {formatCurrency(form.totalPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Thông báo */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Quản Lý Kho Hàng
              </h2>
              <p className="text-gray-700">
                Bạn có quyền quản lý kho hàng, tạo phiếu nhập và theo dõi tồn
                kho. Sử dụng menu bên trái để:
              </p>
              <ul className="mt-3 space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  Tạo và quản lý phiếu nhập hàng
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  Theo dõi tồn kho và số lượng sách
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  Cảnh báo sách sắp hết và hết hàng
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </WarehouseLayout>
  );
}
