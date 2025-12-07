import { Link } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-4xl w-full">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-30"></div>

            <div className="relative inline-block">
              <h1 className="text-[180px] md:text-[240px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 leading-none select-none">
                404
              </h1>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <BookOpen
                    className="w-24 h-24 md:w-32 md:h-32 text-blue-500 animate-pulse"
                    strokeWidth={1.5}
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trang Không Tìm Thấy
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di
              chuyển. Có thể cuốn sách bạn đang tìm đã được đưa vào kệ khác rồi!
            </p>
          </div>

          <div className="pt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay Về Trang Chủ</span>
            </Link>
          </div>

          <div className="pt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Hệ thống hoạt động bình thường</span>
            </div>
            <span>•</span>
            <span>Mã lỗi: 404</span>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-40">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
