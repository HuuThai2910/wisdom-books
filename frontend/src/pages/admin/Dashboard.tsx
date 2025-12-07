import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import AdminLayout from "../admin/AdminLayout";
import dashboardApi from "../../api/dashboardApi";
import toast from "react-hot-toast";
import { DateRange, DashboardStats, DashboardOverview } from "../../types";
import TopBooksChart from "../../components/dashboard/TopBooksChart";
import MonthlyRevenueChart from "../../components/dashboard/MonthlyRevenueChart";
import TopCategoriesChart from "../../components/dashboard/TopCategoriesChart";
import StockStatusChart from "../../components/dashboard/StockStatusChart";

export default function AdminDashboard() {
  const [user, setUser] = useState("Admin");

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [filterType, setFilterType] = useState<"day" | "month" | "year">(
    "month"
  );
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [dateRange, setDateRange] = useState<DateRange>({
    from: format(firstDayOfMonth, "yyyy-MM-dd"),
    to: format(lastDayOfMonth, "yyyy-MM-dd"),
  });

  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProfit: 0,
    customerGrowthRate: 0,
    cancelledOrderRate: 0,
    newCustomersThisMonth: 0,
    newBooksImported: 0,
    cancelledOrders: 0,
  });

  const [overview, setOverview] = useState<DashboardOverview>({
    totalBooks: 0,
    totalCustomers: 0,
    outOfStockBooks: 0,
    lowStockBooks: 0,
  });

  const [loading, setLoading] = useState(false);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [topBooks, setTopBooks] = useState<any[]>([]);
  const [topCategories, setTopCategories] = useState<any[]>([]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const startDateTime = `${dateRange.from}T00:00:00+07:00`;
      const endDateTime = `${dateRange.to}T23:59:59+07:00`;

      const response = await dashboardApi.getStats(startDateTime, endDateTime);
      if (response.data && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchOverview = async () => {
    try {
      const response = await dashboardApi.getOverview();
      if (response.data && response.data.data) {
        setOverview(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard overview:", error);
    }
  };

  const fetchMonthlyRevenue = async () => {
    try {
      const response = await dashboardApi.getMonthlyRevenue(selectedYear);
      if (response.data && response.data.data) {
        setMonthlyRevenue(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
    }
  };

  const fetchTopBooks = async () => {
    try {
      const startDateTime = `${dateRange.from}T00:00:00+07:00`;
      const endDateTime = `${dateRange.to}T23:59:59+07:00`;
      const response = await dashboardApi.getTopBooks(
        startDateTime,
        endDateTime,
        10
      );
      console.log("Top books response:", response);
      if (response.data && response.data.data) {
        console.log("Top books data:", response.data.data);
        setTopBooks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching top books:", error);
    }
  };

  const fetchTopCategories = async () => {
    try {
      const startDateTime = `${dateRange.from}T00:00:00+07:00`;
      const endDateTime = `${dateRange.to}T23:59:59+07:00`;
      const response = await dashboardApi.getTopCategories(
        startDateTime,
        endDateTime,
        10
      );
      console.log("Top categories response:", response);
      if (response.data && response.data.data) {
        console.log("Top categories data:", response.data.data);
        setTopCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching top categories:", error);
    }
  };

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUser(user.fullName || "Admin");
      } catch (error) {
        setUser("Admin");
      }
    }

    fetchOverview();
    fetchStats();
    fetchMonthlyRevenue();
    fetchTopBooks();
    fetchTopCategories();
  }, []);

  const handleApplyFilter = () => {
    fetchStats();
    fetchTopBooks();
    fetchTopCategories();
  };

  const handleReset = async () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setFilterType("month");
    setSelectedMonth(now.getMonth() + 1);
    setSelectedYear(now.getFullYear());
    const newDateRange = {
      from: format(firstDayOfMonth, "yyyy-MM-dd"),
      to: format(lastDayOfMonth, "yyyy-MM-dd"),
    };
    setDateRange(newDateRange);

    // Fetch với dateRange mới ngay lập tức
    try {
      setLoading(true);
      const startDateTime = `${newDateRange.from}T00:00:00+07:00`;
      const endDateTime = `${newDateRange.to}T23:59:59+07:00`;
      const response = await dashboardApi.getStats(startDateTime, endDateTime);
      if (response.data && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterTypeChange = (type: "day" | "month" | "year") => {
    setFilterType(type);

    if (type === "month") {
      const month = selectedMonth;
      const year = selectedYear;
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      setDateRange({
        from: format(firstDay, "yyyy-MM-dd"),
        to: format(lastDay, "yyyy-MM-dd"),
      });
    } else if (type === "year") {
      const year = selectedYear;
      const firstDay = new Date(year, 0, 1);
      const lastDay = new Date(year, 11, 31);
      setDateRange({
        from: format(firstDay, "yyyy-MM-dd"),
        to: format(lastDay, "yyyy-MM-dd"),
      });
    }
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    const firstDay = new Date(selectedYear, month - 1, 1);
    const lastDay = new Date(selectedYear, month, 0);
    setDateRange({
      from: format(firstDay, "yyyy-MM-dd"),
      to: format(lastDay, "yyyy-MM-dd"),
    });
  };

  const handleYearChange = async (year: number) => {
    setSelectedYear(year);
    if (filterType === "month") {
      const firstDay = new Date(year, selectedMonth - 1, 1);
      const lastDay = new Date(year, selectedMonth, 0);
      setDateRange({
        from: format(firstDay, "yyyy-MM-dd"),
        to: format(lastDay, "yyyy-MM-dd"),
      });
    } else if (filterType === "year") {
      const firstDay = new Date(year, 0, 1);
      const lastDay = new Date(year, 11, 31);
      setDateRange({
        from: format(firstDay, "yyyy-MM-dd"),
        to: format(lastDay, "yyyy-MM-dd"),
      });
    }

    // Fetch lại dữ liệu monthly revenue với năm mới
    try {
      const response = await dashboardApi.getMonthlyRevenue(year);
      if (response.data && response.data.data) {
        setMonthlyRevenue(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
    }
  };

  // Stock status chart uses `stats` directly; no derived const needed

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="ml-14 flex items-center gap-2">
            <p className="text-gray-600">Chào</p>
            <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {user},
            </span>
            <p className="text-gray-600">
              Đây là bảng điều khiển quản trị hệ thống
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Hôm nay</p>
            <p className="text-lg font-semibold text-gray-900">
              {format(now, "dd/MM/yyyy")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-blue-100/50">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Package className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Tổng sách trong kho
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? "..." : (overview?.totalBooks ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-blue-600 font-medium">Đang hoạt động</p>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-cyan-100/50">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-linear-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Tổng khách hàng
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading
                ? "..."
                : (overview?.totalCustomers ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-cyan-600 font-medium">Đã đăng ký</p>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-red-100/50">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-linear-to-br from-red-500 to-red-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Sách hết hàng
            </p>
            <p className="text-3xl font-bold text-red-600 mb-1">
              {loading ? "..." : overview?.outOfStockBooks ?? 0}
            </p>
            <p className="text-xs text-red-600 font-medium">Cần nhập thêm</p>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-orange-100/50">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Sách sắp hết
            </p>
            <p className="text-3xl font-bold text-orange-600 mb-1">
              {loading ? "..." : overview?.lowStockBooks ?? 0}
            </p>
            <p className="text-xs text-orange-600 font-medium">≤ 10 cuốn</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-emerald-100/50">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Số đơn hàng
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? "..." : (stats?.totalOrders ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600 font-medium">
              Trong khoảng thời gian
            </p>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-blue-100/50">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Doanh thu</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {loading
                ? "..."
                : `${(stats?.totalRevenue ?? 0).toLocaleString("vi-VN")}₫`}
            </p>
            <p className="text-xs text-blue-600 font-medium">
              Trong khoảng thời gian
            </p>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-amber-100/50">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-linear-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Lợi nhuận</p>
            <p className="text-2xl font-bold text-amber-600 mb-1">
              {loading
                ? "..."
                : `${(stats?.totalProfit ?? 0).toLocaleString("vi-VN")}₫`}
            </p>
            <p className="text-xs text-amber-600 font-medium">
              Trong khoảng thời gian
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Khách hàng mới
                </p>
                <p className="text-3xl font-bold text-teal-600">
                  {loading
                    ? "..."
                    : (stats?.newCustomersThisMonth ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-linear-to-br from-teal-100 to-teal-200 rounded-xl">
                <TrendingUp className="w-7 h-7 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Sách mới nhập
                </p>
                <p className="text-3xl font-bold text-cyan-600">
                  {loading
                    ? "..."
                    : (stats?.newBooksImported ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-linear-to-br from-cyan-100 to-cyan-200 rounded-xl">
                <Package className="w-7 h-7 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Tỉ lệ hủy đơn
                </p>
                <p className="text-3xl font-bold text-rose-600">
                  {loading
                    ? "..."
                    : `${(stats?.cancelledOrderRate ?? 0).toFixed(1)}%`}
                </p>
              </div>
              <div className="p-3 bg-linear-to-br from-rose-100 to-rose-200 rounded-xl">
                <ShoppingCart className="w-7 h-7 text-rose-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <label className="text-sm font-semibold text-gray-700">
                Lọc theo:
              </label>
              <select
                value={filterType}
                onChange={(e) =>
                  handleFilterTypeChange(
                    e.target.value as "day" | "month" | "year"
                  )
                }
                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="day">Ngày</option>
                <option value="month">Tháng</option>
                <option value="year">Năm</option>
              </select>
            </div>

            {filterType === "day" && (
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                  className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <span className="text-gray-400 font-medium">→</span>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                  className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            )}

            {filterType === "month" && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Tháng:</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(Number(e.target.value))}
                  className="px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      Tháng {month}
                    </option>
                  ))}
                </select>
                <label className="text-sm text-gray-600">Năm:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  className="px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  {Array.from(
                    { length: new Date().getFullYear() - 2000 + 1 },
                    (_, i) => 2000 + i
                  )
                    .reverse()
                    .map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {filterType === "year" && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Năm:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  className="px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  {Array.from(
                    { length: new Date().getFullYear() - 2000 + 1 },
                    (_, i) => 2000 + i
                  )
                    .reverse()
                    .map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                </select>
              </div>
            )}
            <button
              onClick={handleApplyFilter}
              disabled={loading}
              className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {loading ? "Đang tải..." : "Áp dụng"}
            </button>

            <button
              onClick={handleReset}
              disabled={loading}
              className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110"
              title="Reset về tháng hiện tại"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TopBooksChart data={topBooks} />
          <MonthlyRevenueChart data={monthlyRevenue} year={selectedYear} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <TopCategoriesChart data={topCategories} dateRange={dateRange} />
          <StockStatusChart overview={overview} />
        </div>
      </div>
    </AdminLayout>
  );
}
