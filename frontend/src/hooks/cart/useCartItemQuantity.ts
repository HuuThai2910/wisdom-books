/**
 * Custom hook quản lý số lượng của một item trong giỏ hàng
 * Xử lý: tăng/giảm số lượng, nhập số lượng, debounce cập nhật lên server
 * @param item - Item giỏ hàng cần quản lý
 * @returns Các hàm và state để quản lý số lượng
 */
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

    // State lưu số lượng local (cập nhật ngay lập tức trên UI)
    const [localQuantity, setLocalQuantity] = useState<number | string>(
        item.quantity
    );

    // Ref lưu timer cho debounce (tránh gọi API quá nhiều lần)
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Ref lưu số lượng đã lưu lên server gần nhất
    const lastSavedQuantityRef = useRef(item.quantity);

    /**
     * Effect: Đồng bộ localQuantity với item.quantity từ Redux
     * Khi item.quantity thay đổi từ nguồn khác (VD: cập nhật từ server), cập nhật lại UI
     */
    useEffect(() => {
        setLocalQuantity(item.quantity);
    }, [item.quantity]);

    /**
     * Effect: Cleanup debounce timer khi component unmount
     * Tránh memory leak và gọi API sau khi component đã unmount
     */
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    /**
     * Hàm cập nhật số lượng lên server với debounce
     * @param newQuantity - Số lượng mới
     *
     * Logic:
     * - Chờ 400ms sau lần thay đổi cuối cùng mới gọi API
     * - Tránh gọi API quá nhiều lần khi user thay đổi nhanh
     * - Chỉ gọi nếu số lượng thực sự thay đổi (khác với lastSaved)
     */
    const updateServerQuantity = (newQuantity: number) => {
        // Xóa timer cũ nếu có
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Tạo timer mới với delay 400ms
        debounceTimerRef.current = setTimeout(() => {
            const validQuantity = Number(newQuantity);
            // Chỉ dispatch nếu số lượng thực sự thay đổi
            if (validQuantity !== lastSavedQuantityRef.current) {
                dispatch(updateItem({ id: item.id, quantity: validQuantity }));
                lastSavedQuantityRef.current = validQuantity;
            }
        }, 400);
    };

    /**
     * Hàm xử lý tăng số lượng
     * Logic:
     * 1. Lấy số lượng hiện tại (xử lý cả string và number)
     * 2. Tăng lên 1
     * 3. Kiểm tra không vượt quá số lượng còn trong kho
     * 4. Cập nhật optimistic (UI ngay lập tức)
     * 5. Cập nhật lên server (với debounce)
     */
    const handleIncrement = () => {
        // Chuyển đổi sang number để tính toán
        const currentQuantity =
            typeof localQuantity === "string"
                ? parseInt(localQuantity) || 0
                : localQuantity;
        const newQuantity = currentQuantity + 1;

        // Kiểm tra không vượt quá số lượng tồn kho
        if (newQuantity > (item.book.quantity || 0)) {
            toast.error(
                `Đã vượt quá số lượng tối đa của sách (${item.book.quantity})`
            );
            return;
        }

        // Cập nhật optimistic (UI cập nhật ngay)
        dispatch(
            optimisticUpdateQuantity({ id: item.id, quantity: newQuantity })
        );

        // Cập nhật lên server (với debounce)
        updateServerQuantity(newQuantity);
    };

    /**
     * Hàm xử lý giảm số lượng
     * Logic:
     * 1. Lấy số lượng hiện tại
     * 2. Chỉ giảm nếu số lượng > 1 (không cho phép giảm xuống 0)
     * 3. Cập nhật optimistic và lên server
     */
    const handleDecrement = () => {
        // Chuyển đổi sang number
        const currentQuantity =
            typeof localQuantity === "string"
                ? parseInt(localQuantity) || 0
                : localQuantity;

        // Chỉ giảm nếu số lượng > 1
        if (currentQuantity > 1) {
            const newQuantity = currentQuantity - 1;

            // Cập nhật optimistic
            dispatch(
                optimisticUpdateQuantity({ id: item.id, quantity: newQuantity })
            );

            // Cập nhật lên server
            updateServerQuantity(newQuantity);
        }
    };

    /**
     * Hàm xử lý khi user nhập số lượng vào ô input
     * @param e - Event thay đổi input
     *
     * Chỉ cho phép nhập chuỗi rỗng hoặc số hợp lệ
     * Cập nhật localQuantity ngay lập tức để hiển thị trên UI
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Chỉ cho phép chuỗi rỗng hoặc số hợp lệ
        if (value === "" || !isNaN(Number(value))) {
            setLocalQuantity(value);
        }
    };

    /**
     * Hàm xử lý khi user blur ra khỏi ô input
     * Validate số lượng và cập nhật lên server nếu hợp lệ
     *
     * Validate:
     * 1. Phải là số nguyên dương (>= 1)
     * 2. Không vượt quá số lượng tồn kho
     *
     * Nếu không hợp lệ -> hiển thông báo lỗi và reset về giá trị cũ
     */
    const handleInputBlur = () => {
        const quantity = Number(localQuantity);

        // Validate: phải là số nguyên >= 1
        if (!Number.isInteger(quantity) || quantity < 1) {
            toast.error("Vui lòng nhập số lượng hợp lệ");
            setLocalQuantity(item.quantity);
            return;
        }

        // Validate: không vượt quá số lượng tồn kho
        if (quantity > (item.book.quantity || 0)) {
            toast.error(
                `Đã vượt quá số lượng tối đa của sách (${item.book.quantity})`
            );
            setLocalQuantity(item.quantity);
            return;
        }

        // Nếu hợp lệ, cập nhật
        setLocalQuantity(quantity);
        dispatch(optimisticUpdateQuantity({ id: item.id, quantity: quantity }));
        updateServerQuantity(quantity);
    };

    /**
     * Hàm xử lý khi user nhấn phím trong ô input
     * @param e - Keyboard event
     *
     * Chỉ cho phép nhập:
     * - Số từ 0-9
     * - Phím điều hướng: Backspace, Delete, Arrow Left/Right, Tab
     * Chặn tất cả ký tự khác (chữ cái, ký tự đặc biệt...)
     */
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

    // Return tất cả state và handlers
    return {
        localQuantity, // Số lượng hiện tại (hiển thị trên UI)
        handleIncrement, // Hàm tăng số lượng
        handleDecrement, // Hàm giảm số lượng
        handleInputChange, // Hàm xử lý khi nhập số lượng
        handleInputBlur, // Hàm xử lý khi blur khỏi input
        handleKeyPress, // Hàm xử lý khi nhấn phím
    };
}
