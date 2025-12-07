import { TrendingUp } from "lucide-react";

interface MonthlyRevenueChartProps {
  data: any[];
  year: number;
}

export default function MonthlyRevenueChart({
  data,
  year,
}: MonthlyRevenueChartProps) {
  const maxRevenue =
    data.length > 0 ? Math.max(...data.map((item) => item.revenue || 0), 1) : 1;
  const months = [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Doanh Thu Theo Tháng
          </h3>
          <p className="text-sm text-gray-500">Năm {year}</p>
        </div>
      </div>

      <div className="h-64 flex items-end justify-between gap-2">
        {data.length > 0 ? (
          data.map((item, index) => {
            const month = item.month || index + 1;
            const monthIndex = month - 1;
            const validMonthIndex =
              monthIndex >= 0 && monthIndex < 12 ? monthIndex : index;
            return (
              <div
                key={item.month || index}
                className="flex-1 flex flex-col items-center group"
              >
                <div className="w-full flex flex-col items-center justify-end flex-1 mb-2">
                  <div className="relative w-full">
                    <div
                      className="w-full bg-linear-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500 group-hover:from-emerald-600 group-hover:to-emerald-500 cursor-pointer"
                      style={{
                        height: `${((item.revenue || 0) / maxRevenue) * 200}px`,
                        minHeight: "8px",
                      }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg whitespace-nowrap shadow-lg z-10">
                        {(item.revenue || 0).toLocaleString("vi-VN")}₫
                        {item.orders !== undefined && (
                          <div className="text-emerald-300">
                            {item.orders} đơn
                          </div>
                        )}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600 mt-1">
                  {months[validMonthIndex]}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400 py-8 w-full">
            Không có dữ liệu
          </p>
        )}
      </div>
    </div>
  );
}
