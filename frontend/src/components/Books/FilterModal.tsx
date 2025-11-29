import { useState } from "react";
import { FaFilter, FaRedo } from "react-icons/fa";

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

    const statusOptions = [
        { value: "AVAILABLE", label: "Còn hàng" },
        { value: "SALE", label: "Đang giảm giá" },
        { value: "OUT_OF_STOCK", label: "Hết hàng" },
    ];

    const sortOptions = [
        { value: "createdAt,desc", label: "Mới nhất" },
        { value: "title,asc", label: "Tên A-Z" },
        { value: "title,desc", label: "Tên Z-A" },
        { value: "sellingPrice,asc", label: "Giá thấp → cao" },
        { value: "sellingPrice,desc", label: "Giá cao → thấp" },
        { value: "yearOfPublication,desc", label: "Năm XB mới" },
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

    const handleStatusToggle = (status: string) => {
        const newFilters = {
            ...filters,
            status: filters.status.includes(status)
                ? filters.status.filter((s) => s !== status)
                : [...filters.status, status],
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
        <div className="w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden sticky top-24 max-h-[calc(100vh-7rem)]">
            {/* Header */}
            <div className="bg-blue-600 p-6">
                <div className="flex items-center gap-3 text-white">
                    <FaFilter className="text-2xl" />
                    <h2 className="text-2xl font-bold">Bộ lọc</h2>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(100vh-16rem)] p-6 space-y-6">
                {/* Danh mục */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                        Danh mục
                    </h3>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryToggle(category)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    filters.categories.includes(category)
                                        ? "bg-blue-500 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Trạng thái */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                        Trạng thái
                    </h3>
                    <div className="space-y-2">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleStatusToggle(option.value)}
                                className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                                    filters.status.includes(option.value)
                                        ? "bg-emerald-500 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Khoảng giá */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
                        Khoảng giá
                    </h3>
                    <div className="space-y-3">
                        <div className="flex flex-col gap-2">
                            <input
                                type="number"
                                value={filters.priceRange[0]}
                                onChange={(e) =>
                                    handlePriceChange(
                                        0,
                                        parseInt(e.target.value) || 0
                                    )
                                }
                                onBlur={() => onApplyFilter(filters)}
                                className="w-full bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="Từ (₫)"
                            />
                            <input
                                type="number"
                                value={filters.priceRange[1]}
                                onChange={(e) =>
                                    handlePriceChange(
                                        1,
                                        parseInt(e.target.value) || 0
                                    )
                                }
                                onBlur={() => onApplyFilter(filters)}
                                className="w-full bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="Đến (₫)"
                            />
                        </div>
                        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                            <p className="text-xs font-semibold text-gray-700 text-center">
                                {filters.priceRange[0].toLocaleString("vi-VN")}₫
                                -{" "}
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
                    <div className="space-y-3">
                        <div className="flex flex-col gap-2">
                            <input
                                type="number"
                                value={filters.yearRange[0]}
                                onChange={(e) =>
                                    handleYearChange(
                                        0,
                                        parseInt(e.target.value) || 1900
                                    )
                                }
                                onBlur={() => onApplyFilter(filters)}
                                min={1900}
                                max={currentYear}
                                className="w-full bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="Từ năm"
                            />
                            <input
                                type="number"
                                value={filters.yearRange[1]}
                                onChange={(e) =>
                                    handleYearChange(
                                        1,
                                        parseInt(e.target.value) || currentYear
                                    )
                                }
                                onBlur={() => onApplyFilter(filters)}
                                min={1900}
                                max={currentYear}
                                className="w-full bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="Đến năm"
                            />
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                            <p className="text-xs font-semibold text-gray-700 text-center">
                                {filters.yearRange[0]} - {filters.yearRange[1]}
                            </p>
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
                                className={`flex items-center gap-3 cursor-pointer px-4 py-2.5 rounded-lg transition-all ${
                                    filters.sortBy === option.value
                                        ? "bg-rose-500 text-white shadow-md"
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
                                            ? "text-white"
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
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl transition-all border border-gray-300 hover:shadow-md"
                >
                    <FaRedo className="text-sm" />
                    <span>Đặt lại bộ lọc</span>
                </button>
            </div>
        </div>
    );
}
