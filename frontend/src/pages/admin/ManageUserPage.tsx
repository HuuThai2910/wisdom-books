import { useEffect, useState } from 'react';
import UserTableHeader from '../../components/admin/UserTableHeader';
import UserTableRow from '../../components/admin/UserTableRow';
import UserModal from '../../components/admin/UserModal';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { fetchUsersDashboard, deleteUserForAdmin, getUserByIdForAdmin } from '../../features/user/useSlice';
import { UserDetailResponse } from '@/api/userApi';
import { UserData } from '@/types';

const ManageUserPage = () => {
  const dispatch=useDispatch<AppDispatch>();
  const [searchValue, setSearchValue] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedUser, setSelectedUser] = useState<UserDetailResponse | undefined>();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  
  const loadUsers = () => {
    setLoading(true);
    dispatch(fetchUsersDashboard({
      keyword: searchValue || undefined,
      sortBy: sortBy || undefined,
      sortDirection: sortDirection || undefined,
      role: filterRole || undefined,
      status: filterStatus || undefined,
    })).unwrap()
      .then((response) => {
        console.log('Users response:', response);
        setUsers(response.users || []);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        alert('Lỗi khi tải danh sách người dùng!');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, [searchValue, filterRole, filterStatus, sortBy, sortDirection]);

  const handleAddUser = () => {
    setModalMode('add');
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserData) => {
    setLoadingUserDetail(true);
    dispatch(getUserByIdForAdmin({ id: String(user.id) }))
      .unwrap()
      .then((userDetail) => {
        console.log('Fetched user detail for edit:', userDetail);
        setSelectedUser(userDetail);
        setModalMode('edit');
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
        alert('Lỗi khi tải thông tin người dùng!');
      })
      .finally(() => {
        setLoadingUserDetail(false);
      });
  };

  const handleViewUser = (user: UserData) => {
    setLoadingUserDetail(true);
    dispatch(getUserByIdForAdmin({ id: String(user.id) }))
      .unwrap()
      .then((userDetail) => {
        console.log('User detail for view:', userDetail);
        setSelectedUser(userDetail);
        setModalMode('view');
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
        alert('Lỗi khi tải thông tin người dùng!');
      })
      .finally(() => {
        setLoadingUserDetail(false);
      });
  };

  const handleDeleteUser = (user: UserData) => {
    if (confirm(`Bạn có chắc muốn xóa người dùng "${user.fullName}"?\n\nHành động này không thể hoàn tác!`)) {
      dispatch(deleteUserForAdmin({ id: String(user.id) }))
        .unwrap()
        .then(() => {
          alert(`Đã xóa người dùng "${user.fullName}" thành công!`);
          loadUsers();
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
          alert('Lỗi khi xóa người dùng!');
        });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
    loadUsers();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(users.map(u => Number(u.id)));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUserIds([...selectedUserIds, userId]);
    } else {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    }
  };

  const handleExportToExcel = async () => {
    if (selectedUserIds.length === 0) {
      alert('Vui lòng chọn ít nhất một người dùng để xuất!');
      return;
    }

    try {
      console.log('Starting Excel export...');
      console.log('Selected IDs:', selectedUserIds);
      console.log('Users:', users);
      
      // Dynamically import xlsx
      const XLSX = await import('xlsx');
      console.log('XLSX library loaded successfully');
      
      // Get selected users
      const selectedUsers = users.filter(u => selectedUserIds.includes(Number(u.id)));
      console.log('Selected users:', selectedUsers);
      
      if (selectedUsers.length === 0) {
        alert('Không tìm thấy người dùng được chọn!');
        return;
      }
      
      // Prepare data for Excel
      const excelData = selectedUsers.map((user, index) => ({
        'STT': index + 1,
        'Tên': user.fullName || '',
        'Email': user.email || '',
        'Số điện thoại': user.phone || '',
        'Vai trò': user.role || '',
      }));
      console.log('Excel data prepared:', excelData);
      
      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Set column widths
      worksheet['!cols'] = [
        { wch: 5 },  // STT
        { wch: 25 }, // Tên
        { wch: 30 }, // Email
        { wch: 15 }, // Số điện thoại
        { wch: 15 }, // Vai trò
      ];
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `users_export_${timestamp}.xlsx`;
      console.log('Filename:', filename);
      
      // Save file
      XLSX.writeFile(workbook, filename);
      console.log('File saved successfully');
      
      alert(`Đã xuất ${selectedUserIds.length} người dùng ra file Excel thành công!`);
      setSelectedUserIds([]);
    } catch (error: any) {
      console.error('Error exporting to Excel:', error);
      console.error('Error stack:', error.stack);
      console.error('Error message:', error.message);
      alert(`Lỗi khi xuất file Excel: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1400px] mx-auto bg-white text-black rounded-xl shadow-md p-8">
        <UserTableHeader
          onAddUser={handleAddUser}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterRole={filterRole}
          filterStatus={filterStatus}
          onFilterRoleChange={setFilterRole}
          onFilterStatusChange={setFilterStatus}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={(newSortBy, newDirection) => {
            setSortBy(newSortBy);
            setSortDirection(newDirection);
          }}
          selectedCount={selectedUserIds.length}
          onExportExcel={handleExportToExcel}
        />

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <input 
                      type="checkbox" 
                      className="w-[18px] h-[18px] cursor-pointer rounded" 
                      checked={selectedUserIds.length === users.length && users.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avatar</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Số điện thoại</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vai trò</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      index={index}
                      onView={handleViewUser}
                      onEdit={handleEditUser}
                      onDelete={handleDeleteUser}
                      isSelected={selectedUserIds.includes(Number(user.id))}
                      onSelectChange={handleSelectUser}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      {searchValue ? 'Không tìm thấy người dùng phù hợp' : 'Chưa có người dùng nào'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        mode={modalMode}
        initialData={selectedUser}
      />

      {/* Loading overlay when fetching user details */}
      {loadingUserDetail && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-700 font-medium">Đang tải thông tin...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUserPage;
