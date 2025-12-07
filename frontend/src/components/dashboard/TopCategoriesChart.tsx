import { BookOpen } from "lucide-react";
import { useState } from "react";
import CategoryBooksModal from "./CategoryBooksModal";

interface TopCategoriesChartProps {
  data: any[];
  dateRange: { from: string; to: string };
}

export default function TopCategoriesChart({
  data,
  dateRange,
}: TopCategoriesChartProps) {
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);
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

  const total = data.reduce((sum, cat) => sum + (cat.sales || 0), 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 lg:col-span-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl">
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
            const sales = category.sales || 0;
            const categoryName = category.category || category.name || "N/A";
            const percentage = total > 0 ? (sales / total) * 100 : 0;

            return (
              <div
                key={index}
                onClick={() =>
                  setSelectedCategory({
                    id: category.categoryId || category.id,
                    name: categoryName,
                  })
                }
                className="p-4 bg-linear-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-300 transition-all hover:shadow-md group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 bg-linear-to-br ${
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
                        {sales.toLocaleString()} cuốn
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-linear-to-r ${
                        colors[index % colors.length]
                      } transition-all duration-500`}
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-right">
                    {percentage.toFixed(1)}% tổng số lượng
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-8">Không có dữ liệu</p>
      )}

      <CategoryBooksModal
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        categoryName={selectedCategory?.name || ""}
        categoryId={selectedCategory?.id || 0}
        dateRange={dateRange}
      />
    </div>
  );
}
