import { Package } from "lucide-react";

interface StockStatusChartProps {
  overview: any;
}

export default function StockStatusChart({ overview }: StockStatusChartProps) {
  const totalStock = overview?.totalBooks || 1;
  const lowStockBooks = overview?.lowStockBooks || 0;
  const outOfStockBooks = overview?.outOfStockBooks || 0;
  const inStock = Math.max(totalStock - outOfStockBooks - lowStockBooks, 0);
  const inStockPercent = (inStock / totalStock) * 100;
  const lowStockPercent = (lowStockBooks / totalStock) * 100;
  const outOfStockPercent = (outOfStockBooks / totalStock) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Tình Trạng Kho</h3>
          <p className="text-sm text-gray-500">Tổng quan</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-emerald-600">
                Còn hàng
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-emerald-600">
                {inStock.toLocaleString()} ({inStockPercent.toFixed(1)}%)
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-100">
            <div
              style={{ width: `${Math.max(inStockPercent, 2)}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
            />
          </div>
        </div>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-orange-600">
                Sắp hết
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-orange-600">
                {lowStockBooks.toLocaleString()} ({lowStockPercent.toFixed(1)}%)
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-100">
            <div
              style={{ width: `${Math.max(lowStockPercent, 2)}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
            />
          </div>
        </div>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-red-600">
                Hết hàng
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-red-600">
                {outOfStockBooks.toLocaleString()} (
                {outOfStockPercent.toFixed(1)}%)
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-100">
            <div
              style={{ width: `${Math.max(outOfStockPercent, 2)}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Tổng sách</span>
            <span className="text-2xl font-bold text-gray-900">
              {totalStock.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
