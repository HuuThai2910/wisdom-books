interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

interface UserTableRowProps {
  user: User;
  index: number;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserTableRow = ({ user, index, onView, onEdit, onDelete }: UserTableRowProps) => {
  const getRoleBadgeClass = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'Admin': 'bg-blue-50 text-[#0071e3] border-[#0071e3]',
      'Attendee': 'bg-purple-50 text-purple-600 border-purple-600',
      'Organizer': 'bg-green-50 text-green-600 border-green-600',
    };
    return roleMap[role] || 'bg-gray-50 text-gray-600 border-gray-600';
  };

  const getStatusClass = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'Active': 'bg-green-50 text-green-700 border-green-500',
      'Pending': 'bg-orange-50 text-orange-700 border-orange-500',
      'Banned': 'bg-red-50 text-red-700 border-red-500',
    };
    return statusMap[status] || 'bg-gray-50 text-gray-600 border-gray-500';
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-4 py-4 border-b border-gray-100">
        <input type="checkbox" className="w-[18px] h-[18px] cursor-pointer rounded" />
      </td>
      <td className="px-4 py-4 border-b border-gray-100 text-sm text-gray-900">{index + 1}</td>
      <td className="px-4 py-4 border-b border-gray-100">
        <strong className="text-sm text-gray-900">{user.name}</strong>
      </td>
      <td className="px-4 py-4 border-b border-gray-100 text-sm text-gray-900">{user.email}</td>
      <td className="px-4 py-4 border-b border-gray-100 text-sm text-gray-900">{user.phone}</td>
      <td className="px-4 py-4 border-b border-gray-100">
        <span className={`inline-block px-3 py-1 rounded-xl text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
          {user.role}
        </span>
      </td>
      <td className="px-4 py-4 border-b border-gray-100">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border ${getStatusClass(user.status)}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          {user.status}
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
