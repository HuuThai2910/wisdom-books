import axiosClient from "./axiosClient";

const dashboardApi = {
    getStats: (startDate: string, endDate: string) => {
        return axiosClient.get("/dashboard/stats", {
            params: { startDate, endDate },
        });
    },
    getMonthlyRevenue: (year: number) => {
        return axiosClient.get("/dashboard/monthly-revenue", {
            params: { year },
        });
    },
    getTopBooks: (startDate: string, endDate: string, limit: number = 10) => {
        return axiosClient.get("/dashboard/top-books", {
            params: { startDate, endDate, limit },
        });
    },
    getTopCategories: (startDate: string, endDate: string, limit: number = 10) => {
        return axiosClient.get("/dashboard/top-categories", {
            params: { startDate, endDate, limit },
        });
    },
};

export default dashboardApi;
