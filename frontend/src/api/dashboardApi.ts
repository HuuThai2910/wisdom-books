import axiosClient from "./axiosClient";

const dashboardApi = {
    getStats: (startDate: string, endDate: string) => {
        return axiosClient.get("/dashboard/stats", {
            params: { startDate, endDate },
        });
    },
};

export default dashboardApi;
