import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const axiosClient: AxiosInstance = axios.create({
    baseURL: "http://18.141.4.147:8080/api",
    withCredentials:true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
});

// axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//     const token = localStorage.getItem("token");
//     if (token && config.headers) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// axiosClient.interceptors.response.use(
//     (res) => res,
//     (err) => Promise.reject(err.response?.data || err.message)
// );

export default axiosClient;
