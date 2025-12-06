import { useEffect, useRef } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import CartItemComponent from "../../components/cart/CartItem";
import {
    fetchCart,
    updateSelectAll,
    clearCart,
    optimisticUpdateSelectAll,
} from "../../features/cart/cartSlice";
import OrderSummary from "../../components/cart/OrderSummary";
import { useNavigate } from "react-router-dom";
import { setCheckoutItems } from "../../features/checkout/checkoutSlice";
import Breadcrumb from "../../components/common/Breadcrumb";
import type { CartItem } from "../../types";

export default function CartPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { cartItems } = useAppSelector((state) => state.cart);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const allSelected =
        cartItems.length > 0 &&
        cartItems.every((item: CartItem) => item.selected);

    const toggleSelectAll = () => {
        const newValue = !allSelected;
        dispatch(optimisticUpdateSelectAll(newValue));
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            dispatch(updateSelectAll(newValue));
        }, 300);
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleCheckoutPage = () => {
        dispatch(
            setCheckoutItems(
                cartItems.filter((item: CartItem) => item.selected)
            )
        );
        navigate("/checkout");
    };

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-30 px-6 sm:px-8 lg:px-20 mx-auto">
            <div className="max-w-7xl mx-auto">
                <Breadcrumb items={[{ label: "Giỏ hàng" }]} />

                <div className="grid lg:grid-cols-3 gap-8">
                    {cartItems.length === 0 ? (
                        // Empty State - Giỏ hàng trống
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                <div className="max-w-md mx-auto">
                                    {/* Icon */}
                                    <div className="mb-6 relative">
                                        <div className="w-32 h-32 mx-auto bg-linear-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
                                            <ShoppingBag
                                                className="w-16 h-16 text-blue-500"
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                        <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-2">
                                            <div
                                                className="w-8 h-8 bg-yellow-400 rounded-full animate-bounce"
                                                style={{
                                                    animationDelay: "0.1s",
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                        Chưa có sản phẩm nào trong giỏ hàng của
                                        bạn
                                    </h2>
                                    <p className="text-gray-500 mb-8 text-base">
                                        Hãy khám phá ngay hàng ngàn cuốn sách
                                        hay đang chờ bạn!
                                    </p>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => navigate("/books")}
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        <span>Mua sắm ngay</span>
                                    </button>

                                    {/* Decorative elements */}
                                    <div className="mt-10 flex items-center justify-center gap-8 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span>Miễn phí vận chuyển</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            <span>Đổi trả dễ dàng</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Cart có sản phẩm
                        <>
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg shadow-md">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-sm">
                                        <div className="col-span-4 flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={allSelected}
                                                onChange={toggleSelectAll}
                                                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                                            />
                                            <span>Tên sản phẩm</span>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            Đơn giá
                                        </div>
                                        <div className="col-span-3 text-center">
                                            Số lượng
                                        </div>
                                        <div className="col-span-2 text-right">
                                            Thành tiền
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <button
                                                onClick={handleClearCart}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                title="Xóa tất cả đã chọn"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Cart Items */}
                                    <div className="divide-y divide-gray-200">
                                        {cartItems.map((item: CartItem) => (
                                            <CartItemComponent
                                                key={item.id}
                                                item={item}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <OrderSummary onCheckout={handleCheckoutPage} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
