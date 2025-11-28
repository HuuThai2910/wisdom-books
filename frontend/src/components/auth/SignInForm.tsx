import { AppDispatch, } from '@/app/store';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentUser, loginUser } from '../../features/auth/authSlice';
import { User } from '@/types';

interface SignInFormProps {
  onForgotPassword: () => void;
  onSuccess: () => void;
}
const SignInForm = ({ onForgotPassword, onSuccess }: SignInFormProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user,setUser]=useState<User>();

    useEffect(() => {
          if (user) {
            console.log("Alo:",user);
            navigate('/');
          }
    }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
        const loginForm = {
            fullName: username,
            password: password,
        };
        dispatch(loginUser({ loginForm })).unwrap()
            .then((response) => {
                dispatch(fetchCurrentUser({ accessToken: response.data.token }))
                .unwrap()
                .then((user) => {
                    setUser(user.data);
                });
                onSuccess();
            });
          
    } else {
      alert('Vui lòng nhập đầy đủ thông tin');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white flex items-center justify-center flex-col px-10 h-full">
      <h1 className="mb-2.5 text-3xl font-bold" style={{ color: '#6B66A3' }}>Đăng nhập</h1>
      
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
      
      <span className="text-xs text-gray-600">Hoặc sử dụng mật khẩu email của bạn</span>
      
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
      
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onForgotPassword();
        }}
        className="text-sm mt-4 mb-2.5 transition-colors duration-300"
        style={{ color: '#6B66A3' }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#544F87'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#6B66A3'}
      >
        Quên mật khẩu?
      </a>
      
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
        Đăng nhập
      </button>
    </form>
  );
};

export default SignInForm;
