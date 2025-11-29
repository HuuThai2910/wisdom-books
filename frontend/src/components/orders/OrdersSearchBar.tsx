import { Search, X} from "lucide-react";

interface OrdersSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
}

const OrdersSearchBar = ({
    value,
    onChange,
    onClear,
}: OrdersSearchBarProps) => {
    return (
        <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                type="text"
                className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Tìm kiếm theo mã đơn, ngày đặt (dd/mm/yyyy), trạng thái..."
            />
            {value && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    aria-label="Xóa tìm kiếm"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};

export default OrdersSearchBar;
