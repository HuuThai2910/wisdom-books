import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useBooks } from "../../contexts/BookContext";
import BookCard from "../../components/common/BookCard";

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
    const { books, loading, fetchBooks, totalPages, totalBooks } = useBooks();
    const [currentPage, setCurrentPage] = useState(0);
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

    const fetchBooksWithFilters = async () => {
        const filterQuery = buildFilterQuery();

        console.log("=== FETCH BOOKS CATEGORY PAGE ===");
        console.log("categoryName:", decodedCategoryName);
        console.log("Filter Query:", filterQuery);
        console.log("Page:", currentPage);

        await fetchBooks(
            currentPage,
            pageSize,
            "createdAt,desc",
            filterQuery || undefined
        );
    };

    useEffect(() => {
        if (decodedCategoryName) {
            fetchBooksWithFilters();
        }
    }, [decodedCategoryName, currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Banner */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative w-screen h-[750px] overflow-hidden"
            >
                {/* Hiệu ứng Zoom + Fade-in */}
                <motion.img
                    key={bannerImage}
                    src={bannerImage}
                    alt={decodedCategoryName}
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="w-full h-full object-contain"
                />

                {/* Hiệu ứng overlay gradient siêu đẹp */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-transparent pointer-events-none"></div>
            </motion.div>

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
                                {totalBooks}{" "}
                            </span>
                            đầu sách thuộc thể loại "{decodedCategoryName}"
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {books.map((b, i) => (
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
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-10">
                                <button
                                    disabled={currentPage === 0}
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    className="px-4 py-2 bg-gray-200 rounded-lg"
                                >
                                    «
                                </button>

                                {/* số trang */}
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        className={`px-4 py-2 rounded-lg ${
                                            i === currentPage
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === totalPages - 1}
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    className="px-4 py-2 bg-gray-200 rounded-lg"
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
