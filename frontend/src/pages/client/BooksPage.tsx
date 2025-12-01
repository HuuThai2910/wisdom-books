import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import FilterModal, { FilterOptions } from "../../components/Books/FilterModal";
import BookCard from "../../components/common/BookCard";
import bookApi from "../../api/bookApi";
import { Book } from "../../types";

export default function BooksPage() {
    // Local state - không dùng BookContext để tránh conflict với Home
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get("category");
    const searchQuery = searchParams.get("search");

    // Use useMemo to stabilize filter object reference
    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const [filters, setFilters] = useState<FilterOptions>(() => ({
        categories: [],
        priceRange: [0, 5000000],
        yearRange: [1900, currentYear],
        status: [],
        sortBy: "createdAt,desc",
    }));
    const pageSize = 12;

    // Track if component has fetched data
    const hasFetched = useRef(false);

    // Build filter query function
    const buildFilterQuery = useMemo(() => {
        return (): string => {
            const filterParts: string[] = [];

            // Filter by search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                filterParts.push(
                    `(title~'*${query}*' or author~'*${query}*' or categories.name~'*${query}*')`
                );
            }

            // Filter by category from URL
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
            if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000000) {
                filterParts.push(
                    `sellingPrice>=${filters.priceRange[0]} and sellingPrice<=${filters.priceRange[1]}`
                );
            }

            // Filter by year range
            if (
                filters.yearRange[0] > 1900 ||
                filters.yearRange[1] < new Date().getFullYear()
            ) {
                filterParts.push(
                    `yearOfPublication>=${filters.yearRange[0]} and yearOfPublication<=${filters.yearRange[1]}`
                );
            }

            return filterParts.join(" and ");
        };
    }, [searchQuery, categoryParam, filters]);

    // Fetch books function - local for BooksPage only
    const fetchBooks = async (
        page: number,
        size: number,
        sort: string,
        filter?: string
    ) => {
        try {
            setLoading(true);
            const response = await bookApi.getAllBooks({
                page,
                size,
                sort,
                filter,
            });
            if (response.data?.result) {
                setBooks(response.data.result);
                setTotalPages(response.data.meta?.pages || 1);
            }
        } catch (err: any) {
            console.error("Error fetching books:", err);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    // Memoize filter dependencies to prevent unnecessary re-renders
    const filterDeps = useMemo(
        () => ({
            categories: filters.categories.join(","),
            status: filters.status.join(","),
            priceMin: filters.priceRange[0],
            priceMax: filters.priceRange[1],
            yearMin: filters.yearRange[0],
            yearMax: filters.yearRange[1],
        }),
        [
            filters.categories,
            filters.status,
            filters.priceRange[0],
            filters.priceRange[1],
            filters.yearRange[0],
            filters.yearRange[1],
        ]
    );

    // Single fetch effect
    useEffect(() => {
        const filterQuery = buildFilterQuery();

        console.log("=== FETCH BOOKS ===");
        console.log("Page:", currentPage);
        console.log("Category:", categoryParam);
        console.log("Search:", searchQuery);
        console.log("Filter Query:", filterQuery);
        console.log("Has Fetched:", hasFetched.current);

        hasFetched.current = true;
        fetchBooks(
            currentPage,
            pageSize,
            filters.sortBy,
            filterQuery || undefined
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentPage,
        categoryParam,
        searchQuery,
        filters.sortBy,
        filterDeps.categories,
        filterDeps.status,
        filterDeps.priceMin,
        filterDeps.priceMax,
        filterDeps.yearMin,
        filterDeps.yearMax,
    ]);

    const handleApplyFilter = (newFilters: FilterOptions) => {
        setCurrentPage(0);
        setFilters(newFilters);
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
                    className={`min-w-[40px] h-10 px-3 rounded-full font-semibold transition-all duration-300 ${
                        currentPage === i
                            ? "bg-blue-600 text-white shadow-lg scale-110"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105"
                    }`}
                >
                    {i + 1}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-15">
            <div className="container mx-auto px-6 py-8">
                {/* Page Header */}

                {/* Main Content - Flex Layout */}
                <div className="flex gap-6 relative">
                    {/* Floating Toggle Button - Shows when filter is closed */}
                    <motion.button
                        initial={false}
                        animate={{
                            opacity: isFilterOpen ? 0 : 1,
                            x: isFilterOpen ? -100 : 0,
                            pointerEvents: isFilterOpen ? "none" : "auto",
                        }}
                        transition={{
                            duration: 0.4,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        onClick={() => setIsFilterOpen(true)}
                        className="fixed left-6 top-32 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                        title="Mở bộ lọc"
                    >
                        <FaFilter className="text-xl group-hover:rotate-12 transition-transform duration-300" />
                        <span className="absolute -right-2 -top-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                            {filters.categories.length +
                                filters.status.length || ""}
                        </span>
                    </motion.button>

                    {/* Left Sidebar - Filter */}
                    <motion.div
                        initial={false}
                        animate={{
                            width: isFilterOpen ? 320 : 0,
                            opacity: isFilterOpen ? 1 : 0,
                            marginRight: isFilterOpen ? 24 : 0,
                        }}
                        transition={{
                            duration: 0.4,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        className="overflow-hidden shrink-0"
                    >
                        <FilterModal
                            onApplyFilter={handleApplyFilter}
                            currentFilters={filters}
                            isOpen={isFilterOpen}
                            onToggle={() => setIsFilterOpen(!isFilterOpen)}
                        />
                    </motion.div>

                    {/* Right Content - Books Grid */}
                    <motion.div
                        layout
                        transition={{
                            duration: 0.4,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        className="flex-1 min-w-0"
                    >
                        {/* Books Grid */}
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-pulse flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <div className="text-lg text-gray-600 font-semibold">
                                        Đang tải sách...
                                    </div>
                                </div>
                            </div>
                        ) : books.length === 0 ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">📚</div>
                                    <div className="text-xl text-gray-600 font-semibold mb-2">
                                        Không tìm thấy sách nào
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        Thử điều chỉnh bộ lọc của bạn
                                    </p>
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
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex items-center justify-center gap-2 mt-8 p-4 bg-white rounded-2xl shadow-lg border border-blue-100"
                            >
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 0}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-blue-600"
                                >
                                    <FaChevronLeft />
                                </button>

                                {renderPagination()}

                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages - 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-blue-600"
                                >
                                    <FaChevronRight />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
