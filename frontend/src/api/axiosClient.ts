import axios, { AxiosInstance } from "axios";

const axiosClient: AxiosInstance = axios.create({
    // baseURL: "/api",
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request interceptor - log để debug
axiosClient.interceptors.request.use((config) => {
    console.log('[axiosClient] ========== REQUEST START ==========');
    console.log('[axiosClient] Method:', config.method?.toUpperCase());
    console.log('[axiosClient] URL:', config.url);
    console.log('[axiosClient] Full URL:', config.baseURL + config.url);
    console.log('[axiosClient] withCredentials:', config.withCredentials);
    console.log('[axiosClient] All cookies:', document.cookie);
    
    // Check specifically for id_token cookie
    const cookies = document.cookie.split(';').map(c => c.trim());
    const idToken = cookies.find(c => c.startsWith('id_token='));
    console.log('[axiosClient] id_token cookie:', idToken ? 'EXISTS (length: ' + idToken.length + ')' : 'NOT FOUND');
    console.log('[axiosClient] ========== REQUEST END ==========');
    
    return config;
});

// Response interceptor - xử lý lỗi 401 Unauthorized
axiosClient.interceptors.response.use(
    (res) => res,
    (err) => {
        console.log('[axiosClient] Error:', err.response?.status, err.config?.url);
        
        // Nếu lỗi 401 (Unauthorized) thì redirect đến trang unauthorized
        if (err.response?.status === 401) {
            const currentPath = window.location.pathname;
            
            // CHỈ redirect đến /unauthorized khi đang ở trang admin/staff/warehouse
            // Trang client (bán hàng) không redirect vì người dùng chưa đăng nhập vẫn xem được
            const isAdminRoute = currentPath.startsWith('/admin');
            const isStaffRoute = currentPath.startsWith('/staff');
            const isWarehouseRoute = currentPath.startsWith('/warehouse');
            
            if ((isAdminRoute || isStaffRoute || isWarehouseRoute) && 
                currentPath !== '/unauthorized') {
                console.log('[axiosClient] Redirecting to /unauthorized from:', currentPath);
                window.location.href = '/unauthorized';
            }
        }
        return Promise.reject(err.response?.data || err.message);
    }
);

export default axiosClient;
