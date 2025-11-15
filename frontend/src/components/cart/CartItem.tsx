// src/components/cart/CartItem.tsx
import { formatCurrency } from "../../util/formatting";
import { X } from "lucide-react";
import { useAppDispatch } from "../../app/store";
import { removeItem } from "../../features/cart/cartSlice";
import { useCartItemQuantity } from "../../hooks/useCartItemQuantity";
import { useCartItemSelection } from "../../hooks/useCartItemSelection";
import CartItemQuantityControl from "./CartItemQuantityControl";
import { CartItemProps } from "../../types";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL as string;

export default function CartItem({ item }: CartItemProps) {
    const dispatch = useAppDispatch();
    const isOutOfStock = item.book.quantity === 0;

    const {
        localQuantity,
        handleIncrement,
        handleDecrement,
        handleInputChange,
        handleInputBlur,
        handleKeyPress,
    } = useCartItemQuantity(item);

    const { handleToggleSelect } = useCartItemSelection(item);

    const handleRemoveItem = (id: number) => {
        dispatch(removeItem(id));
    };

    return (
        <div
            className={`grid grid-cols-12 gap-4 px-6 py-6 items-center ${
                isOutOfStock ? "opacity-50" : ""
            }`}
        >
            {/* Checkbox */}
            <div className="col-span-4 flex items-center gap-4">
                <input
                    type="checkbox"
                    checked={item.selected || false}
                    onChange={handleToggleSelect}
                    disabled={isOutOfStock}
                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black shrink-0 disabled:cursor-not-allowed"
                />

                {/* Image */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl shrink-0 relative">
                    <img
                        src={`${IMAGE_BASE_URL}${item.book.image}`}
                        alt=""
                        className={isOutOfStock ? "opacity-50" : ""}
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                            <span className="text-white text-xs font-semibold">
                                Hết hàng
                            </span>
                        </div>
                    )}
                </div>

                <h3 className="font-medium text-gray-900 line-clamp-2">
                    {item.book.title}
                </h3>
            </div>

            {/* Unit Price */}
            <div className="col-span-2 text-center">
                <span className="text-gray-900 whitespace-nowrap">
                    {formatCurrency(item.book.price)}
                </span>
            </div>

            {/* Quantity Control */}
            <div className="col-span-3 flex items-center justify-center gap-2">
                <CartItemQuantityControl
                    localQuantity={localQuantity}
                    isOutOfStock={isOutOfStock}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyPress={handleKeyPress}
                />
            </div>

            {/* Total Price */}
            <div className="col-span-2 text-right">
                <span className="font-medium text-gray-900 whitespace-nowrap">
                    {formatCurrency(item.book.price * item.quantity)}
                </span>
            </div>

            {/* Remove Button */}
            <div className="col-span-1 flex justify-center relative z-50">
                <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer relative z-50"
                >
                    <X className="w-5 h-5 pointer-events-none" />
                </button>
            </div>
        </div>
    );
}
