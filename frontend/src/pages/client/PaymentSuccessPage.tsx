import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, Clock, Lightbulb } from "lucide-react";
import paymentApi from "../../api/paymentApi";
import { formatCurrency } from "../../util/formatting";
import toast from "react-hot-toast";

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState<{
        orderCode: string;
        totalPrice: number;
        orderDate: string;
    } | null>(null);

    useEffect(() => {
        let isMounted = true;

        const confirmPayment = async () => {
            try {
                // Check if COD payment
                const isCOD = searchParams.get("cod") === "true";

                if (isCOD) {
                    // COD payment - get order info from URL params
                    const orderCode = searchParams.get("orderCode") || "Đã tạo";
                    const totalPrice = parseFloat(
                        searchParams.get("totalPrice") || "0"
                    );
                    const orderDate =
                        searchParams.get("orderDate") ||
                        new Date().toISOString();

                    setOrderData({
                        orderCode,
                        totalPrice,
                        orderDate,
                    });
                    setLoading(false);
                    return;
                }

                // VNPAY payment - verify with backend
                const params: Record<string, string> = {};
                searchParams.forEach((value, key) => {
                    params[key] = value;
                });

                const response = await paymentApi.vnpayReturn(params);
                const data = response.data.data;

                if (!isMounted) return;

                // Check response code
                if (data.code === "00") {
                    // Payment success
                    setOrderData({
                        orderCode: data.orderCode,
                        totalPrice: data.totalPrice,
                        orderDate: data.orderDate,
                    });
                } else {
                    // Payment failed - redirect to orders page
                    toast.error(data.message || "Thanh toán không thành công");
                    navigate("/orders", { replace: true });
                }
            } catch (error: any) {
                if (!isMounted) return;
                toast.error("Có lỗi xảy ra khi xác nhận thanh toán");
                navigate("/orders", { replace: true });
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        confirmPayment();

        return () => {
            isMounted = false;
        };
    }, [searchParams, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-slate-600 font-medium">
                        Đang xác nhận thanh toán...
                    </p>
                </div>
            </div>
        );
    }

    if (!orderData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 py-30 px-4">
            <div className="max-w-xl mx-auto">
                {/* Success Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Header with Icon */}
                    <div className="px-8 py-12 text-center border-b border-slate-100">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50-50 rounded-full mb-2">
                            <CheckCircle
                                className="w-11 h-11 text-blue-600"
                                strokeWidth={2}
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">
                            Đặt hàng thành công
                        </h1>
                        <p className="text-slate-500 text-sm max-w-md mx-auto">
                            Cảm ơn bạn đã tin tưởng. Chúng tôi sẽ giao sách đến
                            tay bạn sớm nhất
                        </p>
                    </div>

                    {/* Order Details */}
                    <div className="p-8">
                        {/* Order Info */}
                        <div className="space-y-6 mb-8">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">
                                        Mã đơn sách
                                    </p>
                                    <p className="text-xl font-bold text-slate-900">
                                        {orderData.orderCode}
                                    </p>
                                </div>
                                {orderData.totalPrice > 0 && (
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">
                                            Tổng tiền
                                        </p>
                                        <p className="text-xl font-bold text-blue-600">
                                            {formatCurrency(
                                                orderData.totalPrice
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">
                                            Ngày đặt
                                        </p>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {new Date(
                                                orderData.orderDate
                                            ).toLocaleDateString("vi-VN")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                        <Package className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">
                                            Trạng thái
                                        </p>
                                        <p className="text-sm font-semibold text-slate-900">
                                            Chờ xác nhận
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Notice */}
                        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Thông tin đơn sách đã được gửi đến email của
                                bạn. Bạn có thể theo dõi tình trạng đơn sách qua
                                email hoặc kiểm tra trong phần đơn hàng.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate("/orders")}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                <Package className="w-4 h-4" />
                                Xem đơn hàng
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="flex-1 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Tiếp tục mua
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
