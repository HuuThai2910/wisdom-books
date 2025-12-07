// src/components/cart/CartItemQuantityControl.tsx
import { Minus, Plus } from "lucide-react";

interface CartItemQuantityControlProps {
    localQuantity: string | number;
    isOutOfStock: boolean;
    maxQuantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function CartItemQuantityControl({
    localQuantity,
    isOutOfStock,
    maxQuantity,
    onIncrement,
    onDecrement,
    onChange,
    onBlur,
    onKeyPress,
}: CartItemQuantityControlProps) {
    return (
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
                onClick={onDecrement}
                disabled={
                    (typeof localQuantity === "number"
                        ? localQuantity
                        : parseInt(localQuantity as string) || 0) <= 1 ||
                    isOutOfStock
                }
                className={`w-8 h-8 flex items-center justify-center transition-colors ${
                    (typeof localQuantity === "number"
                        ? localQuantity
                        : parseInt(localQuantity as string) || 0) <= 1 ||
                    isOutOfStock
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
                disabled={
                    isOutOfStock ||
                    (typeof localQuantity === "number"
                        ? localQuantity
                        : parseInt(localQuantity as string) || 0) >= maxQuantity
                }
                className={`w-8 h-8 flex items-center justify-center transition-colors ${
                    isOutOfStock ||
                    (typeof localQuantity === "number"
                        ? localQuantity
                        : parseInt(localQuantity as string) || 0) >= maxQuantity
                        ? "bg-gray-100 cursor-not-allowed opacity-50"
                        : "hover:bg-gray-200 cursor-pointer"
                }`}
            >
                <Plus className="w-4 h-4 text-gray-600" />
            </button>
        </div>
    );
}
