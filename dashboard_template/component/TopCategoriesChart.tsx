import { BookOpen } from "lucide-react";

interface TopCategoriesChartProps {
  data: any[];
}

export default function TopCategoriesChart({ data }: TopCategoriesChartProps) {
  const colors = [
    "from-orange-500 to-orange-600",
    "from-cyan-500 to-cyan-600",
    "from-pink-500 to-pink-600",
    "from-teal-500 to-teal-600",
    "from-amber-500 to-amber-600",
    "from-rose-500 to-rose-600",
    "from-lime-500 to-lime-600",
    "from-sky-500 to-sky-600",
    "from-fuchsia-500 to-fuchsia-600",
    "from-emerald-500 to-emerald-600",
  ];

  const total = data.reduce(
    (sum, cat) => sum + (cat.total_revenue || cat.sales || 0),
    0
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 lg:col-span-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Danh Mục Bán Chạy</h3>
          <p className="text-sm text-gray-500">Top 10 danh mục</p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.slice(0, 10).map((category, index) => {
            const revenue = category.total_revenue || category.sales || 0;
            const quantity = category.total_quantity || 0;
            const categoryName =
              category.category_name ||
              category.category ||
              category.name ||
              "N/A";
            const percentage = total > 0 ? (revenue / total) * 100 : 0;

            return (
              <div
                key={category.category_id || index}
                className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${
                        colors[index % colors.length]
                      } rounded-lg flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {categoryName}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {quantity.toLocaleString()} cuốn
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-600">Doanh thu</span>
                    <span className="text-sm font-bold text-gray-900">
                      {(revenue / 1000000).toFixed(1)}M₫
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        colors[index % colors.length]
                      } transition-all duration-500`}
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-right">
                    {percentage.toFixed(1)}% tổng doanh thu
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-8">Không có dữ liệu</p>
      )}
    </div>
  );
}
