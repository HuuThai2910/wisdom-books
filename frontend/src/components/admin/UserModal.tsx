import { useState, useRef } from 'react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialData?: {
    id?: number;
    email?: string;
    fullName?: string;
    phone?: string;
    gender?: string;
    address?: string;
    role?: string;
    status?: string;
  };
}

const UserModal = ({ isOpen, onClose, mode, initialData }: UserModalProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialData || {});
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Kích thước file quá lớn! Vui lòng chọn ảnh nhỏ hơn 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(`${mode === 'add' ? 'Thêm' : 'Cập nhật'} người dùng thành công!`);
    onClose();
  };

  const getInitials = () => {
    if (initialData?.fullName) {
      return initialData.fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return '👤';
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center 
        justify-center animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl w-[90%] max-w-[900px] 
        max-h-[90vh] overflow-hidden shadow-2xl animate-modalSlide flex relative">
        
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0ea5e9] 
          via-[#3b82f6] to-[#0ea5e9] bg-[length:200%_100%] animate-gradientMove" />

        {/* Left Side - Avatar Section */}
        <div className="w-[300px] bg-gradient-to-b from-[#0ea5e9] to-[#3b82f6] p-10 
          flex flex-col items-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-[-50%] right-[-30%] w-[250px] h-[250px] 
            bg-white/8 rounded-full animate-float" />
          <div className="absolute bottom-[-40%] left-[-30%] w-[200px] h-[200px] 
            bg-white/5 rounded-full animate-floatReverse" />

          <h3 className="text-white text-lg font-semibold mb-6 text-center relative z-10 
            [text-shadow:0_2px_10px_rgba(0,0,0,0.2)]">
            Ảnh đại diện
          </h3>

          <div className="relative z-10 mb-6">
            <div className="relative w-[150px] h-[150px]">
              <div className="w-[150px] h-[150px] rounded-full border-4 border-white/30 
                shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-400 
                hover:scale-110 hover:rotate-[5deg] bg-white/15 backdrop-blur-md 
                flex items-center justify-center text-white text-5xl font-semibold
                overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : mode === 'edit' && initialData?.fullName ? (
                  getInitials()
                ) : (
                  '👤'
                )}
              </div>
              
              {avatarPreview && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute top-0 right-0 w-9 h-9 rounded-full bg-red-500 
                    border-4 border-white/30 text-white text-xl flex items-center 
                    justify-center transition-all duration-300 hover:scale-115 
                    hover:rotate-90 hover:bg-red-600 shadow-lg"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <label className="relative px-8 py-3.5 bg-white/20 backdrop-blur-md text-white 
            border-2 border-white/30 rounded-full text-sm font-semibold cursor-pointer 
            transition-all duration-300 hover:bg-white/30 hover:border-white/50 
            hover:-translate-y-0.5 shadow-lg hover:shadow-xl overflow-hidden z-10">
            <span className="relative z-10">📷 Chọn ảnh</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>

          <p className="text-center text-white/90 text-xs mt-6 bg-white/10 px-5 py-3 
            rounded-xl backdrop-blur-md leading-relaxed z-10">
            JPG, PNG hoặc GIF<br />Tối đa 2MB
          </p>

          <div className="mt-auto pt-8 text-center text-white/70 text-xs space-y-2 z-10">
            <p className="py-2 px-3 bg-white/5 rounded-lg backdrop-blur-md">
              💡 Ảnh đại diện giúp dễ nhận biết
            </p>
            <p className="py-2 px-3 bg-white/5 rounded-lg backdrop-blur-md">
              ✨ Chọn ảnh rõ nét, chân dung
            </p>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="px-9 py-7 bg-gradient-to-r from-[#0ea5e9] to-[#3b82f6] 
            text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] w-[200px] h-[200px] 
              bg-white/10 rounded-full animate-float" />
            <div className="absolute bottom-[-30%] left-[-5%] w-[150px] h-[150px] 
              bg-white/8 rounded-full animate-floatReverse" />
            
            <h2 className="text-2xl font-semibold relative z-10 
              [text-shadow:0_2px_10px_rgba(0,0,0,0.2)]">
              {mode === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}
            </h2>
            
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full border-2 border-white/30 bg-white/15 
                backdrop-blur-md text-white text-2xl flex items-center justify-center 
                transition-all duration-300 hover:bg-white/25 hover:border-white/50 
                hover:rotate-90 hover:scale-110 relative z-10"
            >
              ×
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 animate-fadeInUp [animation-delay:0.1s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    defaultValue={initialData?.email}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm 
                      outline-none transition-all duration-300 hover:border-gray-300 
                      hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                      focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]"
                  />
                </div>

                {mode === 'add' && (
                  <div className="col-span-2 animate-fadeInUp [animation-delay:0.15s]">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Nhập mật khẩu"
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm 
                        outline-none transition-all duration-300 hover:border-gray-300 
                        hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                        focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]"
                    />
                  </div>
                )}

                <div className="col-span-2 animate-fadeInUp [animation-delay:0.2s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    defaultValue={initialData?.fullName}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm 
                      outline-none transition-all duration-300 hover:border-gray-300 
                      hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                      focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]"
                  />
                </div>

                <div className="animate-fadeInUp [animation-delay:0.25s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    defaultValue={initialData?.phone}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm 
                      outline-none transition-all duration-300 hover:border-gray-300 
                      hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                      focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]"
                  />
                </div>

                <div className="animate-fadeInUp [animation-delay:0.3s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Giới tính
                  </label>
                  <select
                    defaultValue={initialData?.gender}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm 
                      outline-none transition-all duration-300 hover:border-gray-300 
                      hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                      focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]
                      appearance-none bg-no-repeat bg-[right_16px_center] cursor-pointer pr-12"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230ea5e9' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`
                    }}
                  >
                    <option value="">-- Chọn giới tính --</option>
                    <option value="0">Nam</option>
                    <option value="1">Nữ</option>
                    <option value="2">Khác</option>
                  </select>
                </div>

                <div className="col-span-2 animate-fadeInUp [animation-delay:0.35s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Địa chỉ
                  </label>
                  <textarea
                    defaultValue={initialData?.address}
                    placeholder="Nhập địa chỉ đầy đủ"
                    rows={3}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm 
                      outline-none transition-all duration-300 hover:border-gray-300 
                      hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                      focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]
                      resize-vertical"
                  />
                </div>

                <div className="animate-fadeInUp [animation-delay:0.4s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Vai trò <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    defaultValue={initialData?.role}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm 
                      outline-none transition-all duration-300 hover:border-gray-300 
                      hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                      focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]
                      appearance-none bg-no-repeat bg-[right_16px_center] cursor-pointer pr-12"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230ea5e9' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`
                    }}
                  >
                    <option value="">-- Chọn vai trò --</option>
                    <option value="ADMIN">Admin</option>
                    <option value="STAFF">Nhân viên</option>
                    <option value="CUSTOMER">Khách hàng</option>
                    <option value="WARE_HOUSE_STAFF">Thủ kho</option>
                  </select>
                </div>

                <div className="animate-fadeInUp [animation-delay:0.45s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Trạng thái
                  </label>
                  <select
                    defaultValue={initialData?.status || 'ACTIVE'}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm 
                      outline-none transition-all duration-300 hover:border-gray-300 
                      hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                      focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]
                      appearance-none bg-no-repeat bg-[right_16px_center] cursor-pointer pr-12"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230ea5e9' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`
                    }}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="BANNED">Banned</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-9 py-6 bg-gray-50 flex justify-end gap-3 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3.5 border-2 border-gray-300 bg-white rounded-xl text-sm 
                  font-semibold transition-all duration-300 hover:border-gray-400 
                  hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden"
              >
                Hủy
              </button>
              
              <button
                type="submit"
                className="px-8 py-3.5 text-white rounded-xl text-sm font-semibold 
                  transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden
                  shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)'
                }}
              >
                {mode === 'add' ? 'Thêm người dùng' : 'Cập nhật'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
