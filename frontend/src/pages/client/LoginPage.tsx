import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SignInForm from '../../components/auth/SignInForm';
import SignUpForm from '../../components/auth/SignUpForm';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import OwlAnimation from '../../components/auth/OwlAnimation';

const LoginPage = () => {
  const location = useLocation();
  const initialMode = (location.state as { mode?: 'signin' | 'signup' | 'forgot' })?.mode || 'signin';
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [isFlying, setIsFlying] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Update mode when location state changes
  useEffect(() => {
    if (location.state && (location.state as { mode?: string }).mode) {
      setMode((location.state as { mode: 'signin' | 'signup' | 'forgot' }).mode);
    }
  }, [location.state]);

  const handleSuccess = () => {
    setIsFlying(true);
  };

  const handleAnimationComplete = () => {
    setIsClosing(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 25%, #2c5364 50%, #1e3c72 75%, #2a5298 100%)'
      }}>
      
      {/* Animated background */}
      <div className="absolute w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(33,150,243,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(138,43,226,0.1)_0%,transparent_50%)]
        animate-pulse-slow pointer-events-none" />

      <div className={`relative overflow-hidden w-[768px] max-w-full min-h-[600px] rounded-[30px] 
        bg-gradient-to-br from-white to-[#f0f4ff]
        shadow-[0_15px_60px_rgba(33,150,243,0.4),0_5px_15px_rgba(0,0,0,0.1)]
        ${isClosing ? 'animate-fade-out' : ''}`}>
        
        {/* Owl Animation */}
        <div className={`absolute -top-[-30px] left-150 -translate-x-1/2 transition-all duration-600 ease-in-out z-[10001]
          ${mode === 'signup' ? '-translate-x-[calc(50%+420px)]' : '-translate-x-1/2'}`}>
          <OwlAnimation isFlying={isFlying} onAnimationComplete={handleAnimationComplete} />
        </div>

        {/* Sign Up Form */}
        <div className={`absolute top-0 h-full left-0 w-1/2 transition-all duration-600 ease-in-out overflow-y-auto
          ${mode === 'signup' ? 'translate-x-full opacity-100 z-[5]' : 'translate-x-0 opacity-0 z-[1]'}`}>
          <SignUpForm onSuccess={handleSuccess} />
        </div>

        {/* Sign In Form */}
        <div className={`absolute top-0 h-full left-0 w-1/2 z-[2] transition-all duration-600 ease-in-out overflow-y-auto
          ${mode === 'signup' ? 'translate-x-full' : 'translate-x-0'}
          ${mode === 'forgot' ? 'opacity-0' : 'opacity-100'}`}>
          <SignInForm 
            onForgotPassword={() => setMode('forgot')}
            onSuccess={handleSuccess}
          />
        </div>

        {/* Forgot Password Form */}
        <div className={`absolute top-0 h-full left-0 w-1/2 transition-opacity duration-600 ease-in-out overflow-y-auto
          ${mode === 'forgot' ? 'opacity-100 z-[10]' : 'opacity-0 z-[1]'}`}>
          <ForgotPasswordForm onBackToLogin={() => setMode('signin')} />
        </div>

        {/* Toggle Container */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-600 ease-in-out
          z-[1000] ${mode === 'signup' ? '-translate-x-full rounded-[0_150px_100px_0]' : 'translate-x-0 rounded-[150px_0_0_100px]'}`}>
          <div className={`h-full text-white relative left-[-100%] w-[200%] transition-transform duration-600 ease-in-out
            shadow-[inset_0_0_50px_rgba(0,0,0,0.1)]
            ${mode === 'signup' ? 'translate-x-1/2' : 'translate-x-0'}`}
            style={{
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 30%, #0d47a1 70%, #1a237e 100%)'
            }}>
            
            {/* Rotating gradient overlay */}
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] 
              bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)]
              animate-rotate-slow pointer-events-none" />

            {/* Toggle Left Panel (For Sign In) */}
            <div className={`absolute w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0
              transition-transform duration-600 ease-in-out z-[100]
              ${mode === 'signup' ? 'translate-x-0' : '-translate-x-[200%]'}`}>
              <h1 className="text-white text-[32px] font-bold mb-2.5
                [text-shadow:0_3px_10px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.3)]">
                Chào mừng bạn trở lại!
              </h1>
              <p className="text-white/95 text-sm leading-5 my-5
                [text-shadow:0_2px_5px_rgba(0,0,0,0.3)]">
                Nhập thông tin cá nhân của bạn để sử dụng tất cả các tính năng của trang web
              </p>
              <button
                onClick={() => setMode('signin')}
                className="bg-transparent text-white text-xs px-11 py-2.5 border-2 border-white 
                  rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer 
                  transition-all duration-300 hover:bg-white/10"
              >
                Đăng nhập
              </button>
            </div>

            {/* Toggle Right Panel (For Sign Up) */}
            <div className={`absolute w-1/2 h-full flex items-center justify-center flex-col px-8 text-center 
              top-0 right-0 transition-transform duration-600 ease-in-out z-[100]
              ${mode === 'signup' ? 'translate-x-[200%]' : 'translate-x-0'}`}>
              <h1 className="text-white text-[32px] font-bold mb-2.5
                [text-shadow:0_3px_10px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.3)]">
                Chào bạn!
              </h1>
              <p className="text-white/95 text-sm leading-5 my-5
                [text-shadow:0_2px_5px_rgba(0,0,0,0.3)]">
                Đăng ký với thông tin cá nhân của bạn để sử dụng tất cả các tính năng của trang web
              </p>
              <button
                onClick={() => setMode('signup')}
                className="bg-transparent text-white text-xs px-11 py-2.5 border-2 border-white 
                  rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer 
                  transition-all duration-300 hover:bg-white/10"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
