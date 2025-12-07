import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import UserTableHeader from "../../components/admin/UserTableHeader";
import UserTableRow from "../../components/admin/UserTableRow";
import AdminLayout from "../../pages/admin/AdminLayout";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import {
  fetchUsersDashboard,
  deleteUserForAdmin,
} from "../../features/user/useSlice";
import { UserData } from "@/types";
import toast from "react-hot-toast";

const ManageUserPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <FaSortUp className="ml-1 text-blue-500" />
    ) : (
      <FaSortDown className="ml-1 text-blue-500" />
    );
  };

  const loadUsers = () => {
    setLoading(true);
    dispatch(
      fetchUsersDashboard({
        keyword: searchValue || undefined,
        sortBy: sortBy || undefined,
        sortDirection: sortDirection || undefined,
        role: filterRole || undefined,
        status: filterStatus || undefined,
      })
    )
      .unwrap()
      .then((response) => {
        console.log("Users response:", response);
        setUsers(response.users || []);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error("Lỗi khi tải danh sách người dùng!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Trigger immediate load for filters and sort
  useEffect(() => {
    loadUsers();
  }, [filterRole, filterStatus, sortBy, sortDirection]);

  const handleAddUser = () => {
    navigate("/admin/user-form?mode=add");
  };

  const handleEditUser = (user: UserData) => {
    navigate(`/admin/user-form/${user.id}?mode=edit`);
  };

  const handleViewUser = (user: UserData) => {
    navigate(`/admin/user-form/${user.id}?mode=view`);
  };

  const handleDeleteUser = (user: UserData) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="font-semibold text-lg">Xác nhận xóa người dùng</p>
          </div>
          <p className="text-sm text-gray-600 pl-12">
            Bạn có chắc muốn xóa người dùng{" "}
            <strong className="text-gray-900">"{user.fullName}"</strong>?
            <br />
            <span className="text-red-600">
              Hành động này không thể hoàn tác!
            </span>
          </p>
          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
              }}
              className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                const deletePromise = dispatch(
                  deleteUserForAdmin({ id: String(user.id) })
                ).unwrap();

                toast.promise(deletePromise, {
                  loading: "Đang xóa người dùng...",
                  success: () => {
                    loadUsers();
                    return `Đã xóa người dùng "${user.fullName}" thành công!`;
                  },
                  error: (error) => {
                    console.error("Error deleting user:", error);
                    return error?.message || "Lỗi khi xóa người dùng!";
                  },
                });
              }}
              className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              Xóa
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          maxWidth: "500px",
        },
      }
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(users.map((u) => Number(u.id)));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUserIds([...selectedUserIds, userId]);
    } else {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new column with ascending order
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const handleExportToExcel = async () => {
    if (selectedUserIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một người dùng để xuất!");
      return;
    }

    try {
      console.log("Starting Excel export...");
      console.log("Selected IDs:", selectedUserIds);
      console.log("Users:", users);

      // Dynamically import xlsx
      const XLSX = await import("xlsx");
      console.log("XLSX library loaded successfully");

      // Get selected users
      const selectedUsers = users.filter((u) =>
        selectedUserIds.includes(Number(u.id))
      );
      console.log("Selected users:", selectedUsers);

      if (selectedUsers.length === 0) {
        toast.error("Không tìm thấy người dùng được chọn!");
        return;
      }

      // Prepare data for Excel
      const excelData = selectedUsers.map((user, index) => ({
        STT: index + 1,
        Tên: user.fullName || "",
        Email: user.email || "",
        "Số điện thoại": user.phone || "",
        "Vai trò": user.role || "",
      }));
      console.log("Excel data prepared:", excelData);

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      worksheet["!cols"] = [
        { wch: 5 }, // STT
        { wch: 25 }, // Tên
        { wch: 30 }, // Email
        { wch: 15 }, // Số điện thoại
        { wch: 15 }, // Vai trò
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `users_export_${timestamp}.xlsx`;
      console.log("Filename:", filename);

      // Save file
      XLSX.writeFile(workbook, filename);
      console.log("File saved successfully");

      toast.success(
        `Đã xuất ${selectedUserIds.length} người dùng ra file Excel thành công!`
      );
      setSelectedUserIds([]);
    } catch (error: any) {
      console.error("Error exporting to Excel:", error);
      console.error("Error stack:", error.stack);
      console.error("Error message:", error.message);
      toast.error(
        `Lỗi khi xuất file Excel: ${error.message || "Unknown error"}`
      );
    }
  };

  return (
    <AdminLayout>
      <>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <h1 className="text-3xl font-bold wisbook-gradient-text mb-6">
            Quản Lý Người Dùng
          </h1>
          <UserTableHeader
            onAddUser={handleAddUser}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            filterRole={filterRole}
            filterStatus={filterStatus}
            onFilterRoleChange={setFilterRole}
            onFilterStatusChange={setFilterStatus}
            selectedCount={selectedUserIds.length}
            onExportExcel={handleExportToExcel}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="w-[18px] h-[18px] cursor-pointer rounded"
                        checked={
                          selectedUserIds.length === users.length &&
                          users.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Avatar
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none transition-colors"
                      onClick={() => handleSort("fullName")}
                    >
                      <div className="flex items-center">
                        Tên
                        {renderSortIcon("fullName")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none transition-colors"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center">
                        Email
                        {renderSortIcon("email")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Số điện thoại
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none transition-colors"
                      onClick={() => handleSort("role")}
                    >
                      <div className="flex items-center">
                        Vai trò
                        {renderSortIcon("role")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none transition-colors"
                      onClick={() => handleSort("userStatus")}
                    >
                      <div className="flex items-center">
                        Trạng thái
                        {renderSortIcon("userStatus")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((user, index) => (
                        <UserTableRow
                          key={user.id}
                          user={user}
                          index={(currentPage - 1) * itemsPerPage + index}
                          onView={handleViewUser}
                          onEdit={handleEditUser}
                          onDelete={handleDeleteUser}
                          isSelected={selectedUserIds.includes(Number(user.id))}
                          onSelectChange={handleSelectUser}
                        />
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        {searchValue
                          ? "Không tìm thấy người dùng phù hợp"
                          : "Chưa có người dùng nào"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {users.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Hiển thị {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, users.length)} trên{" "}
                {users.length} người dùng
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Trang đầu"
                >
                  <span className="text-gray-600 text-sm font-medium">«</span>
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="text-gray-600" size={18} />
                </button>

                <div className="flex gap-1">
                  {Array.from(
                    { length: Math.ceil(users.length / itemsPerPage) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(Math.ceil(users.length / itemsPerPage), prev + 1)
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(users.length / itemsPerPage)
                  }
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="text-gray-600" size={18} />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.ceil(users.length / itemsPerPage))
                  }
                  disabled={
                    currentPage === Math.ceil(users.length / itemsPerPage)
                  }
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Trang cuối"
                >
                  <span className="text-gray-600 text-sm font-medium">»</span>
                </button>

                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="ml-2 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value={10}>10 / trang</option>
                  <option value={20}>20 / trang</option>
                  <option value={50}>50 / trang</option>
                </select>
              </div>
            </div>
          )}
        </motion.div>
      </>
    </AdminLayout>
  );
};

export default ManageUserPage;
