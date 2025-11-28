import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaSearch,
    FaShoppingCart,
    FaUser,
    FaSignInAlt,
    FaUserPlus,
    FaBox,
    FaCog,
    FaSignOutAlt,
    FaTimes,
} from "react-icons/fa";
import Carousel from "./Carousel";
import logoImg from "../../assets/img/logo.png";
import wisbook from "../../assets/img/wisbook.png";

// Mock data cho giỏ hàng
const cartItems = [
    {
        id: 1,
        name: "AirPods Pro 2",
        price: 249.0,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=100&h=100&fit=crop",
    },
];

export default function Header() {
    const [opacity, setOpacity] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [showCartMenu, setShowCartMenu] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [isCartClosing, setIsCartClosing] = useState(false);
    const [isCategoryClosing, setIsCategoryClosing] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === "/";

    // Danh sách thể loại sách cố định
    const bookCategories = [
        { id: 1, name: "Văn học" },
        { id: 2, name: "Kinh doanh" },
        { id: 3, name: "Công nghệ thông tin" },
        { id: 4, name: "Phát triển bản thân" },
        { id: 5, name: "Thiếu nhi" },
        { id: 6, name: "Giáo dục – Học tập" },
        { id: 7, name: "Khoa học – Công nghệ" },
        { id: 8, name: "Văn hóa – Xã hội" },
        { id: 9, name: "Y học – Sức khỏe" },
        { id: 10, name: "Nghệ thuật" },
        { id: 11, name: "Tôn giáo – Tâm linh" },
        { id: 12, name: "Ẩm thực – Nấu ăn" },
        { id: 13, name: "Thể thao" },
        { id: 14, name: "Kinh tế – Chính trị" },
        { id: 15, name: "Du lịch – Địa lý" },
        { id: 16, name: "Nông nghiệp – Thú y" },
        { id: 17, name: "Kỹ thuật – Công nghiệp" },
    ];

    // Tính tổng giỏ hàng
    const cartTotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const cartItemCount = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 10);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const value = Math.min(window.scrollY / 300, 1);
            setOpacity(value);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            navigate(`/books?search=${encodeURIComponent(searchValue)}`);
            setSearchValue("");
        }
    };

    const handleCategoryClick = (categoryName: string) => {
        navigate(`/books?category=${encodeURIComponent(categoryName)}`);
        setShowCategoryMenu(false);
    };

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                !target.closest(".account-menu") &&
                !target.closest(".cart-menu")
            ) {
                setShowAccountMenu(false);
                setShowCartMenu(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className="relative">
            {/* Navbar cố định */}
            <nav
                className="fixed top-0 left-0 w-full z-50 transition-all duration-500"
                style={{
                    background: isHomePage
                        ? `rgba(37, 99, 235, ${opacity})` // Blue-600 + opacity
                        : `#2563eb`, // Blue-600 thuần
                    boxShadow:
                        opacity > 0.2 || !isHomePage
                            ? "0 4px 15px rgba(0,0,0,0.15)"
                            : "none",
                }}
            >
                <div className="container mx-auto flex items-center justify-between px-6 py-6 text-gray-800">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-3xl font-bold flex items-center tracking-wide gap-2"
                    >
                        <div className="w-14 h-14 rounded-full overflow-hidden">
                            <img
                                src={logoImg}
                                alt="logo"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="w-30 h-15 overflow-hidden">
                            <img
                                src={wisbook}
                                alt="WisBook"
                                className="w-full h-full object-cover scale-[1.2]"
                            />
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-10 text-lg font-medium items-center">
                        <Link
                            to="/"
                            className="relative group transition-colors"
                        >
                            <span className="text-white font-bold text-2xl">
                                Trang chủ
                            </span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link
                            to="/books"
                            className="relative group transition-colors"
                        >
                            <span className="text-white font-bold text-2xl">
                                Sản phẩm
                            </span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                        </Link>

                        <div
                            className="relative"
                            onMouseEnter={() => {
                                setIsCategoryClosing(false);
                                setShowCategoryMenu(true);
                            }}
                            onMouseLeave={() => {
                                setIsCategoryClosing(true);
                                setTimeout(
                                    () => setShowCategoryMenu(false),
                                    300
                                );
                            }}
                        >
                            <button className="relative group transition-colors flex items-center gap-1">
                                <span className="text-white font-bold text-2xl">
                                    Thể loại
                                </span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-300 ${
                                        showCategoryMenu ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="url(#gradient)"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2.5}
                                >
                                    <defs>
                                        <linearGradient
                                            id="gradient"
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="0%"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#ffffff"
                                            />
                                            <stop
                                                offset="50%"
                                                stopColor="#ffffff"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#ffffff"
                                            />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                            </button>

                            {/* Category Dropdown */}
                            {showCategoryMenu && (
                                <div className="absolute top-full left-0 pt-4 w-[900px] z-50">
                                    <div
                                        className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
                                        style={{
                                            animation: isCategoryClosing
                                                ? "slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards"
                                                : "slideDown 1s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                                        }}
                                    >
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
                                                Danh mục sách
                                            </h3>
                                            <div className="grid grid-cols-3 gap-3">
                                                {bookCategories.map(
                                                    (category) => (
                                                        <button
                                                            key={category.id}
                                                            onClick={() =>
                                                                handleCategoryClick(
                                                                    category.name
                                                                )
                                                            }
                                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-all duration-300 group border border-transparent hover:border-purple-200 text-left w-full"
                                                        >
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors text-sm">
                                                                    {
                                                                        category.name
                                                                    }
                                                                </h4>
                                                            </div>
                                                            <svg
                                                                className="w-5 h-5 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M9 5l7 7-7 7"
                                                                />
                                                            </svg>
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-t border-gray-200">
                                            <Link
                                                to="/books"
                                                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center justify-center gap-2 group"
                                            >
                                                Xem tất cả thể loại
                                                <svg
                                                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                    />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Link
                            to="/about"
                            className="relative group transition-colors"
                        >
                            <span className="text-white font-bold text-2xl">
                                Tin tức
                            </span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link
                            to="/contact"
                            className="relative group transition-colors"
                        >
                            <span className="text-white font-bold text-2xl">
                                Liên hệ
                            </span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    </div>

                    {/* Right Section: Search, Cart, Account */}
                    <div className="flex items-center gap-4">
                        {/* Search Box */}
                        <form
                            onSubmit={handleSearch}
                            className="relative hidden lg:block"
                        >
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Tìm kiếm sách, tác giả, thể loại"
                                className="w-80 px-4 py-2 pr-12 rounded-full bg-gray-100 border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 transition-all duration-300"
                                style={{
                                    boxShadow: "none",
                                }}
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg bg-gray-400"
                            >
                                <FaSearch className="text-sm" />
                            </button>
                        </form>
                        {/* Cart Icon với Badge */}
                        <div className="cart-menu relative">
                            <button
                                className="text-white relative flex items-center p-2 rounded-full transition-all duration-500 "
                                onMouseEnter={() => {
                                    setIsCartClosing(false);
                                    setShowCartMenu(true);
                                }}
                            >
                                <FaShoppingCart className="text-3xl text-white" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>

                            {/* Cart Dropdown */}
                            {showCartMenu && (
                                <div
                                    className="absolute right-0 top-full pt-2 w-[400px]"
                                    onMouseEnter={() => {
                                        setIsCartClosing(false);
                                        setShowCartMenu(true);
                                    }}
                                    onMouseLeave={() => {
                                        setIsCartClosing(true);
                                        setTimeout(
                                            () => setShowCartMenu(false),
                                            300
                                        );
                                    }}
                                >
                                    <div
                                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                                        style={{
                                            animation: isCartClosing
                                                ? "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards"
                                                : "slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                                        }}
                                    >
                                        {/* Cart Items */}
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {cartItems
                                                .slice(0, 1)
                                                .map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center gap-3 p-4 border-b border-gray-100"
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                        <div className="flex-1 flex flex-col justify-center">
                                                            <h4 className="text-sm text-gray-800 mb-1">
                                                                {item.name}
                                                            </h4>
                                                            <p className="text-xs text-gray-500">
                                                                Số lượng:{" "}
                                                                {item.quantity}
                                                            </p>
                                                        </div>
                                                        <button className="text-gray-400 hover:text-gray-600 p-1">
                                                            <FaTimes className="text-sm" />
                                                        </button>
                                                    </div>
                                                ))}
                                        </div>

                                        {/* Footer */}
                                        <div className="p-4 bg-white border-t border-gray-100">
                                            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                                                <span className="text-sm text-gray-600">
                                                    Tổng sản phẩm
                                                </span>
                                                <span className="text-sm font-semibold text-gray-800">
                                                    {cartItemCount}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-sm text-gray-600">
                                                    Tổng tiền
                                                </span>
                                                <span className="text-lg font-bold text-red-600">
                                                    {cartTotal.toFixed(3)} đ
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2.5 rounded-full hover:bg-gray-50 transition">
                                                    Xem giỏ hàng
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>{" "}
                        {/* Account Icon */}
                        <div className="account-menu relative">
                            <button
                                onClick={() =>
                                    setShowAccountMenu(!showAccountMenu)
                                }
                                 className="text-white relative flex items-center p-2 rounded-full transition-all duration-500 "
                            >
                                <FaUser className="text-3xl text-white" />
                            </button>

                            {/* Account Dropdown */}
                            {showAccountMenu && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
                                    <div className="p-2">
                                        <Link
                                            to="/login"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition group"
                                        >
                                            <FaSignInAlt className="text-lg text-blue-600 group-hover:scale-110 transition" />
                                            <span className="font-medium">
                                                Đăng nhập
                                            </span>
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition group"
                                        >
                                            <FaUserPlus className="text-lg text-green-600 group-hover:scale-110 transition" />
                                            <span className="font-medium">
                                                Đăng ký
                                            </span>
                                        </Link>
                                        <div className="border-t border-gray-200 my-2"></div>
                                        <Link
                                            to="/orders"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg transition group"
                                        >
                                            <FaBox className="text-lg text-purple-600 group-hover:scale-110 transition" />
                                            <span className="font-medium">
                                                Đơn hàng
                                            </span>
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition group"
                                        >
                                            <FaCog className="text-lg text-gray-600 group-hover:scale-110 transition" />
                                            <span className="font-medium">
                                                Cài đặt
                                            </span>
                                        </Link>
                                        <div className="border-t border-gray-200 my-2"></div>
                                        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition group">
                                            <FaSignOutAlt className="text-lg group-hover:scale-110 transition" />
                                            <span className="font-medium">
                                                Đăng xuất
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Chỉ hiển thị Carousel khi ở trang chủ */}
            {isHomePage && <Carousel />}

            {/* CSS Animation */}
            <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-15px);
          }
        }

        /* Custom scrollbar cho cart - hiển thị 5 items (mỗi item ~88px) */
        .cart-scrollbar {
          max-height: 440px; /* 5 items x 88px = 440px */
        }

        .cart-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .cart-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        .cart-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #9333ea, #ec4899);
          border-radius: 4px;
        }

        .cart-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #7e22ce, #db2777);
        }
      `}</style>
        </div>
    );
}
