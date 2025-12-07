import { BarChart3 } from "lucide-react";

interface TopBooksChartProps {
  data: any[];
}

export default function TopBooksChart({ data }: TopBooksChartProps) {
  const maxRevenue = data.length > 0 ? Math.max(...data.map((item) => item.total_revenue || 0), 1) : 1;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Top 10 Sách Bán Chạy</h3>
          <p className="text-sm text-gray-500">Theo doanh thu</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.length > 0 ? (
          data.slice(0, 10).map((book, index) => (
            <div key={book.book_id || index} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-lg text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {book.title || book.name || 'N/A'}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900 ml-3">
                  {(book.total_revenue || 0).toLocaleString()}₫
                </span>
              </div>
              <div className="ml-10">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 group-hover:from-blue-600 group-hover:to-blue-700"
                    style={{
                      width: `${((book.total_revenue || 0) / maxRevenue) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Số lượng: {(book.total_quantity || book.sales || 0).toLocaleString()} cuốn
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">Không có dữ liệu</p>
        )}
      </div>
    </div>
  );
}
