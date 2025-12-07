import { X, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import dashboardApi from "../../api/dashboardApi";

interface CategoryBooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
  categoryId: number;
  dateRange: { from: string; to: string };
}

interface CategoryBook {
  bookId: number;
  bookTitle: string;
  sales: number;
  revenue: number;
}

export default function CategoryBooksModal({
  isOpen,
  onClose,
  categoryName,
  categoryId,
  dateRange,
}: CategoryBooksModalProps) {
  const [books, setBooks] = useState<CategoryBook[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && categoryId) {
      fetchCategoryBooks();
    }
  }, [isOpen, categoryId, dateRange]);

  const fetchCategoryBooks = async () => {
    setLoading(true);
    try {
      const startDateTime = `${dateRange.from}T00:00:00+07:00`;
      const endDateTime = `${dateRange.to}T23:59:59+07:00`;
      console.log(
        "Fetching books for category:",
        categoryId,
        startDateTime,
        endDateTime
      );
      const response = await dashboardApi.getCategoryBooks(
        categoryId,
        startDateTime,
        endDateTime
      );
      console.log("Category books response:", response);
      if (response.data && response.data.data) {
        console.log("Books data:", response.data.data);
        setBooks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching category books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{
            background:
              "linear-gradient(5deg, rgba(0, 60, 200, 1) 2%, rgba(0, 90, 220, 1) 7%, rgba(20, 110, 230, 1) 16%, rgba(0, 80, 210, 1) 39%, rgba(0, 70, 190, 1) 76%, rgba(0, 80, 130, 1) 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{categoryName}</h2>
              <p className="text-blue-100 text-sm">Danh sách sách bán chạy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : books.length > 0 ? (
            <div className="space-y-3">
              {books.map((book, index) => (
                <div
                  key={book.bookId}
                  className="group p-4 bg-linear-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span
                        className="shrink-0 w-8 h-8 flex items-center justify-center text-white rounded-lg text-sm font-bold"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(0, 80, 210, 1) 0%, rgba(0, 90, 220, 1) 100%)",
                        }}
                      >
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {book.bookTitle}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Đã bán: {book.sales.toLocaleString()} cuốn
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-gray-900">
                        {book.revenue.toLocaleString("vi-VN")}₫
                      </p>
                      <p className="text-xs text-gray-500">Doanh thu</p>
                    </div>
                  </div>
                  <div className="ml-11">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(0, 90, 220, 1) 0%, rgba(20, 110, 230, 1) 100%)",
                          width: `${(book.revenue / books[0].revenue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Không có dữ liệu sách</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            style={{
              background:
                "linear-gradient(90deg, rgba(0, 80, 210, 1) 0%, rgba(0, 90, 220, 1) 50%, rgba(20, 110, 230, 1) 100%)",
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
