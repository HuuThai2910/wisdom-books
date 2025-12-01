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

export const fetchUsers=()=>{
    return axiosClient.get<ApiResponse<UsersResponse>>("/users");
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