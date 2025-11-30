// Component header cột có thể sắp xếp trong bảng đơn hàng
// Hiển thị mũi tên chỉ hướng sắp xếp (tăng/giảm)
// Tuân thủ SRP: chỉ đảm nhiệm hiển thị header và xử lý click để thay đổi sort

import { ChevronsUpDown, ChevronUp, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";

interface OrderTableHeaderProps {
    // Tên hiển thị của cột
    label: string;
    // Tên field dùng để sort (gửi lên backend)
    sortField: string;
    // Field đang được sort hiện tại
    currentSortField: string | null;
    // Hướng sort hiện tại: 'asc' (tăng dần) hoặc 'desc' (giảm dần)
    currentSortDirection: "asc" | "desc";
    // Callback khi click vào header để thay đổi sort
    onSort: (field: string) => void;
    // Căn chỉnh text (mặc định left)
    align?: "left" | "center" | "right";
}

export default function OrderTableHeader({
    label,
    sortField,
    currentSortField,
    currentSortDirection,
    onSort,
    align = "left",
}: OrderTableHeaderProps) {
    // Kiểm tra cột này có đang được sort không
    const isActive = currentSortField === sortField;

    // Xác định icon hiển thị dựa vào trạng thái sort
    const SortIcon = isActive
        ? currentSortDirection === "asc"
            ? ChevronUp
            : ChevronDown
        : ChevronsUpDown;

    // Căn chỉnh text class
    const alignClass =
        align === "center"
            ? "text-center"
            : align === "right"
            ? "text-right"
            : "text-left";

    return (
        <th
            className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${alignClass} cursor-pointer hover:bg-gray-100 transition-colors select-none`}
            onClick={() => onSort(sortField)}
        >
            <div
                className={`flex items-center gap-2 ${
                    align === "center"
                        ? "justify-center"
                        : align === "right"
                        ? "justify-end"
                        : "justify-start"
                }`}
            >
                <span>{label}</span>
                <SortIcon
                    className={`h-4 w-4 ${
                        isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                />
            </div>
        </th>
    );
}
