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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedUser, setSelectedUser] = useState<UserDetailResponse | undefined>();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);
  
  const loadUsers = () => {
    setLoading(true);
    dispatch(fetchUsersDashboard()).unwrap()
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
  }, []);

  const handleAddUser = () => {
    setModalMode('add');
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserData) => {
    setLoadingUserDetail(true);
    dispatch(getUserByIdForAdmin({ id: user.id }))
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
    dispatch(getUserByIdForAdmin({ id: user.id }))
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
      dispatch(deleteUserForAdmin({ id: user.id }))
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



  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1400px] mx-auto bg-white rounded-xl shadow-md p-8">
        <UserTableHeader
          onAddUser={handleAddUser}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
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
                    <input type="checkbox" className="w-[18px] h-[18px] cursor-pointer rounded" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Số điện thoại</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vai trò</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
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
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
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
