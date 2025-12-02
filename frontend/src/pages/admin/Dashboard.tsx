"use client";

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
import { DateRange, DashboardStats } from "../../types";
import TopBooksChart from "../../components/dashboard/TopBooksChart";
import MonthlyRevenueChart from "../../components/dashboard/MonthlyRevenueChart";
import TopCategoriesChart from "../../components/dashboard/TopCategoriesChart";
import StockStatusChart from "../../components/dashboard/StockStatusChart";

export default function AdminDashboard() {
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
    totalBooks: 0,
    totalCustomers: 0,
    outOfStockBooks: 0,
    lowStockBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProfit: 0,
    customerGrowthRate: 0,
    cancelledOrderRate: 0,
    newCustomersThisMonth: 0,
    cancelledOrders: 0,
  });

  const [loading, setLoading] = useState(false);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [topBooks, setTopBooks] = useState<any[]>([]);
  const [topCategories, setTopCategories] = useState<any[]>([]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const startDateTime = `${dateRange.from}T00:00:00`;
      const endDateTime = `${dateRange.to}T23:59:59`;

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
      const startDateTime = `${dateRange.from}T00:00:00`;
      const endDateTime = `${dateRange.to}T23:59:59`;
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
      const startDateTime = `${dateRange.from}T00:00:00`;
      const endDateTime = `${dateRange.to}T23:59:59`;
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
      const startDateTime = `${newDateRange.from}T00:00:00`;
      const endDateTime = `${newDateRange.to}T23:59:59`;
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

  // Tỷ lệ tồn kho
  const stockStatusData = [
    {
      name: "Còn hàng",
      value:
        (stats?.totalBooks ?? 0) -
        (stats?.lowStockBooks ?? 0) -
        (stats?.outOfStockBooks ?? 0),
      color: "#3B82F6",
    },
    { name: "Sắp hết", value: stats?.lowStockBooks ?? 0, color: "#F59E0B" },
    { name: "Hết hàng", value: stats?.outOfStockBooks ?? 0, color: "#EF4444" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wisdom Book</h1>
          <p className="text-gray-600">Chào mừng đến với trang quản trị</p>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng sách trong kho</p>
              <p className="text-2xl font-bold">
                {loading ? "..." : (stats?.totalBooks ?? 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 bg-cyan-100 rounded-lg">
              <Users className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng khách hàng</p>
              <p className="text-2xl font-bold">
                {loading
                  ? "..."
                  : (stats?.totalCustomers ?? 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sách hết hàng</p>
              <p className="text-2xl font-bold text-red-600">
                {loading ? "..." : stats?.outOfStockBooks ?? 0}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold">
                {loading ? "..." : (stats?.totalOrders ?? 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Doanh thu</p>
              <p className="text-2xl font-bold">
                {loading
                  ? "..."
                  : `${(stats?.totalRevenue ?? 0).toLocaleString()}₫`}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Lợi nhuận</p>
              <p className="text-2xl font-bold text-amber-600">
                {loading
                  ? "..."
                  : `${(stats?.totalProfit ?? 0).toLocaleString()}₫`}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sách sắp hết (≤10 cuốn)</p>
              <p className="text-2xl font-bold text-orange-600">
                {loading ? "..." : stats?.lowStockBooks ?? 0}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 bg-teal-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tăng trưởng khách hàng</p>
              <p className="text-2xl font-bold text-teal-600">
                {loading
                  ? "..."
                  : `${(stats?.customerGrowthRate ?? 0).toFixed(1)}%`}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 bg-rose-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tỉ lệ hủy đơn</p>
              <p className="text-2xl font-bold text-rose-600">
                {loading
                  ? "..."
                  : `${(stats?.cancelledOrderRate ?? 0).toFixed(1)}%`}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Lọc theo:</label>
            <select
              value={filterType}
              onChange={(e) =>
                handleFilterTypeChange(
                  e.target.value as "day" | "month" | "year"
                )
              }
              className="px-3 py-2 border rounded-lg text-sm bg-white"
            >
              <option value="day">Ngày</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>

          {filterType === "day" && (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                className="px-3 py-2 border rounded-lg text-sm"
              />
              <span className="text-gray-500">đến</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                className="px-3 py-2 border rounded-lg text-sm"
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Đang tải..." : "Áp dụng"}
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
            title="Reset về tháng hiện tại"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TopBooksChart data={topBooks} />
          <MonthlyRevenueChart data={monthlyRevenue} year={selectedYear} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <TopCategoriesChart data={topCategories} />
          <StockStatusChart stats={stats} />
        </div>
      </div>
    </AdminLayout>
  );
}
