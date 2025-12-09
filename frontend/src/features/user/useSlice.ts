import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUsers, createUser, UserParams, updateUser, UpdateUserParams, deleteUser, getUserById, UserQueryParams } from './../../api/userApi';
import { UserData } from "@/types";



export const fetchUsersDashboard=createAsyncThunk<
    any,
    UserQueryParams | undefined,
    { rejectValue: string }
>(
    "users", 
    async (params, thunkAPI) => {
        try {
            const response = await fetchUsers(params);
            return response.data.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateUserforAdmin=createAsyncThunk<
    any,
    {id:string; user:UpdateUserParams},
    { rejectValue: string }
>(
    "/users", 
    async ({id, user}, thunkAPI) => {
        try {
            const response = await updateUser(id, user);
            return response;
        } catch (err: any) {
            // Backend trả về {message, errors} - errors chứa error code (FULLNAME_EXISTS, EMAIL_EXISTS)
            // Trả về errors nếu có, không thì message
            return thunkAPI.rejectWithValue(err.errors || err.message || 'Có lỗi xảy ra');
        }
    }
);

export const createUserforAdmin=createAsyncThunk<
    any,
    {user:UserParams},
    { rejectValue: string }
>(
    "/users", 
    async ({user}, thunkAPI) => {
        try {
            const response = await createUser(user);
            return response;
        } catch (err: any) {
            // Backend trả về {message, errors} - errors chứa error code (FULLNAME_EXISTS, EMAIL_EXISTS)
            // Trả về errors nếu có, không thì message
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const getUserByIdForAdmin=createAsyncThunk<
    any,
    {id:string},
    { rejectValue: string }
>(
    "users/getUserById", 
    async ({id}, thunkAPI) => {
        try {
            const response = await getUserById(id);
            return response.data.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const deleteUserForAdmin=createAsyncThunk<
    any,
    {id:string},
    { rejectValue: string }
>(
    "users/deleteUser", 
    async ({id}, thunkAPI) => {
        try {
            const response = await deleteUser(id);
            return {id, message: response.data.data};
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);




interface UserState {
    users: UserData[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
};
// Slice

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsersDashboard.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsersDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                state.error = null;
            })
            .addCase(fetchUsersDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch users";
            })
            .addCase(createUserforAdmin.pending, (state) => {
                state.loading = true;
            })
            .addCase(createUserforAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
                state.error = null;
            })
            .addCase(createUserforAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create user";
            })
            .addCase(updateUserforAdmin.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserforAdmin.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateUserforAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update user";
            })
            .addCase(deleteUserForAdmin.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUserForAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter((user: any) => user.id !== action.payload.id);
                state.error = null;
            })
            .addCase(deleteUserForAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete user";
            });
    },
});

export default userSlice.reducer;
