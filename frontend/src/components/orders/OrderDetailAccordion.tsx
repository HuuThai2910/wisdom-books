import {
    Package,
    User,
    Phone,
    Mail,
    MapPin,
    NotepadText,
    CheckCircle,
} from "lucide-react";
import { Order } from "../../types";
import { formatCurrency } from "../../util/formatting";
import { S3_CONFIG } from './../../config/s3';

interface OrderDetailAccordionProps {
    order: Order;
    loading: boolean;
}

const OrderDetailAccordion = ({
    order,
    loading,
}: OrderDetailAccordionProps) => {
    if (loading) {
        return (
            <div className="border-t-2 border-slate-200/60 bg-linear-to-br from-slate-50/50 via-blue-50/30 to-cyan-50/40 animate-in slide-in-from-top duration-500">
                <div className="px-6 py-16 flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200"></div>
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-cyan-600 border-r-transparent border-b-transparent border-l-transparent absolute top-0"></div>
                    </div>
                    <p className="mt-4 text-sm text-slate-600 font-medium">
                        Đang tải chi tiết...
                    </p>
                </div>
            </div>
        );
    }

    const subtotal = order.orderItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    );
    const discount = subtotal - order.totalPrice;

    return (
        <div className="border-t-2 border-slate-200/60 bg-linear-to-br from-slate-50/50 via-blue-50/30 to-cyan-50/40 animate-in slide-in-from-top duration-500">
            <div className="px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Products Section */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300">
                            <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-slate-100">
                                <h3 className="text-base font-bold text-slate-800 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                                        <Package className="w-5 h-5 text-white" />
                                    </div>
                                    <span>Sản phẩm đã đặt</span>
                                </h3>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                    {order.orderItems.length} sản phẩm
                                </span>
                            </div>

                            <div className="space-y-3">
                                {order.orderItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group flex gap-4 p-4 bg-linear-to-r from-slate-50 to-blue-50/30 rounded-xl border border-slate-200/60 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="shrink-0">
                                            <img
                                                src={`${S3_CONFIG.BASE_URL}${item.book.image}`}
                                                alt={item.book.title}
                                                className="w-20 h-20 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mb-3">
                                                {item.book.title}
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs text-slate-500 font-medium">
                                                        Đơn giá:
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-900">
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="h-3 w-px bg-slate-300"></div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs text-slate-500 font-medium">
                                                        SL:
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-800">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right self-center shrink-0">
                                            <div className="text-xs text-slate-500 mb-1 font-medium">
                                                Thành tiền
                                            </div>
                                            <p className="text-lg font-black text-slate-900">
                                                {formatCurrency(
                                                    item.price * item.quantity
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Delivery Info & Total */}
                    <div className="space-y-4">
                        {/* Delivery Info */}
                        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-600" />
                                Thông tin giao hàng
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                        <p className="text-xs text-slate-500 font-medium">
                                            Người nhận
                                        </p>
                                    </div>
                                    <p className="text-sm text-slate-900 font-semibold pl-5">
                                        {order.receiverName}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                        <p className="text-xs text-slate-500 font-medium">
                                            Số điện thoại
                                        </p>
                                    </div>
                                    <p className="text-sm text-slate-900 font-semibold pl-5">
                                        {order.receiverPhone}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                        <p className="text-xs text-slate-500 font-medium">
                                            Email
                                        </p>
                                    </div>
                                    <p className="text-sm text-slate-900 font-semibold pl-5 break-all">
                                        {order.receiverEmail}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        <p className="text-xs text-slate-500 font-medium">
                                            Địa chỉ
                                        </p>
                                    </div>
                                    <p className="text-sm text-slate-900 font-semibold leading-relaxed pl-5">
                                        {order.receiverAddress}
                                    </p>
                                </div>

                                {order.note && (
                                    <>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <NotepadText className="w-3.5 h-3.5 text-slate-400" />
                                            <p className="text-xs text-slate-500 font-medium">
                                                Ghi chú
                                            </p>
                                        </div>
                                        <p className="text-sm text-slate-900 font-semibold leading-relaxed pl-5 line-clamp-2">
                                            {order.note}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Total Summary */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-slate-200/60 shadow-lg shadow-slate-200/50 transition-all duration-300">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-blue-100">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-blue-700">
                                        Tổng thanh toán
                                    </h3>
                                </div>

                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                                        <span className="text-sm text-slate-600 font-medium">
                                            Tạm tính
                                        </span>
                                        <span className="text-sm text-slate-900 font-bold">
                                            {formatCurrency(subtotal)}
                                        </span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                                            <span className="text-sm text-slate-600 font-medium">
                                                Giảm giá
                                            </span>
                                            <span className="text-sm text-slate-900 font-bold">
                                                -{formatCurrency(discount)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="mt-3 pt-3 border-t-2 border-dashed border-slate-200">
                                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                            <div>
                                                <div className="text-xs text-slate-500 font-semibold mb-1">
                                                    Tổng cộng
                                                </div>
                                                <div className="text-2xl font-black text-slate-900">
                                                    {formatCurrency(
                                                        order.totalPrice
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailAccordion;
