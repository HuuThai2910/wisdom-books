import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useBooks } from "../../contexts/BookContext";
import BookCard from "../../components/common/BookCard";
import { Book } from "../../types";

import banner_amthuc from "../../assets/img/book/banner/banner_amthuc.png";
import banner_cntt from "../../assets/img/book/banner/banner_cntt.png";
import banner_dulich from "../../assets/img/book/banner/banner_dulich.png";
import banner_kinhdoanh from "../../assets/img/book/banner/banner_kinhdoanh.png";
import banner_nghethuat from "../../assets/img/book/banner/banner_nghethuat.png";
import banner_thethao from "../../assets/img/book/banner/banner_thethao.png";
import banner_thieunhi from "../../assets/img/book/banner/banner_thieunhi.png";

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

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Banner */}
            {/* FULL-BLEED WRAPPER */}
            <div className="relative mt-20 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen py-10 bg-transparent overflow-hidden">
                {/* CENTERED BANNER WITH ROUNDED CORNERS */}
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    transition={{
                        duration: 1,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative mx-auto w-[90%] max-w-[1200px] h-[600px] rounded-3xl overflow-hidden shadow-2xl"
                >
                    {/* Animated background gradient */}
                    <motion.div
                        animate={{
                            background: [
                                "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
                                "linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))",
                                "linear-gradient(225deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))",
                                "linear-gradient(315deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
                            ],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute inset-0 z-0"
                    />

                    {/* Floating particles effect */}
                    <div className="absolute inset-0 z-10">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-white/30 rounded-full"
                                initial={{
                                    x: Math.random() * 1200,
                                    y: Math.random() * 600,
                                }}
                                animate={{
                                    y: [
                                        Math.random() * 600,
                                        Math.random() * 600,
                                        Math.random() * 600,
                                    ],
                                    x: [
                                        Math.random() * 1200,
                                        Math.random() * 1200,
                                        Math.random() * 1200,
                                    ],
                                    opacity: [0.3, 0.8, 0.3],
                                }}
                                transition={{
                                    duration: 8 + i * 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>

                    {/* Main image with parallax and zoom effect */}
                    <motion.div
                        className="absolute inset-0 z-20"
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <motion.img
                            key={bannerImage}
                            src={bannerImage}
                            alt={decodedCategoryName}
                            initial={{
                                scale: 1.15,
                                opacity: 0,
                                filter: "blur(10px)",
                            }}
                            animate={{
                                scale: [1.05, 1.08, 1.05],
                                opacity: 1,
                                filter: "blur(0px)",
                            }}
                            transition={{
                                scale: {
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                },
                                opacity: { duration: 1.2 },
                                filter: { duration: 1.2 },
                            }}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Animated overlay gradient */}
                    <motion.div
                        className="absolute inset-0 z-30"
                        animate={{
                            background: [
                                "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.05), transparent)",
                                "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.08), transparent)",
                                "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.05), transparent)",
                            ],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Shimmer effect */}
                    <motion.div
                        className="absolute inset-0 z-40"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                        }}
                        animate={{
                            x: ["-100%", "200%"],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 2,
                        }}
                    />

                    {/* Border glow effect */}
                    <motion.div
                        className="absolute inset-0 z-50 rounded-3xl pointer-events-none"
                        animate={{
                            boxShadow: [
                                "0 0 20px rgba(59, 130, 246, 0.3)",
                                "0 0 40px rgba(147, 51, 234, 0.4)",
                                "0 0 20px rgba(59, 130, 246, 0.3)",
                            ],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
            </div>

            <div className="container mx-auto px-6 py-12">
                {/* Books */}
                {loading ? (
                    <div className="text-center py-20 text-xl text-gray-600">
                        Đang tải sách...
                    </div>
                ) : (
                    <>
                        <div className="text-gray-700 mb-4">
                            Tìm thấy
                            <span className="text-blue-600 font-bold">
                                {localTotalBooks}{" "}
                            </span>
                            đầu sách thuộc thể loại "{decodedCategoryName}"
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {localBooks.map((b, i) => (
                                <BookCard
                                    key={b.id}
                                    book={b}
                                    index={i}
                                    showAddToCart={true}
                                    variant="default"
                                />
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        {localTotalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-10">
                                <button
                                    disabled={currentPage === 0}
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    className="px-4 py-2 bg-gray-200 rounded-lg border border-blue-600 text-blue-600"
                                >
                                    «
                                </button>

                                {/* số trang */}
                                {[...Array(localTotalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        className={`px-4 py-2 rounded-lg ${
                                            i === currentPage
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 border border-blue-600 text-blue-600"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    disabled={
                                        currentPage === localTotalPages - 1
                                    }
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    className="px-4 py-2 bg-gray-200 rounded-lg border border-blue-600 text-blue-600"
                                >
                                    »
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
