import { Package } from "lucide-react";
import { DashboardOverview } from "../../types";

interface StockStatusChartProps {
  overview: DashboardOverview;
}

export default function StockStatusChart({ overview }: StockStatusChartProps) {
  const availableBooks = Math.max(
    (overview?.totalBooks ?? 0) -
      (overview?.lowStockBooks ?? 0) -
      (overview?.outOfStockBooks ?? 0),
    0
  );
  const lowStockBooks = overview?.lowStockBooks ?? 0;
  const outOfStockBooks = overview?.outOfStockBooks ?? 0;
  const totalBooks = overview?.totalBooks ?? 1;

  const inStockPercentage = ((availableBooks / totalBooks) * 100).toFixed(1);
  const lowStockPercentage = ((lowStockBooks / totalBooks) * 100).toFixed(1);
  const outOfStockPercentage = ((outOfStockBooks / totalBooks) * 100).toFixed(
    1
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Trạng Thái Kho</h3>
          <p className="text-sm text-gray-500">Phân bổ tồn kho</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* In Stock */}
        <div className="group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                Còn hàng
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-900">
                {availableBooks}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({inStockPercentage}%)
              </span>
            </div>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500 group-hover:from-emerald-600 group-hover:to-emerald-700"
              style={{ width: `${inStockPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                Sắp hết (≤10)
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-900">
                {lowStockBooks}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({lowStockPercentage}%)
              </span>
            </div>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500 group-hover:from-orange-600 group-hover:to-orange-700"
              style={{ width: `${lowStockPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                Hết hàng
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-900">
                {outOfStockBooks}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({outOfStockPercentage}%)
              </span>
            </div>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-red-500 to-red-600 rounded-full transition-all duration-500 group-hover:from-red-600 group-hover:to-red-700"
              style={{ width: `${outOfStockPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-600">Tổng số sách</span>
          <span className="font-bold text-gray-900">{totalBooks} cuốn</span>
        </div>
      </div>
    </div>
  );
}
