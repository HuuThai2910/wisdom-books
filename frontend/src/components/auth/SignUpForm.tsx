import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from './../../features/auth/authSlice';
import { RegisterFormData } from './../../types/index';
import type { AppDispatch } from './../../app/store';

interface SignUpFormProps {
  onSuccess: () => void;
}
const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && phone && password && confirmPassword) {
        const registerForm: RegisterFormData = {
            fullName: name,
            email: email,
            phone: phone,
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
                  const message =
                        error.response?.data?.message || 
                        error.response?.data || 
                        error.message || 
                        "Đăng ký thất bại";
                  alert(message);
                });
    } else {
      alert('Vui lòng nhập đầy đủ thông tin');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white flex items-center justify-center flex-col px-10 h-full">
      <h1 className="mb-2.5 text-3xl font-bold" style={{ color: '#6B66A3' }}>Tạo tài khoản</h1>
      
      <div className="flex gap-3 my-5">
        <a href="#" className="border-2 border-gray-300 rounded-[20%] inline-flex justify-center items-center
          w-10 h-10 text-gray-600 transition-all duration-300 hover:border-purple-600 hover:text-purple-600 hover:-translate-y-1">
          <i className="fa-brands fa-google-plus-g"></i>
        </a>
        <a href="#" className="border-2 border-gray-300 rounded-[20%] inline-flex justify-center items-center
          w-10 h-10 text-gray-600 transition-all duration-300 hover:border-purple-600 hover:text-purple-600 hover:-translate-y-1">
          <i className="fa-brands fa-facebook-f"></i>
        </a>
        <a href="#" className="border-2 border-gray-300 rounded-[20%] inline-flex justify-center items-center
          w-10 h-10 text-gray-600 transition-all duration-300 hover:border-purple-600 hover:text-purple-600 hover:-translate-y-1">
          <i className="fa-brands fa-github"></i>
        </a>
      </div>
      
      <span className="text-xs text-gray-600">Hoặc sử dụng email của bạn để đăng ký</span>
      
      <input
        type="text"
        placeholder="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-gray-100 border-2 border-transparent my-2 px-4 py-2.5 text-sm rounded-lg w-full 
          outline-none transition-all duration-300 focus:bg-white focus:border-purple-600"
      />
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-gray-100 border-2 border-transparent my-2 px-4 py-2.5 text-sm rounded-lg w-full 
          outline-none transition-all duration-300 focus:bg-white focus:border-purple-600"
      />
      
      <input
        type="tel"
        placeholder="Số điện thoại (VD: 0123456789)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="bg-gray-100 border-2 border-transparent my-2 px-4 py-2.5 text-sm rounded-lg w-full 
          outline-none transition-all duration-300 focus:bg-white focus:border-purple-600"
      />
      
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-gray-100 border-2 border-transparent my-2 px-4 py-2.5 text-sm rounded-lg w-full 
          outline-none transition-all duration-300 focus:bg-white focus:border-purple-600"
      />
      
      <input
        type="password"
        placeholder="Nhập lại Mật khẩu"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="bg-gray-100 border-2 border-transparent my-2 px-4 py-2.5 text-sm rounded-lg w-full 
          outline-none transition-all duration-300 focus:bg-white focus:border-purple-600"
      />
      
      <button
        type="submit"
        className="text-white text-xs px-11 py-2.5 border border-transparent rounded-lg font-semibold tracking-wider 
          uppercase mt-2.5 cursor-pointer transition-all duration-300 
          hover:-translate-y-0.5"
        style={{
          background: 'linear-gradient(135deg, #A8A4D8 0%, #8B86C7 50%, #6B66A3 100%)',
          boxShadow: '0 4px 15px rgba(139, 134, 199, 0.3)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 134, 199, 0.5)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 134, 199, 0.3)'}
      >
        Đăng ký
      </button>
    </form>
  );
};

export default SignUpForm;
