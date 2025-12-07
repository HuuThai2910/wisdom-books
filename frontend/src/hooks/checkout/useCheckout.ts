import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import voucherApi from "../../api/voucherApi";
import { UseCheckoutReturn, Voucher, User } from "../../types";
import { RootState } from "../../app/store";

/**
 * Custom hook quản lý logic checkout
 * Xử lý: lấy địa chỉ mặc định, quản lý voucher, tính toán giá tiền
 * @returns Các state và hàm xử lý cho checkout
 */
export const useCheckout = (): UseCheckoutReturn => {
    // Lấy danh sách sản phẩm checkout từ Redux store
    const checkoutItems = useSelector(
        (state: RootState) => state.checkout.checkoutItems
    );

    // State lưu thông tin địa chỉ mặc định của user
    const [defaultAddress, setDefaultAddress] = useState<User | null>(null);

    // State lưu danh sách voucher của user
    const [vouchers, setVouchers] = useState<Voucher[]>([]);

    // State lưu ID voucher đang được chọn
    const [selectedVoucher, setSelectedVoucher] = useState<number | null>(null);

    // State quản lý trạng thái mở/đóng modal chọn voucher
    const [isVoucherModalOpen, setIsVoucherModalOpen] =
        useState<boolean>(false);

    /**
     * Effect: Lấy thông tin địa chỉ mặc định của user khi component mount
     * Gọi API fetchUserCheckOut để lấy thông tin user và địa chỉ
     */
    useEffect(() => {
        voucherApi
            .fetchUserCheckOut()
            .then((res) => setDefaultAddress(res.data.data))
            .catch((err) => console.error("Lỗi khi lấy user:", err));
    }, []);

    /**
     * Effect: Lấy danh sách voucher khi modal voucher được mở lần đầu
     * Chỉ fetch 1 lần duy nhất (khi vouchers.length === 0)
     */
    useEffect(() => {
        if (isVoucherModalOpen && vouchers.length === 0) {
            voucherApi
                .fetchUserVouchers()
                .then((res) => setVouchers(res.data.data))
                .catch((err) => console.error("Lỗi khi lấy voucher:", err));
        }
    }, [isVoucherModalOpen, vouchers.length]);

    /**
     * Tính tổng tiền trước khi áp dụng voucher
     * Cộng tất cả (giá * số lượng) của từng sản phẩm
     */
    const subtotal = checkoutItems.reduce(
        (sum, item) => sum + item.book.price * item.quantity,
        0
    );

    /**
     * Tìm thông tin voucher đang được chọn từ danh sách vouchers
     * Tính số tiền được giảm dựa trên discountValue (phần trăm)
     */
    const selectedVoucherData = vouchers.find((v) => v.id === selectedVoucher);
    const discount = selectedVoucherData
        ? (subtotal * selectedVoucherData.discountValue) / 100
        : 0;

    /**
     * Tính tổng tiền sau khi áp dụng voucher
     * Tổng tiền = Tổng tiền ban đầu - Số tiền giảm giá
     */
    const total = subtotal - discount;

    /**
     * Hàm xử lý chọn voucher
     * @param voucherId - ID của voucher được chọn, null nếu bỏ chọn
     */
    const handleSelectVoucher = (voucherId: number | null) => {
        setSelectedVoucher(voucherId);
    };

    /**
     * Hàm xử lý bỏ chọn voucher
     * Set selectedVoucher về null
     */
    const handleRemoveVoucher = () => {
        setSelectedVoucher(null);
    };

    /**
     * Hàm mở modal chọn voucher
     */
    const openVoucherModal = () => {
        setIsVoucherModalOpen(true);
    };

    /**
     * Hàm đóng modal chọn voucher
     */
    const closeVoucherModal = () => {
        setIsVoucherModalOpen(false);
    };

    return {
        checkoutItems,
        defaultAddress,
        vouchers,
        selectedVoucher,
        selectedVoucherData,
        isVoucherModalOpen,
        subtotal,
        discount,
        total,
        handleSelectVoucher,
        handleRemoveVoucher,
        openVoucherModal,
        closeVoucherModal,
    };
};
