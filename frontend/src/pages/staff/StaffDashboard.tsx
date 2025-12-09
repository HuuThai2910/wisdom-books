import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  ShoppingCart,
  Package,
  Clock,
  TrendingUp,
  AlertCircle,
  Calendar,
} from "lucide-react";
import StaffLayout from "./StaffLayout";
import dashboardApi from "../../api/dashboardApi";
import toast from "react-hot-toast";
import TopBooksChart from "../../components/dashboard/TopBooksChart";
import TopCategoriesChart from "../../components/dashboard/TopCategoriesChart";

interface StaffStats {
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  pendingOrders: number;
}

interface Overview {
  totalBooks: number;
  outOfStockBooks: number;
  lowStockBooks: number;
}

export default function StaffDashboard() {
  const [user, setUser] = useState("Nhân viên");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<StaffStats>({
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    pendingOrders: 0,
  });
  const [overview, setOverview] = useState<Overview>({
    totalBooks: 0,
    outOfStockBooks: 0,
    lowStockBooks: 0,
  });
  const [topBooks, setTopBooks] = useState<any[]>([]);
  const [topCategories, setTopCategories] = useState<any[]>([]);

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );
  const [dateRange] = useState({
    from: format(startOfToday, "yyyy-MM-dd"),
    to: format(endOfToday, "yyyy-MM-dd"),
  });

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData.fullName || "Nhân viên");
      } catch (error) {
        setUser("Nhân viên");
      }
    }

    fetchData();

    // Auto refresh at midnight to get new day's data
    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightTimer = setTimeout(() => {
      fetchData();
      // Set up daily refresh
      const dailyInterval = setInterval(() => {
        fetchData();
      }, 24 * 60 * 60 * 1000); // 24 hours

      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch today's stats
      const startDateTime = `${format(
        startOfToday,
        "yyyy-MM-dd"
      )}T00:00:00+07:00`;
      const endDateTime = `${format(endOfToday, "yyyy-MM-dd")}T23:59:59+07:00`;

      const [
        statsResponse,
        overviewResponse,
        topBooksResponse,
        topCategoriesResponse,
      ] = await Promise.all([
        dashboardApi.getStats(startDateTime, endDateTime),
        dashboardApi.getOverview(),
        dashboardApi.getTopBooks(startDateTime, endDateTime, 10),
        dashboardApi.getTopCategories(startDateTime, endDateTime, 10),
      ]);

      if (statsResponse.data && statsResponse.data.data) {
        const data = statsResponse.data.data;
        setStats({
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          todayOrders: data.totalOrders || 0,
          pendingOrders: data.totalOrders || 0, // Can be adjusted based on actual pending count
        });
      }

      if (overviewResponse.data && overviewResponse.data.data) {
        setOverview(overviewResponse.data.data);
      }

      if (topBooksResponse.data && topBooksResponse.data.data) {
        setTopBooks(topBooksResponse.data.data);
      }

      if (topCategoriesResponse.data && topCategoriesResponse.data.data) {
        setTopCategories(topCategoriesResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching staff dashboard data:", error);
      toast.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {user}
            </span>
            <p className="text-gray-600">
              , Chào mừng đến với Dashboard Nhân Viên
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-200">
            <Calendar className="w-5 h-5 text-gray-500" />
            <p className="text-sm text-gray-500">Hôm nay</p>
            <p className="text-lg font-semibold text-gray-900">
              {format(now, "dd/MM/yyyy")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Đơn hàng hôm nay */}
          <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-blue-100/50">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Đơn hàng hôm nay
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? "..." : stats.todayOrders.toLocaleString()}
            </p>
            <p className="text-xs text-blue-600 font-medium">Đang xử lý</p>
          </div>

          {/* Tổng sách */}
          <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-green-100/50">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Package className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Sách trong kho
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? "..." : overview.totalBooks.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 font-medium">Có sẵn</p>
          </div>

          {/* Sách sắp hết */}
          <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-orange-100/50">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Sách sắp hết
            </p>
            <p className="text-3xl font-bold text-orange-600 mb-1">
              {loading ? "..." : overview.lowStockBooks}
            </p>
            <p className="text-xs text-orange-600 font-medium">≤ 10 cuốn</p>
          </div>

          {/* Doanh thu hôm nay */}
          <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-emerald-100/50">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Doanh thu hôm nay
            </p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {loading
                ? "..."
                : `${stats.totalRevenue.toLocaleString("vi-VN")}₫`}
            </p>
            <p className="text-xs text-emerald-600 font-medium">
              Từ {stats.todayOrders} đơn
            </p>
          </div>
        </div>

        {/* Sách hết hàng */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-linear-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sách hết hàng</h2>
              <p className="text-sm text-gray-600">Cần nhập thêm</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-5xl font-bold text-red-600 mb-2">
                {loading ? "..." : overview.outOfStockBooks}
              </p>
              <p className="text-sm text-gray-600">sách đang hết hàng</p>
            </div>
          </div>
        </div>

        {/* Biểu đồ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top sách bán chạy */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Top 10 Sách Bán Chạy Hôm Nay
            </h2>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <TopBooksChart data={topBooks} />
            )}
          </div>

          {/* Top danh mục bán chạy */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Top 10 Danh Mục Bán Chạy Hôm Nay
            </h2>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <TopCategoriesChart data={topCategories} dateRange={dateRange} />
            )}
          </div>
        </div>

        {/* Hướng dẫn nhanh */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quyền hạn của bạn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Quản lý đơn hàng</p>
                <p className="text-sm text-gray-600">
                  Xem, xử lý và cập nhật trạng thái đơn hàng
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Quản lý sách</p>
                <p className="text-sm text-gray-600">
                  Thêm, sửa và xem thông tin sách trong hệ thống
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
