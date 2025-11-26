import { useState, useEffect } from "react";
import {
    FaMapMarkerAlt,
    FaEnvelope,
    FaPhone,
    FaGlobe,
    FaChevronRight,
    FaArrowUp,
} from "react-icons/fa";

export default function Footer() {
    const [showBackToTop, setShowBackToTop] = useState(false);

    // Hiện/ẩn nút Back to Top khi scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="wisbook-gradient-bg text-gray-800 relative">
            {/* Top Section - Contact Info */}
            <div className="bg-white/10 backdrop-blur-sm py-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Address */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#2560E1] to-[#1a4bb8] mb-4 shadow-lg">
                                <FaMapMarkerAlt className="text-white text-2xl" />
                            </div>
                            <h3 className="text-white text-xl font-bold mb-2">
                                Địa chỉ
                            </h3>
                            <p className="text-gray-400">
                                123 Nguyễn Huệ, Q.1, TP.HCM
                            </p>
                        </div>

                        {/* Mail Us */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#2560E1] to-[#1a4bb8] mb-4 shadow-lg">
                                <FaEnvelope className="text-white text-2xl" />
                            </div>
                            <h3 className="text-white text-xl font-bold mb-2">
                                Email
                            </h3>
                            <p className="text-gray-400">contact@wisbook.vn</p>
                        </div>

                        {/* Telephone */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#2560E1] to-[#1a4bb8] mb-4 shadow-lg">
                                <FaPhone className="text-white text-2xl" />
                            </div>
                            <h3 className="text-white text-xl font-bold mb-2">
                                Hotline
                            </h3>
                            <p className="text-gray-400">1900 1234</p>
                        </div>

                        {/* Website */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#2560E1] to-[#1a4bb8] mb-4 shadow-lg">
                                <FaGlobe className="text-white text-2xl" />
                            </div>
                            <h3 className="text-white text-xl font-bold mb-2">
                                Website
                            </h3>
                            <p className="text-gray-400">www.wisbook.vn</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="py-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Newsletter */}
                        <div>
                            <h3 className="text-[#2560E1] text-2xl font-bold mb-4">
                                Nhận tin mới
                            </h3>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                Đăng ký nhận tin tức mới nhất về sách, tác giả
                                và các chương trình khuyến mãi đặc biệt từ
                                WisBook.
                            </p>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    className="w-full px-4 py-3 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2560E1] pr-28 shadow-md transition border border-transparent focus:border-transparent"
                                />
                                <button className="absolute right-1 top-1 bottom-1 px-6 bg-gradient-to-r from-[#2560E1] to-[#1a4bb8] text-white font-semibold rounded-full hover:shadow-lg transition">
                                    Đăng ký
                                </button>
                            </div>
                        </div>

                        {/* Customer Service */}
                        <div>
                            <h3 className="text-[#2560E1] text-2xl font-bold mb-4">
                                Hỗ trợ khách hàng
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Liên hệ
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Chính sách đổi trả
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Lịch sử đơn hàng
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Sơ đồ trang
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Đánh giá
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Tài khoản
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Hủy đăng ký nhận tin
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Information */}
                        <div>
                            <h3 className="text-[#2560E1] text-2xl font-bold mb-4">
                                Thông tin
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Về chúng tôi
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Thông tin vận chuyển
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Chính sách bảo mật
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Điều khoản sử dụng
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Chính sách bảo hành
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Câu hỏi thường gặp
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Đăng nhập đối tác
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Extras */}
                        <div>
                            <h3 className="text-[#2560E1] text-2xl font-bold mb-4">
                                Tiện ích
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Nhà xuất bản
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Phiếu quà tặng
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Chương trình đối tác
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Sách yêu thích
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Lịch sử mua hàng
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Theo dõi đơn hàng
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-400 hover:text-[#2560E1] transition group"
                                    >
                                        <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                                        Blog sách hay
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-400 text-center md:text-left">
                            © 2025{" "}
                            <span className="text-[#2560E1] font-semibold">
                                WisBook
                            </span>
                            . Bản quyền thuộc về WisBook. Thiết kế với{" "}
                            <span className="text-red-500">❤</span> dành cho
                            người yêu sách.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-[#2560E1] transition"
                            >
                                Chính sách bảo mật
                            </a>
                            <span className="text-gray-600">|</span>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-[#2560E1] transition"
                            >
                                Điều khoản dịch vụ
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-[#2560E1] to-[#1a4bb8] text-white rounded-full shadow-2xl hover:shadow-[#2560E1]/50 hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center animate-bounce"
                    aria-label="Back to top"
                >
                    <FaArrowUp className="text-xl" />
                </button>
            )}
        </footer>
    );
}
