import axiosClient from "./axiosClient";

function ensureOffset(dateStr: string) {
    if (!dateStr) return dateStr;
    // If already contains 'Z' or '+' with timezone offset, return as-is
    if (dateStr.endsWith("Z") || /[+-]\d{2}:?\d{2}$/.test(dateStr)) return dateStr;
    // Append +07:00 by default (Asia/Ho_Chi_Minh)
    return `${dateStr}+07:00`;
}

const dashboardApi = {
    getStats: (startDate: string, endDate: string) => {
        const s = ensureOffset(startDate);
        const e = ensureOffset(endDate);
        return axiosClient.get("/dashboard/stats", {
            params: { startDate: s, endDate: e },
        });
    },
    getOverview: () => {
        return axiosClient.get("/dashboard/overview");
    },
    getMonthlyRevenue: (year: number) => {
        return axiosClient.get("/dashboard/monthly-revenue", {
            params: { year },
        });
    },
    getTopBooks: (startDate: string, endDate: string, limit: number = 10) => {
        const s = ensureOffset(startDate);
        const e = ensureOffset(endDate);
        return axiosClient.get("/dashboard/top-books", {
            params: { startDate: s, endDate: e, limit },
        });
    },
    getTopCategories: (startDate: string, endDate: string, limit: number = 10) => {
        const s = ensureOffset(startDate);
        const e = ensureOffset(endDate);
        return axiosClient.get("/dashboard/top-categories", {
            params: { startDate: s, endDate: e, limit },
        });
    },
    getCategoryBooks: (categoryId: number, startDate: string, endDate: string) => {
        const s = ensureOffset(startDate);
        const e = ensureOffset(endDate);
        return axiosClient.get(`/dashboard/category-books/${categoryId}`, {
            params: { startDate: s, endDate: e },
        });
    },
};

export default dashboardApi;
