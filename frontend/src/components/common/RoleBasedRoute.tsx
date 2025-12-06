import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface RoleBasedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
        toast.error('Vui lòng đăng nhập để tiếp tục');
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);
        const userRole = user.role?.toString();

        // CUSTOMER role (3) không được vào admin
        if (userRole === '3' || userRole === 'CUSTOMER') {
            toast.error('Bạn không có quyền truy cập trang này');
            return <Navigate to="/" replace />;
        }

        // Check if user's role is in allowed roles
        if (!allowedRoles.includes(userRole)) {
            toast.error('Bạn không có quyền truy cập trang này');
            
            // Redirect based on role
            if (userRole === '1' || userRole === 'ADMIN') {
                return <Navigate to="/admin/dashboard" replace />;
            } else if (userRole === '2' || userRole === 'STAFF') {
                return <Navigate to="/staff/dashboard" replace />;
            } else if (userRole === '4' || userRole === 'WARE_HOUSE_STAFF') {
                return <Navigate to="/warehouse/dashboard" replace />;
            }
            
            return <Navigate to="/" replace />;
        }

        return <>{children}</>;
    } catch (error) {
        console.error('Error parsing user data:', error);
        toast.error('Phiên đăng nhập không hợp lệ');
        return <Navigate to="/login" replace />;
    }
};

export default RoleBasedRoute;
