import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilter: (filters: FilterOptions) => void;
    currentFilters: FilterOptions;
}

export interface FilterOptions {
    categories: string[];
    priceRange: [number, number];
    yearRange: [number, number];
    status: string[];
    sortBy: string;
}

const currentYear = new Date().getFullYear();

// Danh sách thể loại cố định
const CATEGORIES = [
    "Văn học",
    "Kinh doanh",
    "Công nghệ thông tin",
    "Phát triển bản thân",
    "Thiếu nhi",
    "Giáo dục – Học tập",
    "Khoa học – Công nghệ",
    "Văn hóa – Xã hội",
    "Y học – Sức khỏe",
    "Nghệ thuật",
    "Tôn giáo – Tâm linh",
    "Ẩm thực – Nấu ăn",
    "Thể thao",
    "Kinh tế – Chính trị",
    "Du lịch – Địa lý",
    "Nông nghiệp – Thú y",
    "Kỹ thuật – Công nghiệp",
];

export default function FilterModal({
    isOpen,
    onClose,
    onApplyFilter,
    currentFilters,
}: FilterModalProps) {
    const [filters, setFilters] = useState<FilterOptions>(currentFilters);

    const statusOptions = [
        { value: "AVAILABLE", label: "Còn hàng" },
        { value: "SALE", label: "Đang giảm giá" },
        { value: "OUT_OF_STOCK", label: "Hết hàng" },
    ];

    const sortOptions = [
        { value: "createdAt,desc", label: "Mới nhất" },
        { value: "title,asc", label: "Tên A-Z" },
        { value: "title,desc", label: "Tên Z-A" },
        { value: "sellingPrice,asc", label: "Giá thấp - cao" },
        { value: "sellingPrice,desc", label: "Giá cao - thấp" },
        { value: "yearOfPublication,desc", label: "Năm xuất bản mới nhất" },
    ];

    const handleCategoryToggle = (categoryName: string) => {
        const newFilters = {
            ...filters,
            categories: filters.categories.includes(categoryName)
                ? filters.categories.filter((name) => name !== categoryName)
                : [...filters.categories, categoryName],
        };
        setFilters(newFilters);
        onApplyFilter(newFilters); // Apply immediately
    };

    const handleStatusToggle = (status: string) => {
        const newFilters = {
            ...filters,
            status: filters.status.includes(status)
                ? filters.status.filter((s) => s !== status)
                : [...filters.status, status],
        };
        setFilters(newFilters);
        onApplyFilter(newFilters); // Apply immediately
    };

    const handlePriceChange = (index: 0 | 1, value: number) => {
        const newFilters = {
            ...filters,
            priceRange: [
                index === 0 ? value : filters.priceRange[0],
                index === 1 ? value : filters.priceRange[1],
            ] as [number, number],
        };
        setFilters(newFilters);
        // Don't apply immediately for price to allow user to finish typing
    };

    const handleYearChange = (index: 0 | 1, value: number) => {
        const newFilters = {
            ...filters,
            yearRange: [
                index === 0 ? value : filters.yearRange[0],
                index === 1 ? value : filters.yearRange[1],
            ] as [number, number],
        };
        setFilters(newFilters);
        // Don't apply immediately for year to allow user to finish typing
    };

    const handleSortChange = (sortBy: string) => {
        const newFilters = {
            ...filters,
            sortBy,
        };
        setFilters(newFilters);
        onApplyFilter(newFilters); // Apply immediately
    };

    const handleReset = () => {
        const resetFilters: FilterOptions = {
            categories: [],
            priceRange: [0, 1000000],
            yearRange: [1900, currentYear],
            status: [],
            sortBy: "createdAt,desc",
        };
        setFilters(resetFilters);
    };

    const handleApply = () => {
        onApplyFilter(filters);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className="bg-[#1a1d29] rounded-xl shadow-2xl p-6 mt-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <span className="text-yellow-500">▼</span>
                                Bộ lọc
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                            {/* Quốc gia (Danh mục) */}
                            <div className="xl:col-span-2">
                                <h3 className="text-white font-semibold mb-3 text-base">
                                    Danh mục:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() =>
                                                handleCategoryToggle(category)
                                            }
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                                filters.categories.includes(
                                                    category
                                                )
                                                    ? "bg-yellow-500 text-gray-900"
                                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Trạng thái */}
                            <div>
                                <h3 className="text-white font-semibold mb-3 text-base">
                                    Trạng thái:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {statusOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() =>
                                                handleStatusToggle(option.value)
                                            }
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                                filters.status.includes(
                                                    option.value
                                                )
                                                    ? "bg-yellow-500 text-gray-900"
                                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Khoảng giá */}
                            <div>
                                <h3 className="text-white font-semibold mb-3 text-base">
                                    Khoảng giá:
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={filters.priceRange[0]}
                                            onChange={(e) =>
                                                handlePriceChange(
                                                    0,
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            }
                                            className="w-full bg-gray-700 text-white px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                                            placeholder="Từ"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="number"
                                            value={filters.priceRange[1]}
                                            onChange={(e) =>
                                                handlePriceChange(
                                                    1,
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            }
                                            className="w-full bg-gray-700 text-white px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                                            placeholder="Đến"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        {filters.priceRange[0].toLocaleString(
                                            "vi-VN"
                                        )}
                                        ₫ -{" "}
                                        {filters.priceRange[1].toLocaleString(
                                            "vi-VN"
                                        )}
                                        ₫
                                    </p>
                                </div>
                            </div>

                            {/* Năm xuất bản */}
                            <div>
                                <h3 className="text-white font-semibold mb-3 text-base">
                                    Năm xuất bản:
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={filters.yearRange[0]}
                                            onChange={(e) =>
                                                handleYearChange(
                                                    0,
                                                    parseInt(e.target.value) ||
                                                        1900
                                                )
                                            }
                                            min={1900}
                                            max={currentYear}
                                            className="w-full bg-gray-700 text-white px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                                            placeholder="Từ năm"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="number"
                                            value={filters.yearRange[1]}
                                            onChange={(e) =>
                                                handleYearChange(
                                                    1,
                                                    parseInt(e.target.value) ||
                                                        currentYear
                                                )
                                            }
                                            min={1900}
                                            max={currentYear}
                                            className="w-full bg-gray-700 text-white px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                                            placeholder="Đến năm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sắp xếp */}
                            <div className="xl:col-span-2">
                                <h3 className="text-white font-semibold mb-3 text-base">
                                    Sắp xếp:
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {sortOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-700/50 p-2 rounded-md transition-colors"
                                        >
                                            <input
                                                type="radio"
                                                name="sortBy"
                                                value={option.value}
                                                checked={
                                                    filters.sortBy ===
                                                    option.value
                                                }
                                                onChange={(e) =>
                                                    handleSortChange(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                                            />
                                            <span className="text-gray-300 text-sm">
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-700 pt-4 mt-6 flex gap-3">
                            <button
                                onClick={handleReset}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
                            >
                                Đặt lại
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
                            >
                                Lọc kết quả →
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
