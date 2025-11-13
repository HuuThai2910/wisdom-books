import React, { useEffect, useState, useRef } from "react";
import { Minus, Plus, X, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../../components/cart/CartItem";
import {
    fetchCart,
    updateSelectAll,
    removeItem,
    clearCart,
    optimisticUpdateSelectAll,
} from "../../features/cart/cartSlice";
import OrderSummary from "../../components/cart/OrderSummary";

export default function CartPage() {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);
    const debounceTimerRef = useRef(null);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    
    const allSelected =
        cartItems.length > 0 && cartItems.every((item) => item.selected);

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

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-6 sm:px-8 lg:px-12 mx-auto">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-8">
                    <span className="text-gray-600">Trang chủ</span>
                    <span className="text-gray-400">›</span>
                    <span className="text-gray-900 font-medium">Giỏ hàng</span>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
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
                                {cartItems.map((item) => (
                                    <CartItem key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
}
