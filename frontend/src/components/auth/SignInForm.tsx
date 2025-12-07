import { AppDispatch } from "@/app/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser, loginUser } from "../../features/auth/authSlice";
import { User } from "@/types";
import toast from "react-hot-toast";
import { tokenRefreshManager } from "../../util/tokenRefreshManager";

interface SignInFormProps {
  onForgotPassword: () => void;
  onSuccess: () => void;
}

interface FormErrors {
  username?: string;
  password?: string;
}

const SignInForm = ({ onForgotPassword, onSuccess }: SignInFormProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User>();
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      // Lưu thông tin user vào localStorage
      localStorage.setItem("user", JSON.stringify(user));
      console.log("Đăng nhập thành công:", user);

      // Redirect dựa trên role
      const userRole = user.role?.toString();
      if (userRole === "1" || userRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (userRole === "2" || userRole === "STAFF") {
        navigate("/staff/dashboard");
      } else if (userRole === "4" || userRole === "WARE_HOUSE_STAFF") {
        navigate("/warehouse/dashboard");
      } else {
        // CUSTOMER (3) hoặc role khác về trang home
        navigate("/");
      }

      // Reload trang để cập nhật header
      window.location.reload();
    }
  }, [user, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate username
    if (!username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    } else if (username.trim().length < 2) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 2 ký tự";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const loginForm = {
      fullName: username.trim(),
      password: password,
    };

    dispatch(loginUser({ loginForm }))
      .unwrap()
      .then((response) => {
        // Lưu username để auto-refresh (refreshToken đã ở cookie)
        localStorage.setItem("username", username.trim());
        console.log("[SignInForm] Saved username, refresh token is in cookie");

        // Bắt đầu monitoring token expiry
        tokenRefreshManager.startMonitoring();

        dispatch(fetchCurrentUser({ accessToken: response.data.token }))
          .unwrap()
          .then((user) => {
            setUser(user.data);
          });
        onSuccess();
      })
      .catch((error: any) => {
        console.log("[SignInForm] Login error:", error);
        // Kiểm tra lỗi tài khoản bị vô hiệu hóa
        if (error === "Tài khoản của bạn đã bị vô hiệu hóa bởi quản trị viên") {
          toast.error(
            error || "Tài khoản của bạn đã bị vô hiệu hóa bởi quản trị viên"
          );
          return; // Dừng lại, không hiển thị thêm toast khác
        }

        // Các lỗi khác
        if (error) {
          toast.error("Tên đăng nhập hoặc mật khẩu không đúng");
        }
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white flex items-center justify-center flex-col px-10 py-8 min-h-full"
    >
      <h1 className="mb-2.5 text-3xl font-bold" style={{ color: "#2196F3" }}>
        Đăng nhập
      </h1>

      <div className="flex gap-3 my-5">
        <a
          href="#"
          className="border-2 border-gray-300 rounded-[20%] inline-flex justify-center items-center
          w-10 h-10 text-gray-600 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:-translate-y-1"
        >
          <i className="fa-brands fa-google-plus-g"></i>
        </a>
        <a
          href="#"
          className="border-2 border-gray-300 rounded-[20%] inline-flex justify-center items-center
          w-10 h-10 text-gray-600 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:-translate-y-1"
        >
          <i className="fa-brands fa-facebook-f"></i>
        </a>
        <a
          href="#"
          className="border-2 border-gray-300 rounded-[20%] inline-flex justify-center items-center
          w-10 h-10 text-gray-600 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:-translate-y-1"
        >
          <i className="fa-brands fa-github"></i>
        </a>
      </div>

      <span className="text-xs text-gray-600">
        Hoặc sử dụng mật khẩu email của bạn
      </span>

      <div className="w-full">
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (errors.username) setErrors({ ...errors, username: undefined });
          }}
          className={`bg-gray-100 border-2 my-2 px-4 py-2.5 text-sm rounded-lg w-full 
            outline-none transition-all duration-300 focus:bg-white ${
              errors.username
                ? "border-red-500 focus:border-red-500"
                : "border-transparent focus:border-[#2196F3]"
            }`}
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1 mb-2 px-1">
            {errors.username}
          </p>
        )}
      </div>

      <div className="w-full">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors({ ...errors, password: undefined });
            }}
            autoComplete="current-password"
            className={`bg-gray-100 border-2 my-2 px-4 py-2.5 pr-10 text-sm rounded-lg w-full 
              outline-none transition-all duration-300 focus:bg-white ${
                errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-transparent focus:border-[#2196F3]"
              } [&::-ms-reveal]:hidden [&::-ms-clear]:hidden`}
          />
          {password && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </button>
          )}
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1 mb-2 px-1">
            {errors.password}
          </p>
        )}
      </div>

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onForgotPassword();
        }}
        className="text-sm mt-4 mb-2.5 transition-colors duration-300"
        style={{ color: "#2196F3" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#1976D2")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#2196F3")}
      >
        Quên mật khẩu?
      </a>

      <button
        type="submit"
        className="text-white text-xs px-11 py-2.5 border border-transparent rounded-lg font-semibold tracking-wider 
          uppercase mt-2.5 cursor-pointer transition-all duration-300 
          hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(33,150,243,0.4)]"
        style={{
          background:
            "linear-gradient(135deg, #2196F3 0%, #1976D2 50%, #0d47a1 100%)",
        }}
      >
        Đăng nhập
      </button>
    </form>
  );
};

export default SignInForm;
