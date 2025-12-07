// src/hooks/useCartItemSelection.js
import { useRef, useEffect } from "react";
import { useAppDispatch } from "../../app/store";
import {
    updateSelections,
    optimisticUpdateSelection,
} from "../../features/cart/cartSlice";
import { CartItem } from "../../types";

export function useCartItemSelection(item: CartItem) {
    const dispatch = useAppDispatch();
    const selectDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Effect: Tự động bỏ chọn sản phẩm khi hết hàng
     *
     * Logic:
     * - Khi sản phẩm hết hàng (quantity = 0) và đang được chọn
     * - Tự động deselect (bỏ chọn) sản phẩm đó
     * - Cập nhật optimistic (UI ngay lập tức) và lên server
     *
     * Use case:
     * - User đã chọn sản phẩm, sau đó sản phẩm bị người khác mua hết
     * - Hoặc admin cập nhật số lượng = 0
     * → Tự động bỏ chọn để tránh lỗi khi checkout
     */
    useEffect(() => {
        if (item.book.quantity === 0 && item.selected) {
            // Cập nhật hiển thị ngay lập tức cho UI
            dispatch(
                optimisticUpdateSelection({ id: item.id, selected: false })
            );
            // Sau đó mới cập nhật cho server
            dispatch(
                updateSelections({
                    selections: [{ id: item.id, selected: false }],
                })
            );
        }
    }, [item.book.quantity, item.selected, item.id, dispatch]);

    useEffect(() => {
        return () => {
            if (selectDebounceTimerRef.current) {
                clearTimeout(selectDebounceTimerRef.current);
            }
        };
    }, []);

    // Hàm check chọn sản phẩm
    const handleToggleSelect = () => {
        const newSelected = !item.selected;
        dispatch(
            optimisticUpdateSelection({ id: item.id, selected: newSelected })
        );

        if (selectDebounceTimerRef.current) {
            clearTimeout(selectDebounceTimerRef.current);
        }

        selectDebounceTimerRef.current = setTimeout(() => {
            dispatch(
                updateSelections({
                    selections: [{ id: item.id, selected: newSelected }],
                })
            );
        }, 300);
    };

    return { handleToggleSelect };
}
