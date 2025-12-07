import { useSelector } from "react-redux";
import { selectTotals } from "../../features/cart/cartSlice";
import { formatCurrency } from "../../util/formatting";
import { useNavigate } from "react-router-dom";

interface OrderSummaryProps {
    onCheckout: () => void;
}

export default function OrderSummary({ onCheckout }: OrderSummaryProps) {
    const { totalQuantity, totalPrice } = useSelector(selectTotals);
    const navigate = useNavigate();

    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-8 shadow-md">
                <h2 className="text-2xl font-bold mb-6">Tóm tắt đơn hàng</h2>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                        <span>Tổng số lượng</span>
                        <span className="text-gray-900">
                            {totalQuantity} sản phẩm
                        </span>
                    </div>
                </div>

                <div className="border-t pt-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-semibold">Tổng tiền</span>
                        <span className="text-2xl font-bold whitespace-nowrap">
                            {formatCurrency(totalPrice)}
                        </span>
                    </div>

                    <button
                        className="w-full py-3 border border-blue-600 rounded-full text-blue-600 font-medium hover:bg-blue-700 hover:text-white transition-colors mb-3 shadow-sm"
                        onClick={() => navigate("/books")}
                    >
                        Tiếp tục mua sắm
                    </button>

                    <button
                        disabled={totalQuantity === 0}
                        className={`w-full py-3 font-medium rounded-full transition-colors shadow-sm ${
                            totalQuantity === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-700 text-white hover:bg-blue-800"
                        }`}
                        onClick={onCheckout}
                    >
                        Tiến hành thanh toán
                    </button>
                </div>

                <p className="text-xs text-gray-600">
                    Phí vận chuyển và thuế sẽ được tính khi thanh toán.
                </p>
            </div>
        </div>
    );
}
