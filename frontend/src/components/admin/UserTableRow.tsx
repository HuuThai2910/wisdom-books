import { UserData } from "@/types";
import { getS3Url } from "../../config/s3";

interface UserTableRowProps {
  user: UserData;
  index: number;
  onView: (user: UserData) => void;
  onEdit: (user: UserData) => void;
  onDelete: (user: UserData) => void;
  isSelected: boolean;
  onSelectChange: (userId: number, checked: boolean) => void;
}

const UserTableRow = ({
  user,
  index,
  onView,
  onEdit,
  onDelete,
  isSelected,
  onSelectChange,
}: UserTableRowProps) => {
  const avatarUrl = getS3Url(user.avatar);

  const getRoleText = (role: any): string => {
    if (!role) return "N/A";
    if (typeof role === "object" && role !== null) {
      return role.roleName || role.name || "N/A";
    }
    return String(role);
  };

  const getRoleBadgeClass = (role: any) => {
    const roleText = getRoleText(role).toLowerCase();
    const roleMap: { [key: string]: string } = {
      admin: "bg-blue-50 text-[#0071e3] border-[#0071e3]",
      customer: "bg-yellow-50 text-yellow-600 border-yellow-600",
      employee: "bg-green-50 text-green-600 border-green-600",
      warehouse: "bg-purple-50 text-purple-600 border-purple-600",
    };
    return roleMap[roleText] || "bg-gray-50 text-gray-600 border-gray-600";
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
      <td className="px-4 py-4 border-b border-gray-100 text-sm text-gray-900">
        {index + 1}
      </td>
      <td className="px-4 py-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.innerHTML =
                  '<span class="text-xl">👤</span>';
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
      <td className="px-4 py-4 border-b border-gray-100 text-sm text-gray-900">
        {user.email}
      </td>
      <td className="px-4 py-4 border-b border-gray-100 text-sm text-gray-900">
        {user.phone}
      </td>
      <td className="px-4 py-4 border-b border-gray-100">
        <span
          className={`inline-block px-3 py-1 rounded-xl text-xs font-medium border ${getRoleBadgeClass(
            user.role
          )}`}
        >
          {getRoleText(user.role)}
        </span>
      </td>

      <td className="px-4 py-4 border-b border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={() => onView(user)}
            className="w-8 h-8 inline-flex items-center justify-center 
              transition-all duration-200 text-blue-600 hover:text-blue-700"
            title="Xem"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          <button
            onClick={() => onEdit(user)}
            className="w-8 h-8 inline-flex items-center justify-center 
              transition-all duration-200 text-yellow-600 hover:text-blue-700"
            title="Sửa"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(user)}
            className="w-8 h-8 inline-flex items-center justify-center 
              transition-all duration-200 text-red-600 hover:text-blue-700"
            title="Xóa"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
