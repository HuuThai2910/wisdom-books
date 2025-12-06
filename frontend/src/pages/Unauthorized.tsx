import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowLeft, FaHome } from 'react-icons/fa';

export default function Unauthorized() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header với gradient xanh */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <FaExclamationTriangle className="text-6xl text-white" />
                            </div>
                        </div>
                        <h1 className="text-6xl font-bold text-white mb-4">401</h1>
                        <h2 className="text-3xl font-bold text-white mb-2">Không Có Quyền Truy Cập</h2>
                        <p className="text-blue-100 text-lg">Unauthorized Access</p>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-10">
                        <div className="text-center mb-8">
                            <p className="text-gray-700 text-lg mb-4">
                                Xin lỗi, bạn không có quyền truy cập vào trang này.
                            </p>
                            <p className="text-gray-600">
                                Vui lòng kiểm tra lại quyền của bạn hoặc liên hệ với quản trị viên để được hỗ trợ.
                            </p>
                        </div>

                        {/* Thông tin bổ sung */}
                        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mb-8">
                            <h3 className="text-blue-900 font-semibold mb-3 text-lg">
                                Có thể do các nguyên nhân sau:
                            </h3>
                            <ul className="space-y-2 text-blue-800">
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>Tài khoản của bạn không có quyền truy cập chức năng này</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>URL không chính xác hoặc trang đã bị di chuyển</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleGoBack}
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg group"
                            >
                                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                                Quay lại
                            </button>
                            <button
                                onClick={handleGoHome}
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
                            >
                                <FaHome className="group-hover:scale-110 transition-transform duration-300" />
                                Về trang chủ
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-8 py-6 text-center border-t border-gray-200">
                        <p className="text-gray-600 text-sm">
                            Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với{' '}
                            <a href="mailto:support@wisdombook.com" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                                support@wisdombook.com
                            </a>
                        </p>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-10 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>
        </div>
    );
}
