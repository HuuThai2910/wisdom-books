import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  BookOpen,
  Menu,
  MoreVertical,
} from "lucide-react";
import logo from "../../assets/img/logo.png";
import AdminHeader from "../../components/Header/AdminHeader";
import AdminFooter from "../../components/Footer/AdminFooter";

interface StaffLayoutProps {
  children: React.ReactNode;
}

export default function StaffLayout({ children }: StaffLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isSidebarExpanded = sidebarOpen || sidebarHovered;

  const menuItems = [
    { name: "Dashboard", path: "/staff/dashboard", icon: Home },
    { name: "Đơn hàng", path: "/staff/orders", icon: ShoppingCart },
    { name: "Quản lý sách", path: "/staff/books", icon: BookOpen },
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
            "linear-gradient(5deg, rgba(0, 60, 200, 1) 2%,rgba(0, 90, 220, 1) 7%,rgba(20, 110, 230, 1) 16%,rgba(0, 80, 210, 1) 39%,rgba(0, 70, 190, 1) 76%,rgba(0, 80, 130, 1) 100%",
        }}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <div className="p-4 border-b border-white/20 flex items-center justify-between gap-3">
          <Link
            to="/staff/dashboard"
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
                Staff Dashboard
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
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                        active
                          ? "bg-white text-blue-600 shadow-lg"
                          : "text-gray-200 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 shrink-0 transition-transform ${
                          active ? "scale-110" : "group-hover:scale-110"
                        }`}
                      />
                      <span
                        className={`whitespace-nowrap transition-all duration-200 ${
                          isSidebarExpanded
                            ? "opacity-100 w-auto"
                            : "opacity-0 w-0 overflow-hidden"
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
      </aside>

      <div
        className={`flex-1 flex flex-col ${
          isSidebarExpanded ? "lg:ml-64" : "lg:ml-20"
        } transition-all duration-200`}
      >
        <AdminHeader onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 p-6">{children}</main>
        <AdminFooter />
      </div>
    </div>
  );
}
