import axiosClient from "./axiosClient";
import { ApiResponse, Voucher, User } from "../types";

const voucherApi = {
    fetchUserVouchers: () =>
        axiosClient.get<ApiResponse<Voucher[]>>("/vouchers/user"),
    fetchUserCheckOut: () =>
        axiosClient.get<ApiResponse<User>>("/vouchers/user/me"),
    removeVoucherFromUser: (voucherId: number) =>
        axiosClient.delete<ApiResponse<void>>(`/vouchers/${voucherId}/me`),
};

export default voucherApi;
