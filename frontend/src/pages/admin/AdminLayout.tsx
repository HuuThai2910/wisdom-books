import React, { useState, useRef, useEffect } from "react";
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
  ChevronDown,
  LogOut,
} from "lucide-react";
import logo from "../../assets/img/logo.png";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSidebarExpanded = sidebarOpen || sidebarHovered;

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: Home },
    { name: "Nhân viên", path: "/admin/employees", icon: UserCheck },
    { name: "Khách hàng", path: "/admin/customers", icon: Users },
    { name: "Đơn hàng", path: "/admin/orders", icon: ShoppingCart },
    { name: "Quản lý sách", path: "/admin/books", icon: BookOpen },
    { name: "Kho", path: "/admin/warehouse", icon: Warehouse },
    { name: "Thống kê", path: "/admin/statistics", icon: BarChart3 },
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
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between p-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Spacer for mobile to push avatar right */}
            <div className="flex-1 lg:hidden"></div>

            {/* User Profile - always on the right */}
            <div className="flex items-center ml-auto" ref={dropdownRef}>
              <div
                className="flex items-center space-x-3 cursor-pointer group relative"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-gray-500">Hi,</p>
                  <p className="text-sm font-semibold text-gray-700">Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Home className="w-4 h-4" />
                      Trang chủ
                    </Link>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setDropdownOpen(false);
                        // TODO: Implement logout
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
            <div>
              2025, made with <span className="text-red-500"></span> by Wisdom
              Book Team
            </div>
            <div className="mt-2 sm:mt-0">
              <a href="#" className="hover:text-blue-600 mx-2">
                Help
              </a>
              <a href="#" className="hover:text-blue-600 mx-2">
                Licenses
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}
