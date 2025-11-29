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

    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <footer className="relative bg-[#0F1B33] text-white pt-16">
            {/* ================= TOP CONTACT SECTION ================= */}
            <div className="container mx-auto px-6 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {[
                        {
                            icon: <FaMapMarkerAlt />,
                            title: "Địa chỉ",
                            text: "123 Nguyễn Huệ, Q.1, TP.HCM",
                        },
                        {
                            icon: <FaEnvelope />,
                            title: "Email",
                            text: "contact@wisbook.vn",
                        },
                        {
                            icon: <FaPhone />,
                            title: "Hotline",
                            text: "1900 1234",
                        },
                        {
                            icon: <FaGlobe />,
                            title: "Website",
                            text: "www.wisbook.vn",
                        },
                    ].map((item, index) => (
                        <div key={index} className="text-center">
                            <div
                                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center 
                                bg-gradient-to-br from-[#2560E1] to-[#1A4BB8] shadow-lg mb-4"
                            >
                                <div className="text-white text-2xl">
                                    {item.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                {item.title}
                            </h3>
                            <p className="text-slate-300">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= MAIN FOOTER CONTENT ================= */}
            <div className="bg-[#12203F] py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* NEWSLETTER */}
                        <div>
                            <h3 className="text-2xl font-bold text-[#4DA3FF] mb-4">
                                Nhận tin mới
                            </h3>
                            <p className="text-slate-300 mb-6 leading-relaxed">
                                Nhận tin về sách mới, tác giả nổi bật và ưu đãi
                                mỗi tuần từ WisBook.
                            </p>

                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    className="w-full px-4 py-3 rounded-full bg-white/90 text-black
                                               placeholder-gray-600 focus:outline-none pr-36 shadow-md"
                                />
                                <button
                                    className="absolute right-1 top-1 bottom-1 px-6 rounded-full 
                                    bg-gradient-to-r from-[#2560E1] to-[#1A4BB8]
                                    text-white font-semibold hover:shadow-lg transition"
                                >
                                    Đăng ký
                                </button>
                            </div>
                        </div>

                        {/* CUSTOMER SERVICE */}
                        <FooterMenu
                            title="Hỗ trợ khách hàng"
                            items={[
                                "Liên hệ",
                                "Chính sách đổi trả",
                                "Lịch sử đơn hàng",
                                "Sơ đồ trang",
                                "Đánh giá",
                                "Tài khoản",
                                "Hủy đăng ký nhận tin",
                            ]}
                        />

                        {/* INFORMATION */}
                        <FooterMenu
                            title="Thông tin"
                            items={[
                                "Về chúng tôi",
                                "Thông tin vận chuyển",
                                "Chính sách bảo mật",
                                "Điều khoản sử dụng",
                                "Chính sách bảo hành",
                                "Câu hỏi thường gặp",
                                "Đăng nhập đối tác",
                            ]}
                        />

                        {/* UTILITIES */}
                        <FooterMenu
                            title="Tiện ích"
                            items={[
                                "Nhà xuất bản",
                                "Phiếu quà tặng",
                                "Chương trình đối tác",
                                "Sách yêu thích",
                                "Lịch sử mua hàng",
                                "Theo dõi đơn hàng",
                                "Blog sách hay",
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* ================= BOTTOM BAR ================= */}
            <div className="border-t border-white/10 bg-[#0D162A] py-6">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-center md:text-left">
                        © 2025{" "}
                        <span className="text-[#4DA3FF] font-semibold">
                            WisBook
                        </span>
                        . Thiết kế với <span className="text-red-500">❤</span>{" "}
                        dành cho người yêu sách.
                    </p>

                    <div className="flex items-center gap-4 text-slate-300">
                        <a href="#" className="hover:text-[#4DA3FF] transition">
                            Chính sách bảo mật
                        </a>
                        <span>|</span>
                        <a href="#" className="hover:text-[#4DA3FF] transition">
                            Điều khoản dịch vụ
                        </a>
                    </div>
                </div>
            </div>

            {/* ================= BACK TO TOP ================= */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-14 h-14 rounded-full 
                               flex items-center justify-center shadow-xl 
                               bg-gradient-to-br from-[#2560E1] to-[#1A4BB8]
                               text-white hover:scale-110 transition-all duration-300 z-50"
                >
                    <FaArrowUp className="text-xl" />
                </button>
            )}
        </footer>
    );
}

function FooterMenu({ title, items }: { title: string; items: string[] }) {
    return (
        <div>
            <h3 className="text-2xl font-bold text-[#4DA3FF] mb-4">{title}</h3>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i}>
                        <a
                            href="#"
                            className="flex items-center text-slate-300 hover:text-[#4DA3FF] transition group"
                        >
                            <FaChevronRight className="text-xs mr-2 group-hover:translate-x-1 transition" />
                            {item}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
