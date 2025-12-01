import { useState } from "react";
import {
    FaFilter,
    FaRedo,
    FaChevronDown,
    FaChevronUp,
    FaCheck,
} from "react-icons/fa";
import "./FilterModal.css";

interface FilterModalProps {
    onApplyFilter: (filters: FilterOptions) => void;
    currentFilters: FilterOptions;
    isOpen?: boolean;
    onToggle?: () => void;
}

export interface FilterOptions {
    categories: string[];
    priceRange: [number, number];
    yearRange: [number, number];
    status: string[];
    sortBy: string;
}

const currentYear = new Date().getFullYear();

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
    onApplyFilter,
    currentFilters,
    isOpen = true,
    onToggle,
}: FilterModalProps) {
    const [filters, setFilters] = useState<FilterOptions>(currentFilters);
    const [expandedSections, setExpandedSections] = useState({
        categories: false,
        status: true,
        price: true,
        year: true,
        sort: true,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const sortOptions = [
        { value: "createdAt,desc", label: "Mới nhất" },
        { value: "title,asc", label: "Tên A-Z" },
        { value: "title,desc", label: "Tên Z-A" },
        { value: "sellingPrice,asc", label: "Giá thấp → cao" },
        { value: "sellingPrice,desc", label: "Giá cao → thấp" },
        { value: "yearOfPublication,desc", label: "Năm XB mới" },
    ];

    const handleCategoryToggle = (categoryName: string) => {
        setFilters({
            ...filters,
            categories: filters.categories.includes(categoryName)
                ? filters.categories.filter((name) => name !== categoryName)
                : [...filters.categories, categoryName],
        });
    };

    const handlePriceChange = (index: 0 | 1, value: number) => {
        setFilters({
            ...filters,
            priceRange: [
                index === 0 ? value : filters.priceRange[0],
                index === 1 ? value : filters.priceRange[1],
            ] as [number, number],
        });
    };

    const handleYearChange = (index: 0 | 1, value: number) => {
        setFilters({
            ...filters,
            yearRange: [
                index === 0 ? value : filters.yearRange[0],
                index === 1 ? value : filters.yearRange[1],
            ] as [number, number],
        });
    };

    const handleSortChange = (sortBy: string) => {
        setFilters({
            ...filters,
            sortBy,
        });
    };

    const handleApplyFilter = () => {
        onApplyFilter(filters);
    };

    const handleReset = () => {
        const resetFilters: FilterOptions = {
            categories: [],
            priceRange: [0, 5000000],
            yearRange: [1900, currentYear],
            status: [],
            sortBy: "createdAt,desc",
        };
        setFilters(resetFilters);
        onApplyFilter(resetFilters);
    };

    return (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border-2 border-blue-100 overflow-hidden sticky top-2 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 flex-shrink-0">
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <FaFilter className="text-lg" />
                        </div>
                        <h2 className="text-xl font-bold">Bộ Lọc</h2>
                    </div>
                    {onToggle && (
                        <button
                            onClick={onToggle}
                            className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 group"
                            title="Ẩn bộ lọc"
                        >
                            <FaChevronUp className="text-sm group-hover:translate-y-0.5 transition-transform" />
                        </button>
                    )}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-5 space-y-4 custom-scrollbar">
                {/* Danh mục */}
                <div className="border-b border-gray-200 pb-4">
                    <button
                        onClick={() => toggleSection("categories")}
                        className="w-full flex items-center justify-between mb-3 group"
                    >
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
                            📚 Danh mục
                        </h3>
                        {expandedSections.categories ? (
                            <FaChevronUp className="text-blue-600 text-xs group-hover:scale-110 transition-transform" />
                        ) : (
                            <FaChevronDown className="text-gray-400 text-xs group-hover:scale-110 transition-transform" />
                        )}
                    </button>
                    {expandedSections.categories && (
                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category}
                                    onClick={() =>
                                        handleCategoryToggle(category)
                                    }
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 text-center ${
                                        filters.categories.includes(category)
                                            ? "bg-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-300"
                                            : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 hover:shadow-md"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Khoảng giá */}
                <div className="border-b border-gray-200 pb-4">
                    <button
                        onClick={() => toggleSection("price")}
                        className="w-full flex items-center justify-between mb-3 group"
                    >
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-1 h-5 bg-amber-500 rounded-full"></span>
                            💰 Khoảng giá
                        </h3>
                        {expandedSections.price ? (
                            <FaChevronUp className="text-amber-500 text-xs group-hover:scale-110 transition-transform" />
                        ) : (
                            <FaChevronDown className="text-gray-400 text-xs group-hover:scale-110 transition-transform" />
                        )}
                    </button>
                    {expandedSections.price && (
                        <div className="space-y-3">
                            {/* Min Price Slider */}
                            <div>
                                <label className="text-xs text-gray-600 font-medium mb-1 block">
                                    Giá thấp nhất:{" "}
                                    {filters.priceRange[0].toLocaleString(
                                        "vi-VN"
                                    )}
                                    ₫
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="5000000"
                                    step="50000"
                                    value={filters.priceRange[0]}
                                    onChange={(e) => {
                                        handlePriceChange(
                                            0,
                                            parseInt(e.target.value)
                                        );
                                    }}
                                    className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider-thumb-amber"
                                    style={{
                                        background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${
                                            (filters.priceRange[0] / 5000000) *
                                            100
                                        }%, #fde68a ${
                                            (filters.priceRange[0] / 5000000) *
                                            100
                                        }%, #fde68a 100%)`,
                                    }}
                                />
                            </div>

                            {/* Max Price Slider */}
                            <div>
                                <label className="text-xs text-gray-600 font-medium mb-1 block">
                                    Giá cao nhất:{" "}
                                    {filters.priceRange[1].toLocaleString(
                                        "vi-VN"
                                    )}
                                    ₫
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="5000000"
                                    step="50000"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => {
                                        handlePriceChange(
                                            1,
                                            parseInt(e.target.value)
                                        );
                                    }}
                                    className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider-thumb-amber"
                                    style={{
                                        background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${
                                            (filters.priceRange[1] / 5000000) *
                                            100
                                        }%, #fde68a ${
                                            (filters.priceRange[1] / 5000000) *
                                            100
                                        }%, #fde68a 100%)`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Năm xuất bản */}
                <div className="border-b border-gray-200 pb-4">
                    <button
                        onClick={() => toggleSection("year")}
                        className="w-full flex items-center justify-between mb-3 group"
                    >
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                            📅 Năm xuất bản
                        </h3>
                        {expandedSections.year ? (
                            <FaChevronUp className="text-purple-500 text-xs group-hover:scale-110 transition-transform" />
                        ) : (
                            <FaChevronDown className="text-gray-400 text-xs group-hover:scale-110 transition-transform" />
                        )}
                    </button>
                    {expandedSections.year && (
                        <div className="space-y-3">
                            {/* Min Year Slider */}
                            <div>
                                <label className="text-xs text-gray-600 font-medium mb-1 block">
                                    Từ năm: {filters.yearRange[0]}
                                </label>
                                <input
                                    type="range"
                                    min="1900"
                                    max={currentYear}
                                    step="1"
                                    value={filters.yearRange[0]}
                                    onChange={(e) => {
                                        handleYearChange(
                                            0,
                                            parseInt(e.target.value)
                                        );
                                    }}
                                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider-thumb-purple"
                                    style={{
                                        background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${
                                            ((filters.yearRange[0] - 1900) /
                                                (currentYear - 1900)) *
                                            100
                                        }%, #e9d5ff ${
                                            ((filters.yearRange[0] - 1900) /
                                                (currentYear - 1900)) *
                                            100
                                        }%, #e9d5ff 100%)`,
                                    }}
                                />
                            </div>

                            {/* Max Year Slider */}
                            <div>
                                <label className="text-xs text-gray-600 font-medium mb-1 block">
                                    Đến năm: {filters.yearRange[1]}
                                </label>
                                <input
                                    type="range"
                                    min="1900"
                                    max={currentYear}
                                    step="1"
                                    value={filters.yearRange[1]}
                                    onChange={(e) => {
                                        handleYearChange(
                                            1,
                                            parseInt(e.target.value)
                                        );
                                    }}
                                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider-thumb-purple"
                                    style={{
                                        background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${
                                            ((filters.yearRange[1] - 1900) /
                                                (currentYear - 1900)) *
                                            100
                                        }%, #e9d5ff ${
                                            ((filters.yearRange[1] - 1900) /
                                                (currentYear - 1900)) *
                                            100
                                        }%, #e9d5ff 100%)`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Sắp xếp */}
                <div>
                    <button
                        onClick={() => toggleSection("sort")}
                        className="w-full flex items-center justify-between mb-3 group"
                    >
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-1 h-5 bg-rose-500 rounded-full"></span>
                            🔄 Sắp xếp
                        </h3>
                        {expandedSections.sort ? (
                            <FaChevronUp className="text-rose-500 text-xs group-hover:scale-110 transition-transform" />
                        ) : (
                            <FaChevronDown className="text-gray-400 text-xs group-hover:scale-110 transition-transform" />
                        )}
                    </button>
                    {expandedSections.sort && (
                        <div className="space-y-1.5">
                            {sortOptions.map((option) => (
                                <label
                                    key={option.value}
                                    className={`flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-lg transition-all duration-300 ${
                                        filters.sortBy === option.value
                                            ? "bg-rose-500 text-white shadow-md scale-105"
                                            : "bg-gray-100 hover:bg-rose-50 text-gray-700"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="sortBy"
                                        value={option.value}
                                        checked={
                                            filters.sortBy === option.value
                                        }
                                        onChange={(e) =>
                                            handleSortChange(e.target.value)
                                        }
                                        className="w-4 h-4 accent-rose-500"
                                    />
                                    <span className="text-xs font-medium">
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-blue-100 p-4 bg-gradient-to-r from-blue-50 to-blue-100 space-y-3 flex-shrink-0">
                <button
                    onClick={handleApplyFilter}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                >
                    <FaCheck className="text-sm" />
                    <span>Áp dụng lọc</span>
                </button>
                <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-blue-600 hover:text-white text-blue-600 font-bold py-3 rounded-xl transition-all duration-300 border-2 border-blue-600 hover:shadow-lg hover:scale-105"
                >
                    <FaRedo className="text-sm" />
                    <span>Đặt lại bộ lọc</span>
                </button>
            </div>
        </div>
    );
}
