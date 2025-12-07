import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ChevronDown, Home, User, LogOut } from "lucide-react";
import { logout as logoutApi } from "../../api/auth";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenRefreshManager } from "../../util/tokenRefreshManager";
import { S3_CONFIG } from './../../config/s3';

interface AdminHeaderProps {
  onMobileMenuToggle: () => void;
}

interface UserData {
  fullName: string;
  email: string;
  avatar?: string;
  role?: string;
}

export default function AdminHeader({ onMobileMenuToggle }: AdminHeaderProps) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Đọc thông tin user từ localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

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
              <p className="text-sm font-semibold text-gray-700">
                {currentUser?.fullName || 'Admin'}
              </p>
            </div>
            {currentUser?.avatar ? (
              <img
                src={S3_CONFIG.BASE_URL + currentUser.avatar}
                alt={currentUser.fullName}
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {currentUser?.fullName?.charAt(0).toUpperCase() || 'A'}
              </div>
            )}
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
                  Trang bán hàng
                </Link>
                <Link
                  to="/admin/profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Trang cá nhân
                </Link>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={async () => {
                    try {
                      // Stop token monitoring
                      tokenRefreshManager.stopMonitoring();
                      
                      // Lấy token từ cookie
                      const token = Cookies.get('id_token');
                      
                      if (token) {
                        // Call API để blacklist token (refresh_token được gửi tự động qua cookie)
                        await logoutApi(token);
                      }
                      
                      // Xóa localStorage
                      localStorage.removeItem('user');
                      localStorage.removeItem('token');
                      localStorage.removeItem('username');
                      
                      // Xóa cookies
                      Cookies.remove('id_token', { path: '/' });
                      Cookies.remove('refresh_token', { path: '/' });
                      
                      // Reset state
                      setCurrentUser(null);
                      setDropdownOpen(false);
                      
                      // Redirect về login
                      toast.success('Đăng xuất thành công!');
                      navigate('/login');
                      
                      // Reload để clear tất cả state
                      window.location.reload();
                    } catch (error) {
                      console.error('Logout error:', error);
                      // Vẫn xóa local data dù API fail
                      tokenRefreshManager.stopMonitoring();
                      localStorage.removeItem('user');
                      localStorage.removeItem('token');
                      localStorage.removeItem('username');
                      Cookies.remove('id_token', { path: '/' });
                      Cookies.remove('refresh_token', { path: '/' });
                      toast.error('Đã có lỗi xảy ra, nhưng bạn đã được đăng xuất');
                      navigate('/login');
                      window.location.reload();
                    }
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
