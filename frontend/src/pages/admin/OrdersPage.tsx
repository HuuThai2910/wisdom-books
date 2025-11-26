import AdminLayout from "../admin/AdminLayout";

export default function OrdersPage() {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Quản lý Đơn hàng
          </h1>
          <p className="text-gray-600">Trang quản lý đơn hàng</p>
        </div>
      </div>
    </AdminLayout>
  );
}
