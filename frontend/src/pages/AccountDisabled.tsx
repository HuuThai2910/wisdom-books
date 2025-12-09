import { useNavigate } from 'react-router-dom';
import { FaBan, FaHome } from 'react-icons/fa';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function AccountDisabled() {
    const navigate = useNavigate();

    useEffect(() => {
        // Xóa cookies khi vào trang này
        Cookies.remove('id_token');
        Cookies.remove('refresh_token');
        document.cookie = 'id_token=; Max-Age=0; path=/';
        document.cookie = 'refresh_token=; Max-Age=0; path=/';
        
        // Xóa tất cả localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("checkoutItems");
        localStorage.removeItem("booksPage_currentPage");
        localStorage.removeItem("booksPage_filters");
        localStorage.removeItem("booksPage_filterOpen");
    }, []);


    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header với gradient đỏ */}
                    <div className="bg-linear-to-r from-red-600 to-red-700 px-8 py-12 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <FaBan className="text-6xl text-white" />
                            </div>
                        </div>
                        <h1 className="text-6xl font-bold text-white mb-4">403</h1>
                        <h2 className="text-3xl font-bold text-white mb-2">Tài Khoản Bị Vô Hiệu Hóa</h2>
                        <p className="text-red-100 text-lg">Account Disabled</p>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-10">
                        <div className="text-center mb-8">
                            <p className="text-gray-700 text-lg mb-4 font-semibold">
                                Tài khoản của bạn đã bị vô hiệu hóa bởi quản trị viên.
                            </p>
                         
                        </div>

                        {/* Thông tin bổ sung */}
                        <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-6 mb-8">
                            <h3 className="text-red-900 font-semibold mb-3 text-lg">
                                Tài khoản có thể bị vô hiệu hóa do:
                            </h3>
                            <ul className="space-y-2 text-red-800">
                                <li className="flex items-start">
                                    <span className="text-red-600 mr-2">•</span>
                                    <span>Vi phạm chính sách sử dụng dịch vụ</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-600 mr-2">•</span>
                                    <span>Yêu cầu từ quản trị viên hệ thống</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-600 mr-2">•</span>
                                    <span>Thay đổi quyền truy cập hoặc vai trò trong hệ thống</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Thông tin liên hệ */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-sm">
                        Cần hỗ trợ? Liên hệ:{' '}
                        <a href="mailto:support@wisdombooks.com" className="text-red-600 hover:text-red-700 font-semibold">
                            support@wisdombooks.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
