// src/hooks/useCartItemQuantity.js
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
    updateItem,
    optimisticUpdateQuantity,
} from "../features/cart/cartSlice";
import toast from "react-hot-toast";

export function useCartItemQuantity(item) {
    const dispatch = useDispatch();
    const [localQuantity, setLocalQuantity] = useState(item.quantity);
    const debounceTimerRef = useRef(null);
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

    const updateServerQuantity = (newQuantity) => {
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
        const newQuantity = localQuantity + 1;
        if (newQuantity > item.book.quantity) {
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
        if (localQuantity > 1) {
            const newQuantity = localQuantity - 1;
            dispatch(
                optimisticUpdateQuantity({ id: item.id, quantity: newQuantity })
            );
            updateServerQuantity(newQuantity);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setLocalQuantity(e.target.value);
    };

    const handleInputBlur = () => {
        const quantity = Number(localQuantity);

        if (!Number.isInteger(quantity) || quantity < 1) {
            toast.error("Vui lòng nhập số lượng hợp lệ");
            setLocalQuantity(item.quantity);
            return;
        }

        if (quantity > item.book.quantity) {
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

    const handleKeyPress = (e) => {
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
