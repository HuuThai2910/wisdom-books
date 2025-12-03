import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useBooks } from "../../contexts/BookContext";
import BookCard from "../../components/common/BookCard";
import { Book } from "../../types";
import {
    FaChevronLeft,
    FaChevronRight,
    FaHome,
    FaBookOpen,
} from "react-icons/fa";

import banner_amthuc from "../../assets/img/book/banner/banner_amthuc.png";
import banner_cntt from "../../assets/img/book/banner/banner_cntt.png";
import banner_dulich from "../../assets/img/book/banner/banner_dulich.png";
import banner_kinhdoanh from "../../assets/img/book/banner/banner_kinhdoanh.png";
import banner_nghethuat from "../../assets/img/book/banner/banner_nghethuat.png";
import banner_thethao from "../../assets/img/book/banner/banner_thethao.png";
import banner_thieunhi from "../../assets/img/book/banner/banner_thieunhi.png";
import left from "../../assets/img/book/banner/left.png";
import right from "../../assets/img/book/banner/right.png";
const categoryBanners: { [key: string]: string } = {
    "Ẩm thực – Nấu ăn": banner_amthuc,
    "Công nghệ thông tin": banner_cntt,
    "Du lịch – Địa lý": banner_dulich,
    "Kinh doanh": banner_kinhdoanh,
    "Nghệ thuật": banner_nghethuat,
    "Thể thao": banner_thethao,
    "Thiếu nhi": banner_thieunhi,
};

