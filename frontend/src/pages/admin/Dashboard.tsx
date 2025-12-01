"use client";

import React, { useState, useRef, useEffect } from "react";
import { format, subMonths } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  Calendar,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import html2canvas from "html2canvas";
import AdminLayout from "../admin/AdminLayout";
import dashboardApi from "../../api/dashboardApi";
import toast from "react-hot-toast";
import { DateRange, DashboardStats } from "../../types";

// Thư viện cần cài: npm install recharts lucide-react date-fns html2canvas

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

  // Refs để export biểu đồ
  const chart1Ref = useRef<HTMLDivElement>(null);
  const chart2Ref = useRef<HTMLDivElement>(null);
  const chart3Ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    fetchStats();
  }, []);

  const handleApplyFilter = () => {
    fetchStats();
  };

  const handleReset = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setFilterType("month");
    setSelectedMonth(now.getMonth() + 1);
    setSelectedYear(now.getFullYear());
    setDateRange({
      from: format(firstDayOfMonth, "yyyy-MM-dd"),
      to: format(lastDayOfMonth, "yyyy-MM-dd"),
    });
    setTimeout(fetchStats, 100);
  };

  const handleFilterTypeChange = (type: "day" | "month" | "year") => {
    setFilterType(type);
    const now = new Date();

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

  const handleYearChange = (year: number) => {
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
  }; // Top 10 sách bán chạy trong 12 tháng
  const topBooksData = [
    { name: "Lược Sử Thời Gian", sales: 892 },
    { name: "Nhà Giả Kim", sales: 756 },
    { name: "Đắc Nhân Tâm", sales: 689 },
    { name: "Tư Duy Nhanh và Chậm", sales: 612 },
    { name: "Atomic Habits", sales: 598 },
    { name: "Sapiens", sales: 543 },
    { name: "1984", sales: 487 },
    { name: "Clean Code", sales: 432 },
    { name: "The Lean Startup", sales: 398 },
    { name: "Dấu Chân Trên Cát", sales: 376 },
  ];

  // Top 10 thể loại bán chạy
  const topCategoriesData = [
    { category: "Tâm lý - Kỹ năng sống", sales: 2340 },
    { category: "Khoa học", sales: 1890 },
    { category: "Văn học cổ điển", sales: 1560 },
    { category: "Tiểu thuyết", sales: 1420 },
    { category: "Kinh doanh", sales: 1380 },
    { category: "Lập trình", sales: 1120 },
    { category: "Tự truyện", sales: 980 },
    { category: "Thiếu nhi", sales: 870 },
    { category: "Lịch sử", sales: 760 },
    { category: "Tâm linh", sales: 650 },
  ];

  // Tỷ lệ tồn kho
  const stockStatusData = [
    {
      name: "Còn hàng",
      value: (stats?.totalBooks ?? 0) - (stats?.lowStockBooks ?? 0),
      color: "#3B82F6",
    },
    { name: "Sắp hết", value: stats?.lowStockBooks ?? 0, color: "#EF4444" },
  ];

  // Doanh thu theo tháng (12 tháng gần nhất)
  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), 11 - i);
    return {
      month: format(date, "MMM"),
      revenue: Math.floor(Math.random() * 3000) + 3500,
      orders: Math.floor(Math.random() * 200) + 100,
    };
  });

  // Hàm export biểu đồ thành ảnh PNG
  const exportChart = async (
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string
  ) => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current);
    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

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
              <p className="text-sm text-gray-600">Tăng trưởng KH</p>
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
              <p className="text-sm text-gray-600">Tỉ lệ hoàn đơn</p>
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
            className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top 10 sách bán chạy */}
          <div className="bg-white rounded-lg shadow p-6" ref={chart1Ref}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Top 10 sách bán chạy (12 tháng)
              </h3>
              <button
                onClick={() => exportChart(chart1Ref, "top-10-sach")}
                className="text-gray-500 hover:text-gray-700"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topBooksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Doanh thu theo tháng */}
          <div className="bg-white rounded-lg shadow p-6" ref={chart2Ref}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Doanh thu theo tháng</h3>
              <button
                onClick={() => exportChart(chart2Ref, "doanh-thu-theo-thang")}
                className="text-gray-500 hover:text-gray-700"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  name="Doanh thu ($)"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#10B981"
                  name="Đơn hàng"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top thể loại */}
          <div
            className="bg-white rounded-lg shadow p-6 lg:col-span-2"
            ref={chart3Ref}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Top 10 thể loại bán chạy
              </h3>
              <button
                onClick={() => exportChart(chart3Ref, "top-the-loai")}
                className="text-gray-500 hover:text-gray-700"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCategoriesData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="category"
                  type="category"
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="sales" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tỷ lệ tồn kho */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Tỷ lệ tồn kho</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>
                  Còn hàng:{" "}
                  {(stats?.totalBooks ?? 0) - (stats?.lowStockBooks ?? 0)}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Sắp hết: {stats?.lowStockBooks ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
