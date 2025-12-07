import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface RoleBasedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
    const userStr = localStorage.getItem('user');
    
    // Người dùng chưa đăng nhập -> redirect về trang 401
    if (!userStr) {
        return <Navigate to="/unauthorized" replace />;
    }

    try {
        const user = JSON.parse(userStr);
        const userRole = user.role?.toString();
        
        console.log('[RoleBasedRoute] User object:', user);
        console.log('[RoleBasedRoute] User role (raw):', user.role, 'type:', typeof user.role);
        console.log('[RoleBasedRoute] User role (string):', userRole);
        console.log('[RoleBasedRoute] Allowed roles:', allowedRoles);

        // CUSTOMER role (3) không được vào admin/staff/warehouse
        if (userRole === '3' || userRole === 'CUSTOMER' || userRole === 'customer') {
            return <Navigate to="/unauthorized" replace />;
        }

        // Normalize both user role and allowed roles for comparison
        // Support: '1', 1, 'ADMIN', 'admin', etc.
        const normalizeRole = (role: any): string[] => {
            const str = role.toString().trim();
            const upper = str.toUpperCase();
            return [str, upper, str.toLowerCase()];
        };

        const userRoleVariants = normalizeRole(userRole);
        const allowedRolesNormalized = allowedRoles.flatMap(r => normalizeRole(r));
        
        const hasAccess = userRoleVariants.some(variant => 
            allowedRolesNormalized.includes(variant)
        );

        console.log('[RoleBasedRoute] User role variants:', userRoleVariants);
        console.log('[RoleBasedRoute] Allowed roles normalized:', allowedRolesNormalized);
        console.log('[RoleBasedRoute] Has access:', hasAccess);

        // Không có quyền truy cập -> redirect về trang 401
        if (!hasAccess) {
            return <Navigate to="/unauthorized" replace />;
        }

        return <>{children}</>;
    } catch (error) {
        console.error('[RoleBasedRoute] Error parsing user data:', error);
        // Dữ liệu không hợp lệ -> redirect về trang 401
        return <Navigate to="/unauthorized" replace />;
    }
};

export default RoleBasedRoute;
