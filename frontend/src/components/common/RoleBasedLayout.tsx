import { ReactNode, useEffect, useState } from 'react';
import AdminLayout from '../../pages/admin/AdminLayout';
import StaffLayout from '../../pages/staff/StaffLayout';
import WarehouseLayout from '../../pages/warehouse/WarehouseLayout';

interface RoleBasedLayoutProps {
    children: ReactNode;
}

const RoleBasedLayout = ({ children }: RoleBasedLayoutProps) => {
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserRole(user.role?.toString() || '');
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    // Admin role
    if (userRole === '1' || userRole === 'ADMIN') {
        return <AdminLayout>{children}</AdminLayout>;
    }

    // Staff role
    if (userRole === '2' || userRole === 'STAFF') {
        return <StaffLayout>{children}</StaffLayout>;
    }

    // Warehouse staff role
    if (userRole === '4' || userRole === 'WARE_HOUSE_STAFF') {
        return <WarehouseLayout>{children}</WarehouseLayout>;
    }

    // Default to AdminLayout
    return <AdminLayout>{children}</AdminLayout>;
};

export default RoleBasedLayout;
