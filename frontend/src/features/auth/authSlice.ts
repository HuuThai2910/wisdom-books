import { RegisterFormData } from './../../types/index';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchtUser, login, register, resetPassword, sendOTP } from "../../api/auth";
// Thunk đăng ký user
export const registerUser = createAsyncThunk<
    any,                               
    { registerForm: RegisterFormData },
    { rejectValue: string }            
>(
    "auth/register",
    async ({ registerForm }, thunkAPI) => {
        try {
            const response = await register(registerForm);
            return response.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);
export const loginUser = createAsyncThunk<
    any,
    { loginForm: any },
    { rejectValue: string }
>(
    "auth/login", 
    async ({ loginForm }, thunkAPI) => {
        try {
            const response = await login(loginForm);
            return response.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const fetchCurrentUser = createAsyncThunk<
    any,
    { accessToken: string },
    { rejectValue: string }
>(
    "auth/login", 
    async ({ accessToken }, thunkAPI) => {
        try {
            const response = await fetchtUser(accessToken);
            console.log(response.data);
            return response.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const sendOTPEmail = createAsyncThunk<
    any,
    { email: string },
    { rejectValue: string }
>(
    "auth/forgot-password", 
    async ({ email }, thunkAPI) => {
        try {
            const response = await sendOTP(email);
            return response.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const verifiedOTPAndChangePassword = createAsyncThunk<
    any,
    { email: string, otp: string, newPassword: string, confirmPassword: string },
    { rejectValue: string }
>(
    "auth/reset-password", 
    async ({ email, otp, newPassword, confirmPassword }, thunkAPI) => {
        try {
            const response = await resetPassword({ email, otp, newPassword, confirmPassword });
            return response.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);


// Kiểu trạng thái
interface AuthState {
    user: any | null;
    loading: boolean;
    error: string | null;
    token?: string | null;
    message: null,

}

// State ban đầu
const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    message: null,
};

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state,action) => {
                state.loading = false;
                state.user = action.payload; // Giả sử đăng ký không trả về user
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                // action.payload luôn là string hoặc fallback
                state.error = action.payload || "Đăng ký thất bại";
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.data.token;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Đăng nhập thất bại";
            })
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
                state.error = null;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Lấy thông tin user thất bại";
            })
            .addCase(sendOTPEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendOTPEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(sendOTPEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Gửi email OTP thất bại";
            });
    },
});

export default authSlice.reducer;
