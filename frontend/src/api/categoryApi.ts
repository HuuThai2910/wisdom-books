import axiosClient from "./axiosClient";

/**
 * Category API endpoints
 */
const categoryApi = {
    /**
     * Get all categories
     * @returns Promise with categories data
     */
    getAllCategories: async () => {
        const url = "/categories";
        return axiosClient.get(url);
    },

    /**
     * Get category by ID
     * @param id - Category ID
     * @returns Promise with category data
     */
    getCategoryById: async (id: number) => {
        const url = `/categories/${id}`;
        return axiosClient.get(url);
    },
};

export default categoryApi;
