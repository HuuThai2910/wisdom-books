// src/components/cart/CartItemQuantityControl.jsx
import { Minus, Plus } from "lucide-react";

export default function CartItemQuantityControl({
    localQuantity,
    isOutOfStock,
    onIncrement,
    onDecrement,
    onChange,
    onBlur,
    onKeyPress
}) {
    return (
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
                onClick={onDecrement}
                disabled={localQuantity <= 1 || isOutOfStock}
                className={`w-8 h-8 flex items-center justify-center transition-colors ${
                    localQuantity <= 1 || isOutOfStock
                        ? "bg-gray-100 cursor-not-allowed opacity-50"
                        : "hover:bg-gray-200 cursor-pointer"
                }`}
            >
                <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <input
                type="text"
                value={localQuantity}
                onChange={onChange}
                onBlur={onBlur}
                onKeyDown={onKeyPress}
                disabled={isOutOfStock}
                className="w-12 text-center font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
                onClick={onIncrement}
                disabled={isOutOfStock}
                className={`w-8 h-8 flex items-center justify-center transition-colors ${
                    isOutOfStock
                        ? "bg-gray-100 cursor-not-allowed opacity-50"
                        : "hover:bg-gray-200 cursor-pointer"
                }`}
            >
                <Plus className="w-4 h-4 text-gray-600" />
            </button>
        </div>
    );
}