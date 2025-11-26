import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import FilterModal, { FilterOptions } from "../../components/Books/FilterModal";
import { useBooks } from "../../contexts/BookContext";
import BookCard from "../../components/common/BookCard";

export default function BooksPage() {
    const { books, loading, fetchBooks, totalPages, totalBooks } = useBooks();
    const [currentPage, setCurrentPage] = useState(0);
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get("category");
    const searchQuery = searchParams.get("search");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchValue, setSearchValue] = useState(searchQuery || "");
    const [filters, setFilters] = useState<FilterOptions>({
        categories: [],
        priceRange: [0, 1000000],
        yearRange: [1900, new Date().getFullYear()],
        status: [],
        sortBy: "createdAt,desc",
    });
    const pageSize = 12;

    useEffect(() => {
        fetchBooksWithFilters();
    }, [currentPage, filters, searchValue, categoryParam, searchQuery]);

    const buildFilterQuery = (): string => {
        const filterParts: string[] = [];

        // Filter by search query
        if (searchValue.trim() || searchQuery) {
            const query = (searchValue || searchQuery || "").toLowerCase();
            filterParts.push(
                `(title~'*${query}*' or author~'*${query}*' or description~'*${query}*')`
            );
        }

        // Filter by category from URL (ManyToMany relationship)
        if (categoryParam) {
            filterParts.push(`categories.name~'${categoryParam}'`);
        }
        // Filter by categories from filter panel
        else if (filters.categories.length > 0) {
            const categoryFilters = filters.categories
                .map((name) => `categories.name~'${name}'`)
                .join(" or ");
            filterParts.push(`(${categoryFilters})`);
        }

        // Filter by status
        if (filters.status.length > 0) {
            const statusFilter = filters.status
                .map((s) => `status:'${s}'`)
                .join(" or ");
            filterParts.push(`(${statusFilter})`);
        }

        // Filter by price range
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) {
            filterParts.push(
                `sellingPrice>${filters.priceRange[0]} and sellingPrice<${filters.priceRange[1]}`
            );
        }

        // Filter by year range
        if (
            filters.yearRange[0] > 1900 ||
            filters.yearRange[1] < new Date().getFullYear()
        ) {
            filterParts.push(
                `yearOfPublication>${filters.yearRange[0]} and yearOfPublication<${filters.yearRange[1]}`
            );
        }

        return filterParts.join(" and ");
    };

    const fetchBooksWithFilters = async () => {
        const filterQuery = buildFilterQuery();

        console.log("=== FETCH BOOKS ===");
        console.log("categoryParam:", categoryParam);
        console.log("Filter Query:", filterQuery);
        console.log("Page:", currentPage);
        console.log("Sort:", filters.sortBy);

        await fetchBooks(
            currentPage,
            pageSize,
            filters.sortBy,
            filterQuery || undefined
        );
    };

    const handleApplyFilter = (newFilters: FilterOptions) => {
        setFilters(newFilters);
        setCurrentPage(0);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(0);
    };

    const handlePageChange = (page: number) => {
        if (page >= 0 && page < totalPages) {
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
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(0, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        currentPage === i
                            ? "wisbook-btn-gradient text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    {i + 1}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="min-h-screen wisbook-gradient-overlay pt-20">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold wisbook-gradient-text mb-2">
                                Tất Cả Sách
                            </h1>
                            <p className="text-gray-600">
                                Khám phá bộ sưu tập{" "}
                                {totalBooks.toLocaleString()} đầu sách của chúng
                                tôi
                            </p>
                        </div>

                        {/* Filter Button */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-300"
                        >
                            <FaFilter />
                            <span>Bộ lọc</span>
                        </button>
                    </div>

                    {/* Filter Panel - Expand/Collapse */}
                    <FilterModal
                        isOpen={isFilterOpen}
                        onClose={() => setIsFilterOpen(false)}
                        onApplyFilter={handleApplyFilter}
                        currentFilters={filters}
                    />
                </motion.div>

                {/* Books Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-xl text-gray-600">
                            Đang tải sách...
                        </div>
                    </div>
                ) : books.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-xl text-gray-600">
                            Không tìm thấy sách nào
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
                    >
                        {books.map((book, index) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                index={index}
                                showAddToCart={true}
                                variant="default"
                            />
                        ))}
                    </motion.div>
                )}

                {/* Pagination */}
                {!loading && books.length > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <FaChevronLeft className="text-gray-700" />
                        </button>

                        {renderPagination()}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <FaChevronRight className="text-gray-700" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
