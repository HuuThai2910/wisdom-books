"use client";

import React, { useState, useRef } from "react";
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
} from "lucide-react";
import html2canvas from "html2canvas";
import AdminLayout from "../admin/AdminLayout";

// Thư viện cần cài: npm install recharts lucide-react date-fns html2canvas

interface DateRange {
  from: string;
  to: string;
}

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: format(subMonths(new Date(), 1), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  });

  // Refs để export biểu đồ
  const chart1Ref = useRef<HTMLDivElement>(null);
  const chart2Ref = useRef<HTMLDivElement>(null);
  const chart3Ref = useRef<HTMLDivElement>(null);

  // Dữ liệu tĩnh
  const totalBooks = 1294;
  const totalCustomers = 1303;
  const outOfStockBooks = 87;
  const totalOrders = 1345;
  const totalRevenue = 4578.58;

  // Top 10 sách bán chạy trong 12 tháng
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
    { name: "Còn hàng", value: totalBooks - outOfStockBooks, color: "#3B82F6" },
    { name: "Hết hàng", value: outOfStockBooks, color: "#EF4444" },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng sách</p>
              <p className="text-2xl font-bold">
                {totalBooks.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 bg-cyan-100 rounded-lg">
              <Users className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Khách hàng (tháng)</p>
              <p className="text-2xl font-bold">
                {totalCustomers.toLocaleString()}
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
                {outOfStockBooks}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đơn hàng (tháng)</p>
              <p className="text-2xl font-bold">
                {totalOrders.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Doanh thu (tháng)</p>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap items-center gap-4">
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
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Áp dụng
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
                <span>Còn hàng: {totalBooks - outOfStockBooks}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Hết hàng: {outOfStockBooks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cảnh báo & Tăng trưởng */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-5 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-800">
                  Sách sắp hết (≤10 cuốn)
                </p>
                <p className="text-2xl font-bold text-yellow-900">12</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-800">Tăng trưởng khách hàng</p>
                <p className="text-2xl font-bold text-green-900">+18.2%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-5 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-800">Tỷ lệ hoàn đơn</p>
                <p className="text-2xl font-bold text-red-900">2.4%</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
