import axiosClient from "./axiosClient";
import { ApiResponse, UserData } from '@/types';

export interface Address {
    address: string;
    ward: string;
    province: string;
}

export interface UserParams{
    fullName:string;
    email:string;
    phone:string;
    gender:string;
    address: Address;
    role:{
        id:string;
    };
    userStatus:string;
    password:string;
    confirmPassword:string;
    avatarURL?:string;
    avatarFile?: File;
}

export interface UpdateUserParams{
    fullName:string;
    phone:string;
    gender:string;
    email:string;
    address: Address;
    role:string;
    status:string;
    avatarURL?:string;
}

export interface RoleDetail {
    id: number;
    name: string;
    description?: string;
}

export interface UserDetailResponse {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    address: Address;
    role: number;
    userStatus: string;
    avatarURL?: string;
}

export interface UsersResponse {
    users: UserData[];
}

export interface UserQueryParams {
    keyword?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    role?: string;
    status?: string;
}

export const fetchUsers=(params?: UserQueryParams)=>{
    const queryParams = new URLSearchParams();
    if (params?.keyword) queryParams.append('keyword', params.keyword);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    return axiosClient.get<ApiResponse<UsersResponse>>(`/users${queryString ? '?' + queryString : ''}`);
}

export const createUser=(data:UserParams)=>{
    return axiosClient.post<ApiResponse<null>>("/users",data);
}

export const updateUser=(id:string,data:UpdateUserParams)=>{
    return axiosClient.put<ApiResponse<null>>(`/users/${id}`,data);
}

export const getUserById=(id:string)=>{
    return axiosClient.get<ApiResponse<UserDetailResponse>>(`/users/${id}`);
}

export const deleteUser=(id:string)=>{
    return axiosClient.delete<ApiResponse<string>>(`/users/delete/${id}`);
}

export const uploadAvatar=(file: File)=>{
    const formData = new FormData();
    formData.append('avatar', file);
    return axiosClient.post<ApiResponse<string>>('/users/avatar/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const getAvatarUrl=(filename: string)=>{
    return axiosClient.get<ApiResponse<string>>(`/users/avatar/${filename}`);
}