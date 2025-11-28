import { AppDispatch } from '@/app/store';
import { sendOTPEmail, verifiedOTPAndChangePassword } from '../../features/auth/authSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch=useDispatch<AppDispatch>();

  const handleSendOtp = () => {
    if (email) {
      dispatch(sendOTPEmail({ email })).unwrap()
        .then(() => {
          alert('Mã OTP đã được gửi đến email của bạn!');
          setCurrentStep(2);
        })
        .catch((error: any) => {
          const message =
            error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            "Gửi email OTP thất bại";
          alert(message);
        });
    } else {
      alert('Vui lòng nhập email');
    }
  };

  const handleVerifyOtp = () => {
    const otp = otpValues.join('');
    setNewPassword('abc123!');
    setConfirmPassword('abc123!');
    if (otp.length === 6) {
      dispatch(verifiedOTPAndChangePassword({ email, otp, newPassword, confirmPassword })).unwrap()
        .then(() => {
          setNewPassword('');
          setConfirmPassword('');
          alert('Xác nhận OTP thành công! Vui lòng đặt lại mật khẩu.');
          setCurrentStep(3);
        })
        .catch((error: any) => {
          const message =
            error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            "Xác nhận OTP thất bại";
          alert(message);
        });
    } else {
      alert('Vui lòng nhập đầy đủ mã OTP');
    }
  };

  const handleResetPassword = () => {
    if (newPassword && confirmPassword) {
      dispatch(verifiedOTPAndChangePassword({ email, otp: otpValues.join(''), newPassword, confirmPassword })).unwrap()
        .then(() => {
          alert('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
          onBackToLogin();
          setCurrentStep(1);
        })
    } else {
      alert('Vui lòng nhập đầy đủ thông tin');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleResendOtp = () => {
    console.log('Resending OTP to:', email);
    alert('Mã OTP đã được gửi lại!');
  };

  const resetForm = () => {
    setCurrentStep(1);
    setEmail('');
    setOtpValues(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
  };

  const titles = {
    1: 'Quên mật khẩu',
    2: 'Xác nhận OTP',
    3: 'Đặt lại mật khẩu'
  };

  return (
    <form className="bg-white flex items-center justify-center flex-col px-10 h-full">
      <h1 className="mb-2.5 text-3xl font-bold" style={{ color: '#6B66A3' }}>{titles[currentStep as keyof typeof titles]}</h1>
      
      {/* Step 1: Email */}
      {currentStep === 1 && (
        <div className="w-full flex flex-col items-center">
          <span className="text-xs text-gray-600 my-5">Nhập email của bạn để nhận mã OTP</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-100 border-2 border-transparent my-2 px-4 py-2.5 text-sm rounded-lg w-full 
              outline-none transition-all duration-300 focus:bg-white focus:border-purple-600"
          />
          <button
            type="button"
            onClick={handleSendOtp}
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
            Gửi mã OTP
          </button>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBackToLogin();
              resetForm();
            }}
            className="text-sm mt-4 mb-2.5 transition-colors duration-300"
            style={{ color: '#6B66A3' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#544F87'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6B66A3'}   
              >
            Quay lại đăng nhập
          </a>
        </div>
      )}

      {/* Step 2: OTP */}
      {currentStep === 2 && (
        <div className="w-full flex flex-col items-center">
          <span className="text-xs text-gray-600 my-5">Nhập mã OTP đã gửi đến email của bạn</span>
          <div className="flex gap-2.5 my-4">
            {otpValues.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={value}
                data-index={index}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-[45px] h-[45px] text-center text-xl font-bold bg-gray-100 
                  border-2 border-transparent rounded-lg outline-none transition-all duration-300 
                  focus:bg-white focus:border-purple-600"
              />
            ))}
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBackToLogin();
              resetForm();
            }}
            className="text-sm mt-4 mb-2.5 transition-colors duration-300"
            style={{ color: '#6B66A3' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#544F87'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6B66A3'}          >
            Quay lại đăng nhập
          </a>
          <button
            type="button"
            onClick={handleVerifyOtp}
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
            Xác nhận OTP
          </button>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleResendOtp();
            }}
          className="text-sm mt-4 mb-2.5 transition-colors duration-300"
          style={{ color: '#6B66A3' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#544F87'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6B66A3'}          >
            Gửi lại mã OTP
          </a>
          
        </div>
      )}

      {/* Step 3: New Password */}
      {currentStep === 3 && (
        <div className="w-full flex flex-col items-center">
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-gray-100 border-2 border-transparent my-2 px-4 py-2.5 text-sm rounded-lg w-full 
              outline-none transition-all duration-300 focus:bg-white focus:border-purple-600"
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-gray-100 border-2 border-transparent my-2 px-4 py-2.5 text-sm rounded-lg w-full 
              outline-none transition-all duration-300 focus:bg-white focus:border-purple-600"
          />
          <button
            type="button"
            onClick={handleResetPassword}
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
            Đặt lại mật khẩu
          </button>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBackToLogin();
              resetForm();
            }}
            className="text-sm mt-4 mb-2.5 transition-colors duration-300"
            style={{ color: '#6B66A3' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#544F87'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6B66A3'}          >
            Quay lại đăng nhập
          </a>
        </div>
      )}
    </form>
  );
};

export default ForgotPasswordForm;
