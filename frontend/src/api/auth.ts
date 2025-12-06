import { ApiResponse } from "@/types";
import axiosClient from "./axiosClient";

interface RegisterParams {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

interface LoginParams {
    fullName: string;
    password: string;
    token?: string;
}

interface UserInfo{
    id: number;
    email: string;
    fullName: string;
    phone: string;
    avatar?: string;
    address?: {
        province: string;
        ward: string;
        address: string;
    };
    gender?: string;
    role?: number;
    userStatus?: string;
}

interface ResetPasswordParams {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
}

export const register = (registerForm: RegisterParams) => {
    return axiosClient.post<ApiResponse<RegisterParams>>("/auth/register", registerForm);
};

export const login = (loginForm: LoginParams) => {
    return axiosClient.post<ApiResponse<LoginParams>>("/auth/login", loginForm);
}

export const fetchtUser = (accessToken: string) => {
    return axiosClient.get<ApiResponse<UserInfo>>("/auth/me",{
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

interface VerifyOtpParams {
    email: string;
    otp: string;
}

export const sendOTP = (email: string) => {
    return axiosClient.post<ApiResponse<null>>("/auth/forgot-password", { email });
}

export const verifyOTP = (params: VerifyOtpParams) => {
    return axiosClient.post<ApiResponse<{ success: boolean; message: string }>>("/auth/verify-otp", params);
}

export const resetPassword = (resetPasswordForm: ResetPasswordParams) => {
    return axiosClient.post<ApiResponse<null>>("/auth/reset-password", resetPasswordForm);
}

export const logout = (accessToken: string) => {
    return axiosClient.post<ApiResponse<null>>("/auth/logout", null, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

interface RefreshTokenParams {
    refreshToken: string;
    username: string;
}

export const refreshAccessToken = (params: RefreshTokenParams) => {
    return axiosClient.post<ApiResponse<{ token: string; expiresIn: number }>>("/auth/refresh-token", params);
}
