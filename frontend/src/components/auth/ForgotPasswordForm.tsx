import { AppDispatch } from '@/app/store';
import { sendOTPEmail, verifyOTPCode, verifiedOTPAndChangePassword } from '../../features/auth/authSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

interface FormErrors {
  email?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const dispatch = useDispatch<AppDispatch>();

  const validateEmail = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = (): boolean => {
    const newErrors: FormErrors = {};
    const otp = otpValues.join('');

    if (otp.length !== 6) {
      newErrors.otp = 'Vui lòng nhập đầy đủ 6 số của mã OTP';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (): boolean => {
    const newErrors: FormErrors = {};

    if (!newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (newPassword.length > 50) {
      newErrors.newPassword = 'Mật khẩu không được quá 50 ký tự';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = () => {
    if (!validateEmail()) {
      return;
    }

    dispatch(sendOTPEmail({ email: email.trim() }))
      .unwrap()
      .then(() => {
        alert('Mã OTP đã được gửi đến email của bạn!');
        setCurrentStep(2);
        setErrors({});
      })
      .catch((error: any) => {
        if (error.response?.data?.message) {
          const message = error.response.data.message;
          if (message.toLowerCase().includes('email')) {
            setErrors({ email: 'Email không tồn tại trong hệ thống' });
          } else {
            alert(message);
          }
        } else {
          alert('Gửi email OTP thất bại. Vui lòng thử lại!');
        }
      });
  };

  const handleSubmitResetPassword = () => {
    // Validate tất cả
    const newErrors: FormErrors = {};

    // Validate OTP
    const otp = otpValues.join('');
    if (otp.length !== 6) {
      newErrors.otp = 'Vui lòng nhập đầy đủ 6 số của mã OTP';
    }

    // Validate password
    if (!newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (newPassword.length > 50) {
      newErrors.newPassword = 'Mật khẩu không được quá 50 ký tự';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Gọi API reset password (đã bao gồm verify OTP)
    dispatch(verifiedOTPAndChangePassword({ 
      email: email.trim(), 
      otp, 
      newPassword, 
      confirmPassword 
    }))
      .unwrap()
      .then((response) => {
        console.log('Reset password response:', response);
        
        // Kiểm tra success - có thể ở response.data hoặc response trực tiếp
        const successValue = response?.data?.success ?? response?.success;
        const message = response?.data?.message || response?.message || '';
        
        console.log('Success value:', successValue, 'Message:', message);
        
        if (successValue === true) {
          alert('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
          resetForm();
          onBackToLogin();
        } else {
          // OTP sai hoặc có lỗi khác
          const errorMessage = message || 'Đặt lại mật khẩu thất bại';
          
          // Clear OTP và hiển thị lỗi
          setOtpValues(['', '', '', '', '', '']);
          setTimeout(() => {
            const firstInput = document.querySelector('input[data-index="0"]') as HTMLInputElement;
            firstInput?.focus();
          }, 100);
          
          // Luôn hiển thị lỗi ở field OTP nếu có message
          if (errorMessage.toLowerCase().includes('otp') || 
              errorMessage.toLowerCase().includes('mã') ||
              errorMessage.toLowerCase().includes('code') ||
              errorMessage.toLowerCase().includes('không đúng') ||
              errorMessage.toLowerCase().includes('hết hạn') ||
              errorMessage.toLowerCase().includes('expired')) {
            setErrors({ otp: errorMessage });
          } else {
            setErrors({ otp: errorMessage });
          }
        }
      })
      .catch((error: any) => {
        console.error('Reset password error:', error);
        
        const message = error.response?.data?.message || 
                       error.response?.data?.data?.message ||
                       error.message ||
                       'Đặt lại mật khẩu thất bại. Vui lòng thử lại!';
        
        // Clear OTP khi có lỗi
        setOtpValues(['', '', '', '', '', '']);
        setTimeout(() => {
          const firstInput = document.querySelector('input[data-index="0"]') as HTMLInputElement;
          firstInput?.focus();
        }, 100);
        
        setErrors({ otp: message });
      });
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
    if (!email.trim()) {
      alert('Không tìm thấy email. Vui lòng thử lại!');
      return;
    }

    dispatch(sendOTPEmail({ email: email.trim() }))
      .unwrap()
      .then(() => {
        alert('Mã OTP đã được gửi lại đến email của bạn!');
        setOtpValues(['', '', '', '', '', '']);
        setErrors({});
      })
      .catch((error: any) => {
        alert('Gửi lại OTP thất bại. Vui lòng thử lại!');
      });
  };

  const resetForm = () => {
    setCurrentStep(1);
    setEmail('');
    setOtpValues(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  const titles = {
    1: 'Quên mật khẩu',
    2: 'Đặt lại mật khẩu'
  };

  return (
    <form className="bg-white flex items-center justify-center flex-col px-10 py-8 min-h-full">
      <h1 className="mb-2.5 text-3xl font-bold" style={{ color: '#2196F3' }}>{titles[currentStep as keyof typeof titles]}</h1>
      
      {/* Step 1: Email */}
      {currentStep === 1 && (
        <div className="w-full flex flex-col items-center">
          <span className="text-xs text-gray-600 my-5">Nhập email của bạn để nhận mã OTP</span>
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
                    : 'border-transparent focus:border-blue-600'
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 mb-2 px-1">{errors.email}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleSendOtp}
            className="text-white text-xs px-11 py-2.5 border border-transparent rounded-lg font-semibold tracking-wider 
            uppercase mt-2.5 cursor-pointer transition-all duration-300 
            hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(33,150,243,0.4)]"
          style={{
            background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 50%, #0d47a1 100%)'
          }}
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
            style={{ color: '#2196F3' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1976D2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#2196F3'}   
              >
            Quay lại đăng nhập
          </a>
        </div>
      )}

      {/* Step 2: OTP + New Password (Combined) */}
      {currentStep === 2 && (
        <div className="w-full flex flex-col items-center">
          <span className="text-xs text-gray-600 my-5">Nhập mã OTP và mật khẩu mới của bạn</span>
          
          {/* OTP Input */}
          <div className="w-full flex flex-col items-center mb-4">
            <label className="text-sm font-semibold mb-2" style={{ color: '#2196F3' }}>Mã OTP</label>
            <div className="flex gap-2.5">
              {otpValues.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={value}
                  data-index={index}
                  onChange={(e) => {
                    handleOtpChange(index, e.target.value);
                    if (errors.otp) setErrors({ ...errors, otp: undefined });
                  }}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={`w-[45px] h-[45px] text-center text-xl font-bold bg-gray-100 
                    border-2 rounded-lg outline-none transition-all duration-300 
                    focus:bg-white ${
                      errors.otp 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-transparent focus:border-blue-600'
                    }`}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-red-500 text-xs mt-2 px-1">{errors.otp}</p>
            )}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleResendOtp();
              }}
              className="text-xs mt-3 transition-colors duration-300"
              style={{ color: '#2196F3' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1976D2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#2196F3'}
            >
              Gửi lại mã OTP
            </a>
          </div>

          {/* Password Inputs */}
          <div className="w-full mt-4">
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.newPassword) setErrors({ ...errors, newPassword: undefined });
              }}
              className={`bg-gray-100 border-2 my-2 px-4 py-2.5 text-sm rounded-lg w-full 
                outline-none transition-all duration-300 focus:bg-white ${
                  errors.newPassword 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-transparent focus:border-blue-600'
                }`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1 mb-2 px-1">{errors.newPassword}</p>
            )}
          </div>

          <div className="w-full">
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
              }}
              className={`bg-gray-100 border-2 my-2 px-4 py-2.5 text-sm rounded-lg w-full 
                outline-none transition-all duration-300 focus:bg-white ${
                  errors.confirmPassword 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-transparent focus:border-blue-600'
                }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 mb-2 px-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmitResetPassword}
            className="text-white text-xs px-11 py-2.5 border border-transparent rounded-lg font-semibold tracking-wider 
              uppercase mt-4 cursor-pointer transition-all duration-300 
              hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(33,150,243,0.4)]"
            style={{
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 50%, #0d47a1 100%)'
            }}
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
            style={{ color: '#2196F3' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1976D2'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#2196F3'}
          >
            Quay lại đăng nhập
          </a>
        </div>
      )}

    </form>
  );
};

export default ForgotPasswordForm;
