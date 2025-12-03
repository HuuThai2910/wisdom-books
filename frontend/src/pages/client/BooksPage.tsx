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
    const [currentPage, setCurrentPage] = useState(() => {
        const saved = localStorage.getItem("booksPage_currentPage");
        return saved ? parseInt(saved) : 0;
    });
    const [isFilterOpen, setIsFilterOpen] = useState(() => {
        const saved = localStorage.getItem("booksPage_filterOpen");
        return saved ? JSON.parse(saved) : true;
    });
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get("category");
    const searchQuery = searchParams.get("search");
    const authorParam = searchParams.get("author");

    // Use useMemo to stabilize filter object reference
    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const [filters, setFilters] = useState<FilterOptions>(() => {
        // Load from localStorage if available
        const saved = localStorage.getItem("booksPage_filters");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error parsing saved filters:", e);
            }
        }
        return {
            categories: [],
            priceRange: [0, 5000000],
            yearRange: [1900, currentYear],
            status: [],
            sortBy: "createdAt,desc",
        };
    });
    const pageSize = 12;

    // Track if component has fetched data
    const hasFetched = useRef(false);

    // Save filters to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("booksPage_filters", JSON.stringify(filters));
    }, [filters]);

    // Save current page to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("booksPage_currentPage", currentPage.toString());
    }, [currentPage]);

    // Save filter panel state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(
            "booksPage_filterOpen",
            JSON.stringify(isFilterOpen)
        );
    }, [isFilterOpen]);

    // Clear saved state when category, search, or author params change
    useEffect(() => {
        if (categoryParam || searchQuery || authorParam) {
            // Reset to default when navigating with params
            setCurrentPage(0);
            localStorage.removeItem("booksPage_currentPage");
            localStorage.removeItem("booksPage_filters");

            // Reset filters when navigating with URL params
            setFilters({
                categories: [],
                priceRange: [0, 5000000],
                yearRange: [1900, currentYear],
                status: [],
                sortBy: "createdAt,desc",
            });
        }
    }, [categoryParam, searchQuery, authorParam, currentYear]);

    // Build filter query function
    const buildFilterQuery = useMemo(() => {
        return (): string => {
            const filterParts: string[] = [];

            // Filter by author from URL (exact match using wildcard for flexibility)
            if (authorParam) {
                // Decode URL encoding to get actual author name
                const decodedAuthor = decodeURIComponent(authorParam);
                console.log("=== AUTHOR FILTER ===");
                console.log("Author param (raw):", authorParam);
                console.log("Author param (decoded):", decodedAuthor);
                // Try exact match with colon instead of tilde
                const filterStr = `author:'${decodedAuthor}'`;
                console.log("Filter string:", filterStr);
                filterParts.push(filterStr);
            }
            // Filter by search query
            else if (searchQuery) {
                // Decode search query as well
                const decodedSearch = decodeURIComponent(searchQuery);
                filterParts.push(
                    `(title~'*${decodedSearch}*' or author~'*${decodedSearch}*' or categories.name~'*${decodedSearch}*')`
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
    }, [searchQuery, categoryParam, authorParam, filters]);

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
        console.log("Author:", authorParam);
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
        authorParam,
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

        // Add first page if not visible
        if (startPage > 0) {
            pages.push(
                <button
                    key={0}
                    onClick={() => handlePageChange(0)}
                    className="w-10 h-10 rounded-md font-medium transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700"
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
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                >
                    {i + 1}
                </button>
            );
        }

        // Add last page if not visible
        if (endPage < totalPages - 1) {
            if (endPage < totalPages - 2) {
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
                    key={totalPages - 1}
                    onClick={() => handlePageChange(totalPages - 1)}
                    className="w-10 h-10 rounded-md font-medium transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-15 px-20">
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
                                className="flex items-center justify-center gap-2 mt-8"
                            >
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 0}
                                    className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-gray-700"
                                >
                                    <FaChevronLeft />
                                </button>

                                {renderPagination()}

                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages - 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-gray-700"
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
