import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import voucherApi from "../../api/voucherApi";
import { UseCheckoutReturn, Voucher, User } from "../../types";
import { RootState } from "../../app/store";

export const useCheckout = (): UseCheckoutReturn => {
    const checkoutItems = useSelector(
        (state: RootState) => state.checkout.checkoutItems
    );
    const [defaultAddress, setDefaultAddress] = useState<User | null>(null);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [selectedVoucher, setSelectedVoucher] = useState<number | null>(null);
    const [isVoucherModalOpen, setIsVoucherModalOpen] =
        useState<boolean>(false);

    // Fetch default address
    useEffect(() => {
        voucherApi
            .fetchUserCheckOut()
            .then((res) => setDefaultAddress(res.data.data))
            .catch((err) => console.error("Lỗi khi lấy user:", err));
    }, []);

    // Fetch vouchers when modal opens
    useEffect(() => {
        if (isVoucherModalOpen && vouchers.length === 0) {
            voucherApi
                .fetchUserVouchers()
                .then((res) => setVouchers(res.data.data))
                .catch((err) => console.error("Lỗi khi lấy voucher:", err));
        }
    }, [isVoucherModalOpen, vouchers.length]);

    // Calculate subtotal
    const subtotal = checkoutItems.reduce(
        (sum, item) => sum + item.book.price * item.quantity,
        0
    );

    // Calculate discount
    const selectedVoucherData = vouchers.find((v) => v.id === selectedVoucher);
    const discount = selectedVoucherData
        ? (subtotal * selectedVoucherData.discountValue) / 100
        : 0;

    // Calculate total
    const total = subtotal - discount;

    const handleSelectVoucher = (voucherId: number | null) => {
        setSelectedVoucher(voucherId);
    };

    const handleRemoveVoucher = () => {
        setSelectedVoucher(null);
    };

    const openVoucherModal = () => {
        setIsVoucherModalOpen(true);
    };

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
