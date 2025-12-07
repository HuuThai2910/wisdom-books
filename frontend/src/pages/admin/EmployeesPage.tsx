import AdminLayout from "../admin/AdminLayout";

export default function EmployeesPage() {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Quản lý Nhân viên
          </h1>
          <p className="text-gray-600">Trang quản lý nhân viên</p>
        </div>
      </div>
    </AdminLayout>
  );
}
