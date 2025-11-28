import { useState } from 'react';
import UserTableHeader from '../../components/admin/UserTableHeader';
import UserTableRow from '../../components/admin/UserTableRow';
import UserModal from '../../components/admin/UserModal';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

const ManageUserPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Mock data
  const [users] = useState<User[]>([
    {
      id: 1,
      name: 'Sophia Turner',
      email: 'sophiaturner@example.com',
      phone: '(555) 123-4567',
      role: 'Admin',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Liam Johnson',
      email: 'liamjohnson87@example.com',
      phone: '(555) 432-1098',
      role: 'Admin',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Olivia Smith',
      email: 'oliviasmith12@example.com',
      phone: '(555) 876-5432',
      role: 'Attendee',
      status: 'Pending'
    },
    {
      id: 4,
      name: 'Noah Brown',
      email: 'noahbrown576@example.com',
      phone: '(555) 456-7890',
      role: 'Organizer',
      status: 'Banned'
    },
    {
      id: 5,
      name: 'Emma Davis',
      email: 'emmadavis25@example.com',
      phone: '(555) 234-5678',
      role: 'Organizer',
      status: 'Active'
    },
    {
      id: 6,
      name: 'James Wilson',
      email: 'jameswilson@example.com',
      phone: '(555) 789-0123',
      role: 'Admin',
      status: 'Active'
    },
    {
      id: 7,
      name: 'Ava Martinez',
      email: 'avamartinez@example.com',
      phone: '(555) 345-6789',
      role: 'Attendee',
      status: 'Active'
    },
    {
      id: 8,
      name: 'James Wilson',
      email: 'jameswilson@example.com',
      phone: '(555) 789-0123',
      role: 'Admin',
      status: 'Active'
    },
    {
      id: 9,
      name: 'Ava Martinez',
      email: 'avamartinez@example.com',
      phone: '(555) 345-6789',
      role: 'Attendee',
      status: 'Active'
    },
    {
      id: 10,
      name: 'James Wilson',
      email: 'jameswilson@example.com',
      phone: '(555) 789-0123',
      role: 'Admin',
      status: 'Active'
    },
    {
      id: 11,
      name: 'Ava Martinez',
      email: 'avamartinez@example.com',
      phone: '(555) 345-6789',
      role: 'Attendee',
      status: 'Active'
    }
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.phone.includes(searchValue)
  );

  const handleAddUser = () => {
    setModalMode('add');
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setModalMode('edit');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleViewUser = (user: User) => {
    alert(`Thông tin người dùng:\n\nID: ${user.id}\nTên: ${user.name}\nEmail: ${user.email}\nĐiện thoại: ${user.phone}\nVai trò: ${user.role}\nTrạng thái: ${user.status}`);
  };

  const handleDeleteUser = (user: User) => {
    if (confirm(`Bạn có chắc muốn xóa người dùng "${user.name}"?\n\nHành động này không thể hoàn tác!`)) {
      alert(`Đã xóa người dùng "${user.name}" thành công!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1400px] mx-auto bg-white rounded-xl shadow-md p-8">
        <UserTableHeader
          onAddUser={handleAddUser}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />

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
              {filteredUsers.map((user, index) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  index={index}
                  onView={handleViewUser}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={selectedUser ? {
          id: selectedUser.id,
          email: selectedUser.email,
          fullName: selectedUser.name,
          phone: selectedUser.phone,
          role: selectedUser.role.toUpperCase(),
          status: selectedUser.status.toUpperCase()
        } : undefined}
      />
    </div>
  );
};

export default ManageUserPage;
