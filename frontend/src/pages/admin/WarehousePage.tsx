import AdminLayout from "../admin/AdminLayout";

export default function WarehousePage() {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Quản lý Kho</h1>
          <p className="text-gray-600">Trang quản lý kho</p>
        </div>
      </div>
    </AdminLayout>
  );
}
