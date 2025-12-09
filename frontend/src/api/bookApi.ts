import axiosClient from "./axiosClient";
import { ApiResponse, Book, PaginatedResponse } from "../types";

interface GetAllBooksParams {
    page?: number;
    size?: number;
    sort?: string;
    filter?: string; // Spring Filter query string
}

const bookApi = {
    // Get all books with pagination and filters
    getAllBooks: async (
        params?: GetAllBooksParams
    ): Promise<ApiResponse<PaginatedResponse<Book>>> => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined)
            queryParams.append("page", params.page.toString());
        if (params?.size !== undefined)
            queryParams.append("size", params.size.toString());
        if (params?.sort) queryParams.append("sort", params.sort);
        if (params?.filter) queryParams.append("filter", params.filter);

        const url = `/books${queryParams.toString() ? "?" + queryParams.toString() : ""
            }`;
        const response = await axiosClient.get<
            ApiResponse<PaginatedResponse<Book>>
        >(url);
        return response.data;
    },

    // Get book by ID
    getBookById: async (id: number | string): Promise<ApiResponse<Book>> => {
        const response = await axiosClient.get<ApiResponse<Book>>(
            `/books/${id}`
        );
        return response.data;
    },

    // Create new book
    createBook: async (bookData: Partial<Book>): Promise<ApiResponse<Book>> => {
        const response = await axiosClient.post<ApiResponse<Book>>(
            `/books`,
            bookData
        );
        return response.data;
    },

    // Update book
    updateBook: async (
        id: number | string,
        bookData: Partial<Book>
    ): Promise<ApiResponse<Book>> => {
        console.log("Updating book with ID:", id, "Data:", bookData);
        const response = await axiosClient.put<ApiResponse<Book>>(`/books`, {
            ...bookData,
            id,
        });
        return response.data;
    },

    // Delete book
    deleteBook: async (id: number | string): Promise<ApiResponse<void>> => {
        const response = await axiosClient.delete<ApiResponse<void>>(
            `/books/${id}`
        );
        return response.data;
    },

    // Upload images for book
    uploadBookImages: async (
        bookId: number | string,
        images: File[]
    ): Promise<ApiResponse<string[]>> => {
        const formData = new FormData();
        images.forEach((image) => {
            formData.append("images", image);
        });

        const response = await axiosClient.post<ApiResponse<string[]>>(
            `/books/${bookId}/images`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    },

    // Submit review for a book
    submitReview: async (bookId: number, reviewData: {
        rating: number;
        comment: string;
    }): Promise<ApiResponse<any>> => {
        const response = await axiosClient.post<ApiResponse<any>>(
            `/books/${bookId}/reviews`,
            reviewData
        );
        return response.data;
    },

    // Update existing review
    updateReview: async (bookId: number, reviewData: {
        rating: number;
        comment: string;
    }): Promise<ApiResponse<any>> => {
        const response = await axiosClient.put<ApiResponse<any>>(
            `/books/${bookId}/reviews`,
            reviewData
        );
        return response.data;
    },

    // Delete user's review
    deleteReview: async (bookId: number): Promise<ApiResponse<void>> => {
        const response = await axiosClient.delete<ApiResponse<void>>(
            `/books/${bookId}/reviews`
        );
        return response.data;
    },
};

export default bookApi;
