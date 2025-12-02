import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  UserCheck,
  ShoppingCart,
  BookOpen,
  Warehouse,
  BarChart3,
  Shield,
  Menu,
  MoreVertical,
} from "lucide-react";
import logo from "../../assets/img/logo.png";
import AdminHeader from "../../components/Header/AdminHeader";
import AdminFooter from "../../components/Footer/AdminFooter";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isSidebarExpanded = sidebarOpen || sidebarHovered;

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: Home },
    { name: "Nhân viên", path: "/admin/manage-users", icon: UserCheck },
    { name: "Đơn hàng", path: "/admin/orders", icon: ShoppingCart },
    { name: "Quản lý sách", path: "/admin/books", icon: BookOpen },
    { name: "Kho", path: "/admin/warehouse", icon: Warehouse },
    { name: "Phân quyền", path: "/admin/permissions", icon: Shield },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside
        className={`${
          isSidebarExpanded ? "w-64" : "w-20"
        } text-white fixed h-full z-30 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-[width] duration-200 ease-in-out will-change-[width]`}
        style={{
          background:
            "linear-gradient(5deg, rgba(50,20,140,1) 0%, rgba(80,50,160,1) 7%, rgba(90,60,170,1) 16%, rgba(70,40,150,1) 39%, rgba(60,30,140,1) 76%, rgba(20,10,100,1) 100%)",
        }}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <div className="p-4 border-b border-white/20 flex items-center justify-between gap-3">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 overflow-hidden transition-all duration-200 ${
              isSidebarExpanded ? "opacity-100" : "opacity-0 w-0"
            }`}
          >
            <img
              src={logo}
              alt="Wisdom Book Logo"
              className="w-14 h-14 object-contain shrink-0"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-md font-bold whitespace-nowrap tracking-wide">
                Wisdom Book
              </span>
              <span className="text-xs text-blue-200 whitespace-nowrap">
                Admin Dashboard
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-300 hover:text-white transition-colors shrink-0 p-1.5 hover:bg-white/10 rounded-lg"
            title={sidebarOpen ? "Thu gọn sidebar" : "Mở rộng sidebar"}
          >
            {sidebarOpen ? (
              <Menu className="w-5 h-5" />
            ) : (
              <MoreVertical className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="p-4 overflow-y-auto overflow-x-hidden h-[calc(100vh-80px)] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <div className="mb-4">
            {isSidebarExpanded && (
              <p className="text-xs text-gray-300 uppercase mb-2 whitespace-nowrap">
                Chức năng
              </p>
            )}
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? "bg-white/20 text-white"
                          : "text-gray-200 hover:bg-white/10"
                      }`}
                      title={!isSidebarExpanded ? item.name : ""}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span
                        className={`whitespace-nowrap transition-opacity duration-200 ${
                          isSidebarExpanded ? "opacity-100" : "opacity-0 w-0"
                        }`}
                      >
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-gray-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        } transition-[margin] duration-200 ease-in-out will-change-[margin]`}
      >
        <AdminHeader
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>

        <AdminFooter />
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}
