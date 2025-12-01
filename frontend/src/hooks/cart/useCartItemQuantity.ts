// src/hooks/useCartItemQuantity.js
import { useState, useEffect, useRef } from "react";
import { useAppDispatch } from "../../app/store";
import {
    updateItem,
    optimisticUpdateQuantity,
} from "../../features/cart/cartSlice";
import toast from "react-hot-toast";
import { CartItem } from "../../types";

export function useCartItemQuantity(item: CartItem) {
    const dispatch = useAppDispatch();
    const [localQuantity, setLocalQuantity] = useState<number | string>(
        item.quantity
    );
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedQuantityRef = useRef(item.quantity);

    useEffect(() => {
        setLocalQuantity(item.quantity);
    }, [item.quantity]);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const updateServerQuantity = (newQuantity: number) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            const validQuantity = Number(newQuantity);
            if (validQuantity !== lastSavedQuantityRef.current) {
                dispatch(updateItem({ id: item.id, quantity: validQuantity }));
                lastSavedQuantityRef.current = validQuantity;
            }
        }, 400);
    };

    const handleIncrement = () => {
        const currentQuantity =
            typeof localQuantity === "string"
                ? parseInt(localQuantity) || 0
                : localQuantity;
        const newQuantity = currentQuantity + 1;
        if (newQuantity > (item.book.quantity || 0)) {
            toast.error(
                `Đã vượt quá số lượng tối đa của sách (${item.book.quantity})`
            );
            return;
        }
        dispatch(
            optimisticUpdateQuantity({ id: item.id, quantity: newQuantity })
        );
        updateServerQuantity(newQuantity);
    };

    const handleDecrement = () => {
        const currentQuantity =
            typeof localQuantity === "string"
                ? parseInt(localQuantity) || 0
                : localQuantity;
        if (currentQuantity > 1) {
            const newQuantity = currentQuantity - 1;
            dispatch(
                optimisticUpdateQuantity({ id: item.id, quantity: newQuantity })
            );
            updateServerQuantity(newQuantity);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow empty string or valid numbers
        if (value === "" || !isNaN(Number(value))) {
            setLocalQuantity(value);
        }
    };

    const handleInputBlur = () => {
        const quantity = Number(localQuantity);

        if (!Number.isInteger(quantity) || quantity < 1) {
            toast.error("Vui lòng nhập số lượng hợp lệ");
            setLocalQuantity(item.quantity);
            return;
        }

        if (quantity > (item.book.quantity || 0)) {
            toast.error(
                `Đã vượt quá số lượng tối đa của sách (${item.book.quantity})`
            );
            setLocalQuantity(item.quantity);
            return;
        }

        setLocalQuantity(quantity);
        dispatch(optimisticUpdateQuantity({ id: item.id, quantity: quantity }));
        updateServerQuantity(quantity);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            !/[0-9]/.test(e.key) &&
            e.key !== "Backspace" &&
            e.key !== "Delete" &&
            e.key !== "ArrowLeft" &&
            e.key !== "ArrowRight" &&
            e.key !== "Tab"
        ) {
            e.preventDefault();
        }
    };

    return {
        localQuantity,
        handleIncrement,
        handleDecrement,
        handleInputChange,
        handleInputBlur,
        handleKeyPress,
    };
}