import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from './../../features/auth/authSlice';
import { RegisterFormData } from './../../types/index';
import type { AppDispatch } from './../../app/store';
import toast from 'react-hot-toast';

interface SignUpFormProps {
  onSuccess: () => void;
  onSwitchToSignIn?: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

const SignUpForm = ({ onSuccess, onSwitchToSignIn }: SignUpFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate theo thứ tự từ trên xuống, dừng ngay khi gặp lỗi đầu tiên
    
    // 1. Validate name (field đầu tiên)
    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
      setErrors(newErrors);
      return false;
    } else if (name.trim().length < 2) {
      newErrors.name = 'Họ tên phải có ít nhất 2 ký tự';
      setErrors(newErrors);
      return false;
    } else if (name.trim().length > 100) {
      newErrors.name = 'Họ tên không được quá 100 ký tự';
      setErrors(newErrors);
      return false;
    }

    // 2. Validate email (field thứ hai)
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
      setErrors(newErrors);
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
      setErrors(newErrors);
      return false;
    }

    // 3. Validate phone (field thứ ba)
    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
      setErrors(newErrors);
      return false;
    } else if (!/^0\d{9}$/.test(phone)) {
      newErrors.phone = 'Số điện thoại phải có 10 số và bắt đầu bằng 0';
      setErrors(newErrors);
      return false;
    }

    // 4. Validate password (field thứ tư)
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      setErrors(newErrors);
      return false;
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
      setErrors(newErrors);
      return false;
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ in hoa';
      setErrors(newErrors);
      return false;
    } else if (!/(?=.*[a-z])/.test(password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ thường';
      setErrors(newErrors);
      return false;
    } else if (!/(?=.*[0-9])/.test(password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 số';
      setErrors(newErrors);
      return false;
    } else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt';
      setErrors(newErrors);
      return false;
    } else if (password.length > 50) {
      newErrors.password = 'Mật khẩu không được quá 50 ký tự';
      setErrors(newErrors);
      return false;
    }

    // 5. Validate confirm password (field cuối cùng)
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
      setErrors(newErrors);
      return false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      setErrors(newErrors);
      return false;
    }

    // Tất cả validation đã pass
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const registerForm: RegisterFormData = {
      fullName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password,
      confirmPassword: confirmPassword,
    };
    
    dispatch(registerUser({ registerForm }))
      .unwrap()
      .then(() => {
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        // Nếu có callback để chuyển sang modal đăng nhập, gọi nó
        if (onSwitchToSignIn) {
          onSwitchToSignIn();
        } else {
          // Fallback: navigate nếu không có callback
          navigate('/login');
        }
      })
      .catch((error: any) => {
        // Xử lý lỗi từ backend
        if (error) {
          console.log('[SignUpForm] Registration error:', error);
          const message = error.toLowerCase();
          
          // Backend giờ validate riêng biệt từng trường và trả về message cụ thể
          
          // Kiểm tra cả 2 đều trùng
          if (message.includes('both_exists') || message.includes('tên người dùng và email')) {
            setErrors({ 
              name: 'Tên người dùng này đã được sử dụng.',
              email: 'Email này đã được đăng ký.'
            });
            toast.error('Tên người dùng và email đều đã tồn tại!');
          }
          // Kiểm tra lỗi fullName/username trùng
          else if (message.includes('fullname_exists') || message.includes('tên người dùng này đã được sử dụng') ||
                   message.includes('username') || message.includes('user already exists')) {
            setErrors({ name: 'Tên người dùng này đã được sử dụng. Vui lòng chọn tên khác.' });
            toast.error('Tên người dùng đã tồn tại!');
          }
          // Kiểm tra lỗi email trùng
          else if (message.includes('email_exists') || message.includes('email này đã được đăng ký')) {
            setErrors({ email: 'Email này đã được đăng ký. Vui lòng sử dụng email khác.' });
            toast.error('Email đã tồn tại trong hệ thống!');
          } 
          // Kiểm tra các lỗi chung về email từ AWS Cognito
          else if (message.includes('email')) {
            setErrors({ email: 'Có lỗi với email. Vui lòng kiểm tra lại.' });
            toast.error('Email không hợp lệ hoặc đã tồn tại!');
          }
          // Lỗi chung
          else {
            toast.error(error);
          }
        } else {
          toast.error('Đăng ký thất bại. Vui lòng thử lại!');
        }
      });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white flex items-center justify-center flex-col px-10 py-8 min-h-full">
      <h1 className="mb-2.5 text-3xl font-bold" style={{ color: '#2196F3' }}>Tạo tài khoản</h1>
      
      <div className="flex gap-3 my-5">
        <a href="#" className="border-2 border-gray-300 rounded-[20%] inline-flex justify-center items-center
          w-10 h-10 text-gray-600 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:-translate-y-1">
          <i className="fa-brands fa-google-plus-g"></i>
        </a>
        <a href="#" className="border-2 border-gray-300 rounded-[20%] inline-flex justify-center items-center
          w-10 h-10 text-gray-600 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:-translate-y-1">
          <i className="fa-brands fa-facebook-f"></i>
        </a>
        <a href="#" className="border-2 border-gray-300 rounded-[20%] inline-flex justify-center items-center
          w-10 h-10 text-gray-600 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:-translate-y-1">
          <i className="fa-brands fa-github"></i>
        </a>
      </div>
      
      <span className="text-xs text-gray-600">Hoặc sử dụng email của bạn để đăng ký</span>
      
      <div className="w-full">
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          className={`bg-gray-100 border-2 my-2 px-4 py-2.5 text-sm rounded-lg w-full 
            outline-none transition-all duration-300 focus:bg-white ${
              errors.name 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-transparent focus:border-[#2196F3]'
            }`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1 mb-2 px-1">{errors.name}</p>
        )}
      </div>
      
      <div className="w-full">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          className={`bg-gray-100 border-2 my-2 px-4 py-2.5 text-sm rounded-lg w-full 
            outline-none transition-all duration-300 focus:bg-white ${
              errors.email 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-transparent focus:border-[#2196F3]'
            }`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 mb-2 px-1">{errors.email}</p>
        )}
      </div>
      
      <div className="w-full">
        <input
          type="tel"
          placeholder="Số điện thoại (VD: 0123456789)"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (errors.phone) setErrors({ ...errors, phone: undefined });
          }}
          className={`bg-gray-100 border-2 my-2 px-4 py-2.5 text-sm rounded-lg w-full 
            outline-none transition-all duration-300 focus:bg-white ${
              errors.phone 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-transparent focus:border-[#2196F3]'
            }`}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1 mb-2 px-1">{errors.phone}</p>
        )}
      </div>
      
      <div className="w-full">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            className={`bg-gray-100 border-2 my-2 px-4 py-2.5 ${password ? 'pr-10' : 'pr-4'} text-sm rounded-lg w-full 
              outline-none transition-all duration-300 focus:bg-white ${
                errors.password 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-transparent focus:border-[#2196F3]'
              } [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-contacts-auto-fill-button]:hidden`}
          />
          {password && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          )}
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1 mb-2 px-1">{errors.password}</p>
        )}
      </div>
      
      <div className="w-full">
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại Mật khẩu"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
            }}
            className={`bg-gray-100 border-2 my-2 px-4 py-2.5 ${confirmPassword ? 'pr-10' : 'pr-4'} text-sm rounded-lg w-full 
              outline-none transition-all duration-300 focus:bg-white ${
                errors.confirmPassword 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-transparent focus:border-[#2196F3]'
              } [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-contacts-auto-fill-button]:hidden`}
          />
          {confirmPassword && (
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          )}
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1 mb-2 px-1">{errors.confirmPassword}</p>
        )}
      </div>
      
      <button
        type="submit"
        className="text-white text-xs px-11 py-2.5 border border-transparent rounded-lg font-semibold tracking-wider 
          uppercase mt-2.5 cursor-pointer transition-all duration-300 
          hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(33,150,243,0.4)]"
        style={{
          background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 50%, #0d47a1 100%)'
        }}
      >
        Đăng ký
      </button>
    </form>
  );
};

export default SignUpForm;
