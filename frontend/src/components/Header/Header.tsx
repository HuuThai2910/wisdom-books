import { useAppDispatch, useAppSelector } from "../../app/store";
import { fetchCart, removeItem } from "../../features/cart/cartSlice";
import { formatCurrency } from "../../util/formatting";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCircle, ShoppingCart } from "lucide-react";
import {
    FaSearch,
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
import bookApi from "../../api/bookApi";
import { Book } from "../../types";
import { S3_CONFIG } from "./../../config/s3";
export default function Header() {
    const [opacity, setOpacity] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [showCartMenu, setShowCartMenu] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [isCartClosing, setIsCartClosing] = useState(false);
    const [isCategoryClosing, setIsCategoryClosing] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [searchSuggestions, setSearchSuggestions] = useState<Book[]>([]);
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === "/";
    const { cartItems } = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch();

    // Lấy thông tin user từ localStorage và reload khi có thay đổi
    useEffect(() => {
        const loadUser = () => {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                try {
                    setCurrentUser(JSON.parse(userStr));
                } catch (error) {
                    console.error("Error parsing user data:", error);
                }
            } else {
                setCurrentUser(null);
            }
        };

        // Load user lần đầu
        loadUser();

        // Listen for storage changes (khi update từ tab khác hoặc component khác)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "user") {
                loadUser();
            }
        };

        // Listen for custom event (khi update trong cùng tab)
        const handleUserUpdate = () => {
            loadUser();
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("userUpdated", handleUserUpdate);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("userUpdated", handleUserUpdate);
        };
    }, []);

    // Lấy dữ liệu từ cart để truyền vào cart mini
    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    // Size
    const size = useMemo(() => cartItems.length, [cartItems]);
    // Tổng giá tiền
    const totalPrice = useMemo(() => {
        return cartItems.reduce(
            (sum, item) => sum + (item.book?.price || 0) * item.quantity,
            0
        );
    }, [cartItems]);

    // Tổng sản phẩm
    const totalQuantity = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [cartItems]);

    // Xóa item khỏi cart mini
    const handleRemoveItem = (id: number) => {
        dispatch(removeItem([id]));
    };

    // Danh sách thể loại sách - giống CategoryBook
    const bookCategories = [
        { id: 1, name: "Ẩm thực – Nấu ăn" },
        { id: 2, name: "Công nghệ thông tin" },
        { id: 3, name: "Du lịch – Địa lý" },
        { id: 4, name: "Kinh doanh" },
        { id: 5, name: "Nghệ thuật" },
        { id: 6, name: "Thể thao" },
        { id: 7, name: "Thiếu nhi" },
    ];

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
            setShowSearchSuggestions(false);
        }
    };

    // Tìm kiếm gợi ý khi người dùng gõ
    useEffect(() => {
        const searchBooks = async () => {
            if (searchValue.trim().length < 2) {
                setSearchSuggestions([]);
                setShowSearchSuggestions(false);
                return;
            }

            setIsSearching(true);
            try {
                // Tìm theo tên sách
                const titleResponse = await bookApi.getAllBooks({
                    page: 0,
                    size: 5,
                    filter: `title~'*${searchValue}*'`,
                });

                // Tìm theo tác giả
                const authorResponse = await bookApi.getAllBooks({
                    page: 0,
                    size: 5,
                    filter: `author~'*${searchValue}*'`,
                });

                // Gộp kết quả và loại bỏ trùng lặp
                const titleBooks = titleResponse.data.result || [];
                const authorBooks = authorResponse.data.result || [];

                const allBooks = [...titleBooks];
                const bookIds = new Set(titleBooks.map((b: any) => b.id));

                // Thêm sách từ kết quả tác giả nếu chưa có
                authorBooks.forEach((book: any) => {
                    if (!bookIds.has(book.id)) {
                        allBooks.push(book);
                    }
                });

                // Giới hạn 5 kết quả
                setSearchSuggestions(allBooks.slice(0, 5));
                setShowSearchSuggestions(true);
            } catch (error) {
                console.error("Error searching books:", error);
                setSearchSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(searchBooks, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchValue]);

    const handleCategoryClick = (categoryName: string) => {
        // Navigate to CategoryPage with category name
        navigate(`/category/${encodeURIComponent(categoryName)}`);
        setShowCategoryMenu(false);
    };

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                !target.closest(".account-menu") &&
                !target.closest(".cart-menu") &&
                !target.closest(".search-container")
            ) {
                setShowAccountMenu(false);
                setShowCartMenu(false);
                setShowSearchSuggestions(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className="relative">
            {/* Navbar cố định */}
            <nav
                className="fixed top-0 left-0 w-full z-50 transition-all duration-500 px-8 py-1"
                style={{
                    background: isHomePage
                        ? opacity > 0.5
                            ? `rgba(37, 99, 235, ${opacity})` // Xanh khi cuộn
                            : "rgba(255, 255, 255, 0.95)" // Trắng khi chưa cuộn
                        : "#ffffff", // Trắng cho các trang khác
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                }}
            >
                <div className="container mx-auto flex items-center justify-between px-6 py-2 text-gray-800">
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
                            style={{
                                color:
                                    isHomePage && opacity > 0.5
                                        ? "white"
                                        : "#2563eb",
                            }}
                        >
                            <span className="font-bold text-xl">Trang chủ</span>
                            <span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                                style={{
                                    backgroundColor:
                                        isHomePage && opacity > 0.5
                                            ? "white"
                                            : "#2563eb",
                                }}
                            ></span>
                        </Link>
                        <Link
                            to="/books"
                            className="relative group transition-colors"
                            style={{
                                color:
                                    isHomePage && opacity > 0.5
                                        ? "white"
                                        : "#2563eb",
                            }}
                        >
                            <span className="font-bold text-xl">Sản phẩm</span>
                            <span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                                style={{
                                    backgroundColor:
                                        isHomePage && opacity > 0.5
                                            ? "white"
                                            : "#2563eb",
                                }}
                            ></span>
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
                                    100
                                );
                            }}
                        >
                            <button
                                className="relative group transition-colors flex items-center gap-1"
                                style={{
                                    color:
                                        isHomePage && opacity > 0.5
                                            ? "white"
                                            : "#2563eb",
                                }}
                            >
                                <span className="font-bold text-xl">
                                    Thể loại
                                </span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-300 ${
                                        showCategoryMenu ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
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
                                <span
                                    className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                                    style={{
                                        backgroundColor:
                                            isHomePage && opacity <= 0.5
                                                ? "white"
                                                : "#2563eb",
                                    }}
                                ></span>
                            </button>

                            {/* Category Dropdown */}
                            {showCategoryMenu && (
                                <div className="absolute top-full left-0 pt-4 w-[780px] z-50">
                                    <div
                                        className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100"
                                        style={{
                                            animation: isCategoryClosing
                                                ? "slideUp 0.1s cubic-bezier(0.4, 0, 0.2, 1) forwards"
                                                : "slideDown 0.1s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                                        }}
                                    >
                                        {/* Header Section */}
                                        <div className="bg-gray-600 px-5 py-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">
                                                        Danh Mục Sách
                                                    </h3>
                                                    <p className="text-blue-100 text-xs">
                                                        Khám phá thế giới tri
                                                        thức đa dạng
                                                    </p>
                                                </div>
                                                <div className="text-white/90 text-xs font-medium">
                                                    {bookCategories.length} thể
                                                    loại
                                                </div>
                                            </div>
                                        </div>

                                        {/* Categories Grid */}
                                        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                                            <div className="grid grid-cols-3 gap-4">
                                                {bookCategories.map(
                                                    (category, index) => (
                                                        <button
                                                            key={category.id}
                                                            onClick={() =>
                                                                handleCategoryClick(
                                                                    category.name
                                                                )
                                                            }
                                                            className="group relative p-4 rounded-xl bg-white hover:bg-gradient-to-br hover:from-blue-500 hover:to-indigo-600 border-2 border-gray-100 hover:border-transparent transition-all duration-300 text-left shadow-sm hover:shadow-xl transform hover:-translate-y-1"
                                                        >
                                                            {/* Decorative Background Pattern */}
                                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                                                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] opacity-20"></div>
                                                            </div>

                                                            {/* Content */}
                                                            <div className="relative flex items-start gap-3.5">
                                                                {/* Icon */}
                                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:from-white group-hover:to-blue-50 flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                                                                    <svg
                                                                        className="w-6 h-6 text-white group-hover:text-blue-600 transition-colors duration-300"
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
                                                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                                        />
                                                                    </svg>
                                                                </div>

                                                                {/* Text Content */}
                                                                <div className="flex-1 min-w-0 pt-1">
                                                                    <h4 className="font-bold text-gray-800 group-hover:text-white transition-colors duration-300 text-sm leading-tight mb-1 whitespace-nowrap">
                                                                        {
                                                                            category.name
                                                                        }
                                                                    </h4>
                                                                    <p className="text-xs text-gray-500 group-hover:text-blue-100 transition-colors duration-300 whitespace-nowrap">
                                                                        Khám phá
                                                                        ngay
                                                                    </p>
                                                                </div>

                                                                {/* Arrow Icon */}
                                                                <svg
                                                                    className="w-5 h-5 text-gray-300 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0 mt-1 transform group-hover:translate-x-1"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2.5
                                                                        }
                                                                        d="M9 5l7 7-7 7"
                                                                    />
                                                                </svg>
                                                            </div>

                                                            {/* Shine Effect on Hover */}
                                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl overflow-hidden">
                                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                                            </div>
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {/* Footer Section */}
                                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                                            <Link
                                                to="/books"
                                                className="group inline-flex items-center justify-center gap-2.5 w-full px-5 py-3.5 rounded-xl bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                <svg
                                                    className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2.5}
                                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                                    />
                                                </svg>
                                                <span>Xem Tất Cả Thể Loại</span>
                                                <svg
                                                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
                            style={{
                                color:
                                    isHomePage && opacity > 0.5
                                        ? "white"
                                        : "#2563eb",
                            }}
                        >
                            <span className="font-bold text-xl">
                                Về chúng tôi
                            </span>
                            <span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                                style={{
                                    backgroundColor:
                                        isHomePage && opacity > 0.5
                                            ? "white"
                                            : "#2563eb",
                                }}
                            ></span>
                        </Link>
                        <Link
                            to="/contact"
                            className="relative group transition-colors"
                            style={{
                                color:
                                    isHomePage && opacity > 0.5
                                        ? "white"
                                        : "#2563eb",
                            }}
                        >
                            <span className="font-bold text-xl">Liên hệ</span>
                            <span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                                style={{
                                    backgroundColor:
                                        isHomePage && opacity > 0.5
                                            ? "white"
                                            : "#2563eb",
                                }}
                            ></span>
                        </Link>
                    </div>

                    {/* Right Section: Search, Cart, Account */}
                    <div className="flex items-center gap-4">
                        {/* Search Box */}
                        <div className="search-container relative hidden lg:block">
                            <form onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    placeholder="Tìm kiếm tên sách, tác giả"
                                    className="w-80 px-4 py-2 pr-12 rounded-full bg-gray-100 border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-2 transition-all duration-300"
                                    style={{
                                        boxShadow: "none",
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg bg-gray-400"
                                >
                                    <FaSearch className="text-sm" />
                                </button>
                            </form>

                            {/* Search Suggestions Dropdown */}
                            {showSearchSuggestions &&
                                searchSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-slideDown">
                                        {searchSuggestions.map((book) => {
                                            const imageUrl =
                                                book.bookImage &&
                                                book.bookImage.length > 0
                                                    ? `https://hai-project-images.s3.us-east-1.amazonaws.com/${book.bookImage[0].imagePath}`
                                                    : "https://anhdephd.vn/wp-content/uploads/2022/06/hinh-anh-sach-800x457.jpg";

                                            return (
                                                <Link
                                                    key={book.id}
                                                    to={`/books/${book.id}`}
                                                    onClick={() => {
                                                        setSearchValue("");
                                                        setShowSearchSuggestions(
                                                            false
                                                        );
                                                    }}
                                                    className="flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                                                >
                                                    <img
                                                        src={imageUrl}
                                                        alt={book.title}
                                                        className="w-12 h-16 object-cover rounded"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-semibold text-gray-800 truncate">
                                                            {book.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {book.author}
                                                        </p>
                                                        <p className="text-sm font-bold text-blue-600 mt-1">
                                                            {formatCurrency(
                                                                book.sellingPrice
                                                            )}
                                                        </p>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSearch(e as any);
                                            }}
                                            className="w-full p-3 text-center text-blue-600 hover:bg-blue-50 font-semibold text-sm transition-colors"
                                        >
                                            Xem tất cả kết quả cho "
                                            {searchValue}"
                                        </button>
                                    </div>
                                )}

                            {/* No results message */}
                            {showSearchSuggestions &&
                                searchSuggestions.length === 0 &&
                                !isSearching &&
                                searchValue.trim().length >= 2 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 animate-slideDown">
                                        <p className="text-center text-gray-500 text-sm">
                                            Không tìm thấy sách nào phù hợp
                                        </p>
                                    </div>
                                )}
                        </div>
                        {/* Cart Icon với Badge */}
                        <div
                            className="cart-menu relative"
                            onMouseEnter={() => {
                                setIsCartClosing(false);
                                setShowCartMenu(true);
                            }}
                            onMouseLeave={() => {
                                setIsCartClosing(true);
                                setTimeout(() => setShowCartMenu(false), 200);
                            }}
                        >
                            <button
                                className="relative flex items-center p-2 rounded-full transition-all duration-500"
                                onClick={() => navigate("/cart")}
                                style={{
                                    color:
                                        isHomePage && opacity > 0.5
                                            ? "white"
                                            : "#2563eb",
                                }}
                            >
                                <ShoppingCart
                                    className="text-3xl"
                                    style={{
                                        color:
                                            isHomePage && opacity > 0.5
                                                ? "white"
                                                : "#2563eb",
                                    }}
                                />
                                {size > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {size}
                                    </span>
                                )}
                            </button>

                            {/* Cart Dropdown */}
                            {showCartMenu && (
                                <div className="absolute right-0 top-full pt-2 w-[400px]">
                                    <div
                                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                                        style={{
                                            animation: isCartClosing
                                                ? "slideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards"
                                                : "slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                                        }}
                                    >
                                        {cartItems.length === 0 ? (
                                            <p className="p-20 text-center text-gray-500 font-bold">
                                                Giỏ hàng trống
                                            </p>
                                        ) : (
                                            <>
                                                {/* Cart Items */}
                                                <div className="max-h-[300px] overflow-y-auto">
                                                    {cartItems
                                                        .slice(
                                                            0,
                                                            cartItems.length
                                                        )
                                                        .map((item) => {
                                                            const isOutOfStock =
                                                                item.book
                                                                    .quantity ===
                                                                0;
                                                            return (
                                                                <div
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className={`flex items-center gap-3 p-4 border-b border-gray-100 cursor-pointer ${
                                                                        isOutOfStock
                                                                            ? "opacity-50"
                                                                            : ""
                                                                    }`}
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/books/${item.book.id}`
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="relative w-16 h-16">
                                                                        <img
                                                                            src={
                                                                                `${S3_CONFIG.BASE_URL}${item.book.image}` ||
                                                                                "/default-image.png"
                                                                            }
                                                                            alt={
                                                                                item
                                                                                    .book
                                                                                    ?.title ||
                                                                                "Book"
                                                                            }
                                                                            className={`w-16 h-16 object-cover rounded ${
                                                                                isOutOfStock
                                                                                    ? "opacity-50"
                                                                                    : ""
                                                                            }`}
                                                                        />
                                                                        {isOutOfStock && (
                                                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                                                                                <span className="text-white text-xs font-semibold">
                                                                                    Hết
                                                                                    hàng
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 flex flex-col justify-center">
                                                                        <h4 className="text-sm text-gray-800 mb-1 line-clamp-1">
                                                                            {item
                                                                                .book
                                                                                ?.title ||
                                                                                "Không có tiêu đề"}
                                                                        </h4>
                                                                        <p className="text-xs text-gray-500">
                                                                            Số
                                                                            lượng:{" "}
                                                                            {
                                                                                item.quantity
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        className="text-black-400 hover:text-gray-600 p-1"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            handleRemoveItem(
                                                                                item.id
                                                                            );
                                                                        }}
                                                                    >
                                                                        <FaTimes className="text-sm" />
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                </div>

                                                {/* Footer */}
                                                <div className="p-4 bg-white border-t border-gray-100">
                                                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                                                        <span className="text-sm text-gray-600">
                                                            Tổng sản phẩm
                                                        </span>
                                                        <span className="text-sm font-semibold text-gray-800">
                                                            {totalQuantity}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-sm text-gray-600">
                                                            Tổng tiền
                                                        </span>
                                                        <span className="text-lg font-bold text-red-600">
                                                            {formatCurrency(
                                                                totalPrice
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2.5 rounded-full hover:bg-gray-50 transition"
                                                            onClick={() =>
                                                                navigate(
                                                                    "/cart"
                                                                )
                                                            }
                                                        >
                                                            Xem giỏ hàng
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
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
                                className="relative flex items-center p-1 rounded-full transition-all duration-500"
                                style={{
                                    color:
                                        isHomePage && opacity > 0.5
                                            ? "white"
                                            : "#2563eb",
                                }}
                            >
                                {currentUser?.avatar ? (
                                    <img
                                        src={currentUser.avatar}
                                        alt={currentUser.fullName}
                                        className="w-10 h-10 rounded-full object-cover border-2"
                                        style={{
                                            borderColor:
                                                isHomePage && opacity > 0.5
                                                    ? "white"
                                                    : "#2563eb",
                                        }}
                                    />
                                ) : currentUser ? (
                                    <div
                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold border-2"
                                        style={{
                                            borderColor:
                                                isHomePage && opacity > 0.5
                                                    ? "white"
                                                    : "#2563eb",
                                        }}
                                    >
                                        {currentUser.fullName
                                            ?.charAt(0)
                                            .toUpperCase() || "U"}
                                    </div>
                                ) : (
                                    <UserCircle
                                        className="text-3xl"
                                        style={{
                                            color:
                                                isHomePage && opacity > 0.5
                                                    ? "white"
                                                    : "#2563eb",
                                        }}
                                    />
                                )}
                            </button>

                            {/* Account Dropdown */}
                            {showAccountMenu && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
                                    {currentUser ? (
                                        <div className="p-2">
                                            {/* User Info Section */}
                                            <div className="px-4 py-3 border-b border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    {currentUser.avatar ? (
                                                        <img
                                                            src={
                                                                currentUser.avatar
                                                            }
                                                            alt={
                                                                currentUser.fullName
                                                            }
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                                            {currentUser.fullName
                                                                ?.charAt(0)
                                                                .toUpperCase() ||
                                                                "U"}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-800 truncate">
                                                            {
                                                                currentUser.fullName
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {currentUser.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

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
                                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition group"
                                            >
                                                <FaCog className="text-lg text-blue-600 group-hover:scale-110 transition" />
                                                <span className="font-medium">
                                                    Cài đặt
                                                </span>
                                            </Link>
                                            <div className="border-t border-gray-200 my-2"></div>
                                            <button
                                                onClick={() => {
                                                    localStorage.removeItem(
                                                        "user"
                                                    );
                                                    localStorage.removeItem(
                                                        "token"
                                                    );
                                                    setCurrentUser(null);
                                                    setShowAccountMenu(false);
                                                    navigate("/");
                                                    window.location.reload();
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition group"
                                            >
                                                <FaSignOutAlt className="text-lg group-hover:scale-110 transition" />
                                                <span className="font-medium">
                                                    Đăng xuất
                                                </span>
                                            </button>
                                        </div>
                                    ) : (
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
                                        </div>
                                    )}
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
