import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from './../../features/auth/authSlice';
import { RegisterFormData } from './../../types/index';
import type { AppDispatch } from './../../app/store';

interface SignUpFormProps {
  onSuccess: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Họ tên phải có ít nhất 2 ký tự';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Họ tên không được quá 100 ký tự';
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Validate phone
    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^0\d{9}$/.test(phone)) {
      newErrors.phone = 'Số điện thoại phải có 10 số và bắt đầu bằng 0';
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (password.length > 50) {
      newErrors.password = 'Mật khẩu không được quá 50 ký tự';
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        onSuccess();
        navigate('/');
      })
      .catch((error: any) => {
        // Xử lý lỗi từ backend
        if (error.response?.data?.message) {
          const message = error.response.data.message;
          
          // Kiểm tra lỗi username trùng
          if (message.toLowerCase().includes('username') || message.toLowerCase().includes('tên đăng nhập') || message.toLowerCase().includes('đã tồn tại')) {
            setErrors({ name: 'Tên người dùng này đã được sử dụng' });
          } else if (message.toLowerCase().includes('email')) {
            setErrors({ email: 'Email này đã được sử dụng' });
          } else if (message.toLowerCase().includes('phone') || message.toLowerCase().includes('số điện thoại')) {
            setErrors({ phone: 'Số điện thoại này đã được sử dụng' });
          } else {
            alert(message);
          }
        } else {
          alert('Đăng ký thất bại. Vui lòng thử lại!');
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
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: undefined });
          }}
          className={`bg-gray-100 border-2 my-2 px-4 py-2.5 text-sm rounded-lg w-full 
            outline-none transition-all duration-300 focus:bg-white ${
              errors.password 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-transparent focus:border-[#2196F3]'
            }`}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1 mb-2 px-1">{errors.password}</p>
        )}
      </div>
      
      <div className="w-full">
        <input
          type="password"
          placeholder="Nhập lại Mật khẩu"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
          }}
          className={`bg-gray-100 border-2 my-2 px-4 py-2.5 text-sm rounded-lg w-full 
            outline-none transition-all duration-300 focus:bg-white ${
              errors.confirmPassword 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-transparent focus:border-[#2196F3]'
            }`}
        />
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
