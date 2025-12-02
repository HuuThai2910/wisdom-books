import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ChevronDown, Home, User, LogOut } from "lucide-react";

interface AdminHeaderProps {
  onMobileMenuToggle: () => void;
}

export default function AdminHeader({ onMobileMenuToggle }: AdminHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="flex items-center justify-between p-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMobileMenuToggle}
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
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Trang cá nhân
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
  );
}