export default function CategoryPage() {
    const { categoryName } = useParams<{ categoryName: string }>();
    const {
        books: contextBooks,
        loading,
        fetchBooks,
        totalPages: contextTotalPages,
        totalBooks: contextTotalBooks,
    } = useBooks();
    const [currentPage, setCurrentPage] = useState(0);
    const [localBooks, setLocalBooks] = useState<Book[]>([]);
    const [localTotalPages, setLocalTotalPages] = useState(1);
    const [localTotalBooks, setLocalTotalBooks] = useState(0);
    const pageSize = 12;

    // Decode category name từ URL
    const decodedCategoryName = categoryName
        ? decodeURIComponent(categoryName)
        : "";
    const bannerImage = categoryBanners[decodedCategoryName] || banner_cntt;

    // ĐỒNG BỘ LOGIC LỌC VỚI BooksPage
    const buildFilterQuery = (): string => {
        const filterParts: string[] = [];

        // Filter by category from URL - GIỐNG HỆT BooksPage
        if (decodedCategoryName) {
            filterParts.push(`categories.name~'${decodedCategoryName}'`);
        }

        return filterParts.join(" and ");
    };

    // Reset page to 0 when category changes
    useEffect(() => {
        setCurrentPage(0);
        setLocalBooks([]); // Clear books immediately when category changes
        setLocalTotalPages(1);
        setLocalTotalBooks(0);
    }, [categoryName]); // Use categoryName from URL, not decoded

    // Update local books when context books change (only when not loading)
    useEffect(() => {
        if (!loading) {
            setLocalBooks(contextBooks);
        }
    }, [contextBooks, loading]);

    // Update local pagination when context pagination changes (only when not loading)
    useEffect(() => {
        if (!loading) {
            setLocalTotalPages(contextTotalPages);
            setLocalTotalBooks(contextTotalBooks);
        }
    }, [contextTotalPages, contextTotalBooks, loading]);

    // Fetch books when category or page changes
    useEffect(() => {
        if (decodedCategoryName) {
            const filterQuery = buildFilterQuery();

            console.log("=== FETCH BOOKS CATEGORY PAGE ===");
            console.log("categoryName:", decodedCategoryName);
            console.log("Filter Query:", filterQuery);
            console.log("Page:", currentPage);

            // Force re-fetch without cache
            const controller = new AbortController();

            fetchBooks(
                currentPage,
                pageSize,
                "createdAt,desc",
                filterQuery || undefined
            );

            return () => controller.abort();
        }
    }, [decodedCategoryName, currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 0 && page < localTotalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(
            0,
            currentPage - Math.floor(maxVisiblePages / 2)
        );
        let endPage = Math.min(
            localTotalPages - 1,
            startPage + maxVisiblePages - 1
        );

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(0, endPage - maxVisiblePages + 1);
        }

        // Add first page if not visible
        if (startPage > 0) {
            pages.push(
                <button
                    key={0}
                    onClick={() => handlePageChange(0)}
                    className="w-10 h-10 rounded-md font-medium transition-all duration-200 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-700"
                >
                    1
                </button>
            );
            if (startPage > 1) {
                pages.push(
                    <span
                        key="dots-start"
                        className="w-10 h-10 flex items-center justify-center text-gray-400"
                    >
                        ...
                    </span>
                );
            }
        }

        // Add visible pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`w-10 h-10 rounded-md font-medium transition-all duration-200 ${
                        currentPage === i
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-700"
                    }`}
                >
                    {i + 1}
                </button>
            );
        }

        // Add last page if not visible
        if (endPage < localTotalPages - 1) {
            if (endPage < localTotalPages - 2) {
                pages.push(
                    <span
                        key="dots-end"
                        className="w-10 h-10 flex items-center justify-center text-gray-400"
                    >
                        ...
                    </span>
                );
            }
            pages.push(
                <button
                    key={localTotalPages - 1}
                    onClick={() => handlePageChange(localTotalPages - 1)}
                    className="w-10 h-10 rounded-md font-medium transition-all duration-200 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-700"
                >
                    {localTotalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20">
            {/* Banner Section with Image Background */}
            <div className="relative w-full overflow-hidden py-20">
                {/* Blurred background image - full opacity */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${bannerImage})`,
                        filter: "blur(30px) brightness(0.8)",
                        transform: "scale(1.2)",
                    }}
                />

                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50" />

                {/* Subtle animated overlay */}
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        background: [
                            "linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))",
                            "linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))",
                        ],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Content */}
                <div className="container mx-auto px-6 relative z-10">
                    {/* Breadcrumb */}
                    <motion.nav
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 text-white/90 mb-8 text-sm"
                    >
                        <Link
                            to="/"
                            className="hover:text-white transition-colors flex items-center gap-2"
                        >
                            <FaHome />
                            <span>Trang chủ</span>
                        </Link>
                        <span>/</span>
                        <Link
                            to="/books"
                            className="hover:text-white transition-colors"
                        >
                            Sản phẩm
                        </Link>
                        <span>/</span>
                        <span className="text-white font-semibold">
                            {decodedCategoryName}
                        </span>
                    </motion.nav>

                    <div className="flex items-center justify-between">
                        {/* Left: Category Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex-1"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/20">
                                    <FaBookOpen className="text-4xl text-white" />
                                </div>
                                <div>
                                    <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                                        {decodedCategoryName}
                                    </h1>
                                    <div className="flex items-center gap-2 text-white/90">
                                        <span className="text-lg">
                                            {loading ? (
                                                "Đang tải..."
                                            ) : (
                                                <>
                                                    <span className="font-bold text-yellow-300 text-xl">
                                                        {localTotalBooks}
                                                    </span>{" "}
                                                    cuốn sách
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-white/80 text-base max-w-2xl leading-relaxed">
                                Khám phá bộ sưu tập sách phong phú về{" "}
                                {decodedCategoryName.toLowerCase()} với nhiều
                                tác phẩm chất lượng từ các tác giả trong và
                                ngoài nước
                            </p>
                        </motion.div>

                        {/* Right: Featured Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="hidden lg:block w-72 h-56"
                        >
                            <motion.div
                                animate={{
                                    y: [0, -15, 0],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="relative w-full h-full"
                            >
                                <img
                                    src={bannerImage}
                                    alt={decodedCategoryName}
                                    className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white/20"
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-pulse flex flex-col items-center gap-4">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <div className="text-lg text-gray-600 font-semibold">
                                Đang tải sách...
                            </div>
                        </div>
                    </div>
                ) : localBooks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-lg p-12"
                    >
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Chưa có sách nào
                        </h3>
                        <p className="text-gray-500 text-center mb-6">
                            Hiện tại chưa có sách nào thuộc thể loại "
                            {decodedCategoryName}"
                        </p>
                        <Link
                            to="/books"
                            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Khám phá thể loại khác
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        {/* Books Grid */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
                        >
                            {localBooks.map((b, i) => (
                                <motion.div
                                    key={b.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: i * 0.05,
                                    }}
                                >
                                    <BookCard
                                        book={b}
                                        index={i}
                                        showAddToCart={true}
                                        variant="default"
                                    />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        {localTotalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex items-center justify-center gap-2 mt-12"
                            >
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 0}
                                    className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 hover:bg-blue-100 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-gray-700"
                                >
                                    <FaChevronLeft />
                                </button>

                                {renderPagination()}

                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={
                                        currentPage === localTotalPages - 1
                                    }
                                    className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 hover:bg-blue-100 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-gray-700"
                                >
                                    <FaChevronRight />
                                </button>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
