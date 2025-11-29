import { useState } from "react";
import { FaFilter, FaRedo, FaShoppingCart } from "react-icons/fa";

interface FilterModalProps {
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
}: FilterModalProps) {
    const [filters, setFilters] = useState<FilterOptions>(currentFilters);
    const [showCategories, setShowCategories] = useState(true);
    const MAX_PRICE = 5000000;

    const sortOptions = [
        { value: "createdAt,desc", label: "Mới nhất" },
        { value: "title,asc", label: "Tên A-Z" },
        { value: "title,desc", label: "Tên Z-A" },
        { value: "sellingPrice,asc", label: "Giá thấp → cao" },
        { value: "sellingPrice,desc", label: "Giá cao → thấp" },
    ];

    const handleCategoryToggle = (categoryName: string) => {
        const newFilters = {
            ...filters,
            categories: filters.categories.includes(categoryName)
                ? filters.categories.filter((name) => name !== categoryName)
                : [...filters.categories, categoryName],
        };
        setFilters(newFilters);
        onApplyFilter(newFilters);
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
    };

    const handleSortChange = (sortBy: string) => {
        const newFilters = {
            ...filters,
            sortBy,
        };
        setFilters(newFilters);
        onApplyFilter(newFilters);
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
        onApplyFilter(resetFilters);
    };

    return (
        <div className="w-70 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden sticky top-24 max-h-[calc(100vh-7rem)]">
            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(100vh-16rem)] p-6 space-y-6">
                {/* Danh mục */}
                <div>
                    {/* Header + Toggle Button */}
                    <button
                        onClick={() => setShowCategories(!showCategories)}
                        className="w-full flex items-center justify-between mb-3"
                    >
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                            Danh mục
                        </h3>

                        {/* Mũi tên xoay */}
                        <svg
                            className={`w-4 h-4 text-gray-600 transform transition-transform ${
                                showCategories ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {/* Nội dung collapse */}
                    <div
                        className={`transition-all duration-300 overflow-hidden ${
                            showCategories
                                ? "max-h-[650px] opacity-100"
                                : "max-h-0 opacity-0"
                        }`}
                    >
                        <div className="grid grid-cols-2 gap-2 pr-2">
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category}
                                    onClick={() =>
                                        handleCategoryToggle(category)
                                    }
                                    className={`w-full px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-normal leading-tight
                ${
                    filters.categories.includes(category)
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
            `}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* KHOẢNG GIÁ */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
                        Khoảng giá (₫)
                    </h3>

                    <div className="space-y-4">
                        {/* Slider Container */}
                        <div className="relative h-12 mt-6">
                            {/* Background Track */}
                            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full -translate-y-1/2"></div>

                            {/* Selected Range */}
                            <div
                                className="absolute h-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full -translate-y-1/2"
                                style={{
                                    top: "50%",
                                    left: `${
                                        (filters.priceRange[0] / MAX_PRICE) *
                                        100
                                    }%`,
                                    right: `${
                                        100 -
                                        (filters.priceRange[1] / MAX_PRICE) *
                                            100
                                    }%`,
                                }}
                            ></div>

                            {/* MIN Slider */}
                            <input
                                type="range"
                                min={0}
                                max={MAX_PRICE}
                                step={10000}
                                value={filters.priceRange[0]}
                                onChange={(e) =>
                                    handlePriceChange(0, +e.target.value)
                                }
                                onMouseUp={() => onApplyFilter(filters)}
                                className="range-input pointer-events-auto"
                            />

                            {/* MAX Slider */}
                            <input
                                type="range"
                                min={0}
                                max={MAX_PRICE}
                                step={10000}
                                value={filters.priceRange[1]}
                                onChange={(e) =>
                                    handlePriceChange(1, +e.target.value)
                                }
                                onMouseUp={() => onApplyFilter(filters)}
                                className="range-input pointer-events-auto"
                            />

                            {/* Tooltip MIN */}
                            <div
                                className="absolute -top-6 text-xs font-semibold bg-amber-500 text-white px-2 py-1 rounded-md shadow pointer-events-none"
                                style={{
                                    left: `calc(${Math.min(
                                        95,
                                        Math.max(
                                            5,
                                            (filters.priceRange[0] /
                                                MAX_PRICE) *
                                                100
                                        )
                                    )}% )`,
                                    transform: "translateX(-50%)",
                                }}
                            >
                                {filters.priceRange[0].toLocaleString("vi-VN")}₫
                            </div>

                            <div
                                className="absolute -top-6 text-xs font-semibold bg-amber-500 text-white px-2 py-1 rounded-md shadow pointer-events-none"
                                style={{
                                    left: `calc(${Math.min(
                                        95,
                                        Math.max(
                                            5,
                                            (filters.priceRange[1] /
                                                MAX_PRICE) *
                                                100
                                        )
                                    )}% )`,
                                    transform: "translateX(-50%)",
                                }}
                            >
                                {filters.priceRange[1].toLocaleString("vi-VN")}₫
                            </div>
                        </div>

                        {/* Display selected range */}
                        <div className="bg-amber-50 rounded-full p-3 border border-amber-200 text-center">
                            <p className="text-sm font-semibold text-gray-700">
                                {filters.priceRange[0].toLocaleString("vi-VN")}₫
                                –{" "}
                                {filters.priceRange[1].toLocaleString("vi-VN")}₫
                            </p>
                        </div>
                    </div>
                </div>

                {/* Năm xuất bản */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                        Năm xuất bản
                    </h3>

                    <div className="space-y-4">
                        {/* Slider container */}
                        <div className="relative h-12 mt-6">
                            {/* Track */}
                            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full -translate-y-1/2"></div>

                            {/* Selected range highlight */}
                            <div
                                className="absolute h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full -translate-y-1/2"
                                style={{
                                    top: "50%",
                                    left: `${
                                        ((filters.yearRange[0] - 1900) /
                                            (currentYear - 1900)) *
                                        100
                                    }%`,
                                    right: `${
                                        100 -
                                        ((filters.yearRange[1] - 1900) /
                                            (currentYear - 1900)) *
                                            100
                                    }%`,
                                }}
                            ></div>

                            {/* Min slider */}
                            <input
                                type="range"
                                min={1900}
                                max={currentYear}
                                value={filters.yearRange[0]}
                                onChange={(e) =>
                                    handleYearChange(
                                        0,
                                        parseInt(e.target.value)
                                    )
                                }
                                onMouseUp={() => onApplyFilter(filters)}
                                className="range-input pointer-events-auto"
                            />

                            {/* Max slider */}
                            <input
                                type="range"
                                min={1900}
                                max={currentYear}
                                value={filters.yearRange[1]}
                                onChange={(e) =>
                                    handleYearChange(
                                        1,
                                        parseInt(e.target.value)
                                    )
                                }
                                onMouseUp={() => onApplyFilter(filters)}
                                className="range-input pointer-events-auto"
                            />

                            {/* Tooltip Min */}
                            <div
                                className="absolute -top-6 text-xs font-semibold bg-purple-600 text-white px-2 py-1 rounded-md shadow transition-all pointer-events-none"
                                style={{
                                    left: `calc(${
                                        ((filters.yearRange[0] - 1900) /
                                            (currentYear - 1900)) *
                                        100
                                    }% - 20px)`,
                                }}
                            >
                                {filters.yearRange[0]}
                            </div>

                            {/* Tooltip Max */}
                            <div
                                className="absolute -top-6 text-xs font-semibold bg-purple-600 text-white px-2 py-1 rounded-md shadow transition-all pointer-events-none"
                                style={{
                                    left: `calc(${
                                        ((filters.yearRange[1] - 1900) /
                                            (currentYear - 1900)) *
                                        100
                                    }% - 20px)`,
                                }}
                            >
                                {filters.yearRange[1]}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sắp xếp */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <span className="w-1 h-4 bg-rose-500 rounded-full"></span>
                        Sắp xếp
                    </h3>
                    <div className="space-y-2">
                        {sortOptions.map((option) => (
                            <label
                                key={option.value}
                                className={`flex items-center gap-3 cursor-pointer px-4 py-2.5 rounded-lg transition-all rounded-xl ${
                                    filters.sortBy === option.value
                                        ? " text-red-500 shadow-md"
                                        : "bg-gray-100 hover:bg-gray-200"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="sortBy"
                                    value={option.value}
                                    checked={filters.sortBy === option.value}
                                    onChange={(e) =>
                                        handleSortChange(e.target.value)
                                    }
                                    className="w-4 h-4 accent-rose-500"
                                />
                                <span
                                    className={`text-sm font-medium ${
                                        filters.sortBy === option.value
                                            ? "text-red-500"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
                <button
                    onClick={handleReset}
                    className=" w-full 
                            bg-white 
                            text-red-600 
                            border border-red-600
                            font-semibold 
                            py-3 px-6 
                            rounded-full 
                            flex items-center justify-center gap-2 
                            transition-all duration-300 
                            shadow-sm
                            hover:shadow-lg hover:shadow-blue-300/40
                            disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaRedo className="text-sm" />
                    <span>Đặt lại bộ lọc</span>
                </button>
            </div>
            <style>
                {`

                    /* Remove default */
                    .range-input {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 100%;
                        background: transparent;
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        pointer-events: none; /* allow both thumbs overlap */
                    }

                    /* Track (invisible, real UI track made by divs) */
                    .range-input::-webkit-slider-runnable-track {
                        height: 2px;
                    }

                    /* Thumb */
                    .range-input::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;

                        height: 20px;
                        width: 20px;

                        background: #f59e0b;
                        border-radius: 50%;

                        border: 3px solid white;
                        outline: none;

                        box-shadow: 0 0 6px rgba(0, 0, 0, 0.35);

                        cursor: pointer;
                        pointer-events: auto;

                        /* ⭐ FIX CHÍNH: cân thumb vào giữa track */
                        position: relative;
                        margin-top: -9px; 
                        transition: transform 0.15s ease, box-shadow 0.15s ease;
                    }


                    /* Hover + Active */
                    .range-input::-webkit-slider-thumb:hover {
                        transform: scale(1.15);
                        box-shadow: 0 0 10px rgba(245, 158, 11, 0.65);
                    }

                    .range-input::-webkit-slider-thumb:active {
                        transform: scale(1.25);
                        background: #d97706;
                    }

                    /* Firefox support */
                    .range-input::-moz-range-thumb {
                        height: 18px;
                        width: 18px;
                        background: #f59e0b;
                        border-radius: 50%;
                        border: 3px solid white;
                        cursor: pointer;
                    }

                    `}
            </style>
        </div>
    );
}
