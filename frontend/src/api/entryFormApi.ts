import axiosClient from "./axiosClient";
import { ApiResponse, PaginatedResponse } from "../types";

export interface EntryForm {
    id: number;
    totalQuantity: number;
    totalPrice: number;
    createdAt: string;
    createdBy: string;
}

export interface EntryFormDetail {
    id: number;
    isbn: string;
    title: string;
    yearOfPublication: number;
    quantity: number;
    unitPrice: number;
    amount: number;
}

export interface BookItemDTO {
    isbn: string;
    title: string;
    yearOfPublication: number;
    importPrice: number;
    quantity: number;
    amount: number;
}

export interface CreateEntryFormDTO {
    supplier: string;
    invoiceNumber: string;
    books: BookItemDTO[];
}

interface GetAllEntryFormsParams {
    page?: number;
    size?: number;
    sort?: string;
    filter?: string;
}

const entryFormApi = {
    getAllEntryForms: async (
        params?: GetAllEntryFormsParams
    ): Promise<ApiResponse<PaginatedResponse<EntryForm>>> => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined)
            queryParams.append("page", params.page.toString());
        if (params?.size !== undefined)
            queryParams.append("size", params.size.toString());
        if (params?.sort) queryParams.append("sort", params.sort);
        if (params?.filter) queryParams.append("filter", params.filter);

        const url = `/entry-forms${queryParams.toString() ? "?" + queryParams.toString() : ""
            }`;
        const response = await axiosClient.get<
            ApiResponse<PaginatedResponse<EntryForm>>
        >(url);
        return response.data;
    },

    getNextInvoiceNumber: async (): Promise<ApiResponse<number>> => {
        const response = await axiosClient.get<ApiResponse<number>>(
            "/entry-forms/next-invoice-number"
        );
        return response.data;
    },

    getTotalInventoryQuantity: async (): Promise<ApiResponse<number>> => {
        const response = await axiosClient.get<ApiResponse<number>>(
            "/entry-forms/total-inventory"
        );
        return response.data;
    },

    createEntryForm: async (
        data: CreateEntryFormDTO
    ): Promise<ApiResponse<EntryForm>> => {
        const response = await axiosClient.post<ApiResponse<EntryForm>>(
            "/entry-forms",
            data
        );
        return response.data;
    },

    getEntryFormDetails: async (
        id: number
    ): Promise<ApiResponse<EntryFormDetail[]>> => {
        const response = await axiosClient.get<ApiResponse<EntryFormDetail[]>>(
            `/entry-forms/${id}/details`
        );
        return response.data;
    },
};

export default entryFormApi;