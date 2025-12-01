import { UserData } from '@/types';
import { getS3Url } from '../../config/s3';

interface UserTableRowProps {
  user: UserData;
  index: number;
  onView: (user: UserData) => void;
  onEdit: (user: UserData) => void;
  onDelete: (user: UserData) => void;
  isSelected: boolean;
  onSelectChange: (userId: number, checked: boolean) => void;
}

const UserTableRow = ({ user, index, onView, onEdit, onDelete, isSelected, onSelectChange }: UserTableRowProps) => {
  const avatarUrl = getS3Url(user.avatar);

  const getRoleText = (role: any): string => {
    if (!role) return 'N/A';
    if (typeof role === 'object' && role !== null) {
      return role.roleName || role.name || 'N/A';
    }
    return String(role);
  };

  const getRoleBadgeClass = (role: any) => {
    const roleText = getRoleText(role).toLowerCase();
    const roleMap: { [key: string]: string } = {
      'admin': 'bg-blue-50 text-[#0071e3] border-[#0071e3]',
      'customer': 'bg-purple-50 text-purple-600 border-purple-600',
      'employee': 'bg-green-50 text-green-600 border-green-600',
      'khách hàng': 'bg-purple-50 text-purple-600 border-purple-600',
      'nhân viên': 'bg-green-50 text-green-600 border-green-600',
      'thủ kho': 'bg-yellow-50 text-yellow-600 border-yellow-600',
    };
    return roleMap[roleText] || 'bg-gray-50 text-gray-600 border-gray-600';
  };

  const getStatusClass = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'ACTIVE': 'bg-green-50 text-green-700 border-green-500',
      'INACTIVE': 'bg-orange-50 text-orange-700 border-orange-500',
      'BANNED': 'bg-red-50 text-red-700 border-red-500',
    };
    return statusMap[status] || 'bg-gray-50 text-gray-600 border-gray-500';
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'ACTIVE': 'Hoạt động',
      'INACTIVE': 'Không hoạt động',
      'BANNED': 'Bị cấm',
    };
    return statusMap[status] || status;
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-4 py-4 border-b border-gray-100">
        <input 
          type="checkbox" 
          className="w-[18px] h-[18px] cursor-pointer rounded" 
          checked={isSelected}
          onChange={(e) => onSelectChange(Number(user.id), e.target.checked)}
        />
      </td>
      <td className="px-4 py-4 border-b border-gray-100 text-sm text-gray-900">{index + 1}</td>
      <td className="px-4 py-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-xl">👤</span>';
              }}
            />
          ) : (
            <span className="text-xl">👤</span>
          )}
        </div>
      </td>
      <td className="px-4 py-4 border-b border-gray-100">
        <strong className="text-sm text-gray-900">{user.fullName}</strong>
      </td>
      <td className="px-4 py-4 border-b border-gray-100 text-sm text-gray-900">{user.email}</td>
      <td className="px-4 py-4 border-b border-gray-100 text-sm text-gray-900">{user.phone}</td>
      <td className="px-4 py-4 border-b border-gray-100">
        <span className={`inline-block px-3 py-1 rounded-xl text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
          {getRoleText(user.role)}
        </span>
      </td>
      <td className="px-4 py-4 border-b border-gray-100">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border ${getStatusClass(user.userStatus)}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          {getStatusText(user.userStatus)}
        </span>
      </td>
      <td className="px-4 py-4 border-b border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={() => onView(user)}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg 
              transition-all duration-300 text-green-600 hover:bg-green-50 
              hover:-translate-y-0.5 hover:shadow-md"
            title="Xem"
          >
            👁️
          </button>
          <button
            onClick={() => onEdit(user)}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg 
              transition-all duration-300 text-[#0071e3] hover:bg-blue-50 
              hover:-translate-y-0.5 hover:shadow-md"
            title="Sửa"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(user)}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg 
              transition-all duration-300 text-red-600 hover:bg-red-50 
              hover:-translate-y-0.5 hover:shadow-md"
            title="Xóa"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
