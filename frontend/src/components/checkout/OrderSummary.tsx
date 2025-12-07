import { formatCurrency } from "../../util/formatting";
import { OrderSummaryProps } from "../../types";
import { S3_CONFIG } from "../../config/s3";


const OrderSummary: React.FC<OrderSummaryProps> = ({
    checkoutItems,
    subtotal,
    discount,
    total,
    onSubmit,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-6">Sản phẩm</h2>

            <div className="space-y-4 mb-6">
                {checkoutItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center space-x-3 pb-8 border-b"
                    >
                        <div className="w-16 h-16 rounded-lg flex items-center">
                            <img
                                src={`${S3_CONFIG.BASE_URL}${item.book.image}`}
                                alt={item.book.title}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium line-clamp-2">
                                {item.book.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                × {item.quantity}
                            </p>
                        </div>
                        <div className="text-sm font-medium whitespace-nowrap">
                            {formatCurrency(item.book.price * item.quantity)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span>Tạm tính</span>
                    <span className="font-medium">
                        {formatCurrency(subtotal)}
                    </span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-sm text-blue-600">
                        <span>Giảm giá</span>
                        <span className="font-medium">
                            -{formatCurrency(discount)}
                        </span>
                    </div>
                )}
                <div className="flex justify-between text-sm pt-3 border-t">
                    <span>Tổng</span>
                    <span className="font-semibold text-lg">
                        {formatCurrency(total)}
                    </span>
                </div>
            </div>

            <div className="text-xs text-gray-500 mb-4">
                Giá trên đã bao gồm phí vận chuyển
            </div>

            <button
                onClick={onSubmit}
                className="w-full bg-blue-700 text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
                Đặt hàng
            </button>
        </div>
    );
};

export default OrderSummary;
