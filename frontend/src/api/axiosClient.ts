import axios, { AxiosInstance } from "axios";

const axiosClient: AxiosInstance = axios.create({
    baseURL: "/api",
    // baseURL: "http://localhost:8080/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request interceptor - log để debug
axiosClient.interceptors.request.use((config) => {
    
    // Check specifically for id_token cookie
    const cookies = document.cookie.split(';').map(c => c.trim());
    const idToken = cookies.find(c => c.startsWith('id_token='));
    console.log('[axiosClient] id_token cookie:', idToken ? 'EXISTS (length: ' + idToken.length + ')' : 'NOT FOUND');
    console.log('[axiosClient] ========== REQUEST END ==========');
    
    return config;
});

// Response interceptor - xử lý lỗi 401/403
axiosClient.interceptors.response.use(
    (res) => res,
    async (err) => {
        console.log('[axiosClient] Error:', err.response?.status, err.config?.url);
        console.log('[axiosClient] Error data:', err.response?.data);
        
        const currentPath = window.location.pathname;
        const errorData = err.response?.data;
        
        // Kiểm tra nếu là lỗi tài khoản bị vô hiệu hóa (401 hoặc 403)
        if (errorData?.error === 'ACCOUNT_DISABLED') {
            console.log('[axiosClient] Account disabled detected, redirecting to /account-disabled...');
            
            // Ngăn redirect lặp lại
            if (currentPath !== '/account-disabled') {
                window.location.href = '/account-disabled';
            }
            
            return Promise.reject(errorData);
        }
        
        // Xử lý lỗi 401 (Unauthorized) khác
        if (err.response?.status === 401) {
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
