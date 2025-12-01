import { UserParams, UpdateUserParams, UserDetailResponse } from '@/api/userApi';
import { AppDispatch } from '@/app/store';
import { createUserforAdmin, updateUserforAdmin } from '../../features/user/useSlice';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'add' | 'edit' | 'view';
  initialData?: UserDetailResponse;
}

const UserModal = ({ isOpen, onClose, onSuccess, mode, initialData }: UserModalProps) => {
  const dispatch=useDispatch<AppDispatch>();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const getRoleName = (roleId: string): string => {
    const roleMap: { [key: string]: string } = {
      '1': 'Admin',
      '2': 'Nhân viên',
      '3': 'Khách hàng',
      '4': 'Thủ kho',
    };
    return roleMap[roleId] || '';
  };
  
  const getGenderDisplay = (gender: string): string => {
    const genderMap: { [key: string]: string } = {
      'MALE': 'Nam',
      'FEMALE': 'Nữ',
    };
    return genderMap[gender] || gender;
  };
  
  const getStatusDisplay = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'ACTIVE': 'Hoạt động',
      'INACTIVE': 'Ngừng hoạt động',
    };
    return statusMap[status] || status;
  };

  const [formData, setFormData] = useState<UserParams>({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    address: { address: '', ward: '', province: '' },
    role: { id: '' },
    userStatus: 'ACTIVE',
    password: 'Abcd1234!',
    confirmPassword: 'Abcd1234!',
  });  

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && initialData) {
      console.log('UserModal initialData:', initialData);
      const roleId = initialData.role ? String(initialData.role) : '';

      setFormData({
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        gender: initialData.gender || '',
        address: initialData.address || { address: '', ward: '', province: '' },
        role: { id: roleId }, // ✅ Đảm bảo đúng structure
        userStatus: initialData.userStatus || 'ACTIVE',
        password: 'Abcd1234!',
        confirmPassword: 'Abcd1234!',
      });

      if (initialData.avatarURL) {
        setAvatarPreview(initialData.avatarURL);
      }
    } else if (mode === 'add') {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        gender: '',
        address: { address: '', ward: '', province: '' },
        role: { id: '' },
        userStatus: 'ACTIVE',
        password: 'Abcd1234!',
        confirmPassword: 'Abcd1234!',
      });
      setAvatarPreview(null);
    }
  }, [mode, initialData, isOpen]);

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

    setLoading(true);

    if (mode === 'add') {
      dispatch(createUserforAdmin({user: formData}))
        .unwrap()
        .then(() => {
          alert('Thêm người dùng thành công!');
          onSuccess();
        })
        .catch((error) => {
          console.error('Error creating user:', error);
          alert(`Lỗi khi thêm người dùng: ${error}`);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Update existing user
      if (!initialData?.id) {
        alert('Lỗi: Không tìm thấy ID người dùng!');
        setLoading(false);
        return;
      }

      // ✅ Chuyển đổi từ formData sang updateData format
      const updateData: UpdateUserParams = {
        fullName: formData.fullName,
        phone: formData.phone,
        gender: formData.gender,
        email: formData.email,
        address: formData.address,
        role: formData.role.id, // ✅ Extract id từ object
        status: formData.userStatus,
        avatarURL: avatarPreview || undefined,
      };

      dispatch(updateUserforAdmin({ id: String(initialData.id), user: updateData }))
        .unwrap()
        .then(() => {
          alert('Cập nhật người dùng thành công!');
          onSuccess();
        })
        .catch((error) => {
          console.error('Error updating user:', error);
          alert(`Lỗi khi cập nhật người dùng: ${error}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center 
        justify-center animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl w-[90%] max-w-[900px] 
        max-h-[90vh] overflow-auto shadow-2xl animate-modalSlide flex relative">
        
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0ea5e9] 
          via-[#3b82f6] to-[#0ea5e9] bg-[length:200%_100%] animate-gradientMove" />

        {/* Left Side - Avatar Section */}
        <div className="w-[300px] bg-gradient-to-b from-[#0ea5e9] to-[#3b82f6] p-10 
          flex flex-col items-center relative overflow-hidden">
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
                ) : (
                  <span>👤</span>
                )}
              </div>
              
              {avatarPreview && mode !== 'view' && (
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

          {mode !== 'view' && (
            <label className="relative px-8 py-3.5 bg-white/20 backdrop-blur-md text-black 
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
          )}

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
          <div className="px-9 py-7 bg-gradient-to-r from-[#0ea5e9] to-[#3b82f6] 
            text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] w-[200px] h-[200px] 
              bg-white/10 rounded-full animate-float" />
            <div className="absolute bottom-[-30%] left-[-5%] w-[150px] h-[150px] 
              bg-white/8 rounded-full animate-floatReverse" />
            
            <h2 className="text-2xl font-semibold relative z-10 
              [text-shadow:0_2px_10px_rgba(0,0,0,0.2)]">
              {mode === 'add' ? 'Thêm người dùng mới' : mode === 'view' ? 'Xem thông tin người dùng' : 'Chỉnh sửa người dùng'}
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
                    disabled={mode === 'edit' || mode === 'view'}
                    readOnly={mode === 'view'}
                    value={formData.email}
                    onChange={(e)=>setFormData({...formData, email:e.target.value})}
                    placeholder="example@email.com"
                    className={`w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-xl text-sm 
                      outline-none transition-all duration-300 hover:border-gray-300 
                      hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                      focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]
                      ${mode === 'edit' || mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                      value={formData.password}
                      onChange={(e)=>setFormData({...formData, password:e.target.value})}
                      placeholder="Nhập mật khẩu"
                      className="w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-xl text-sm 
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
                    readOnly={mode === 'view'}
                    value={formData.fullName}
                    onChange={(e)=>setFormData({...formData, fullName:e.target.value})}
                    placeholder="Nguyễn Văn A"
                    className={`w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-xl text-sm 
                      outline-none transition-all duration-300 hover:border-gray-300 
                      hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                      focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]
                      ${mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>

                <div className="animate-fadeInUp [animation-delay:0.25s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    readOnly={mode === 'view'}
                    value={formData.phone}
                    onChange={(e)=>setFormData({...formData, phone:e.target.value})}
                    placeholder="(555) 123-4567"
                    className={`w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-xl text-sm 
                      outline-none transition-all duration-300 hover:border-gray-300 
                      hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                      focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]
                      ${mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>

                <div className="animate-fadeInUp [animation-delay:0.3s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Giới tính
                  </label>
                  {mode === 'view' ? (
                    <input
                      type="text"
                      readOnly
                      value={getGenderDisplay(formData.gender)}
                      className="w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-xl text-sm bg-gray-100 cursor-not-allowed"
                    />
                  ) : (
                    <select
                      value={formData.gender}
                      onChange={(e)=>setFormData({...formData, gender:e.target.value})}
                      className="w-full px-4 py-3.5 border-2 text-black border-gray-200 rounded-xl text-sm 
                        outline-none transition-all duration-300 hover:border-gray-300 
                        hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                        focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]
                        appearance-none bg-no-repeat bg-[right_16px_center] cursor-pointer pr-12"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230ea5e9' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`
                      }}
                    >
                      <option value="">-- Chọn giới tính --</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                    </select>
                  )}
                </div>

                <div className="animate-fadeInUp [animation-delay:0.35s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Tỉnh/Thành phố
                  </label>
                  <input
                    type="text"
                    readOnly={mode === 'view'}
                    value={formData.address.province}
                    onChange={(e)=>setFormData({...formData, address:{...formData.address, province:e.target.value}})}
                    placeholder="Hồ Chí Minh"
                    className={`w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-xl text-sm 
                      outline-none transition-all duration-300 hover:border-gray-300 
                      hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                      focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]
                      ${mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>

                <div className="animate-fadeInUp [animation-delay:0.36s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phường/Xã
                  </label>
                  <input
                    type="text"
                    readOnly={mode === 'view'}
                    value={formData.address.ward}
                    onChange={(e)=>setFormData({...formData, address:{...formData.address, ward:e.target.value}})}
                    placeholder="Phường 1"
                    className={`w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-xl text-sm 
                      outline-none transition-all duration-300 hover:border-gray-300 
                      hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                      focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]
                      ${mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>

                <div className="col-span-2 animate-fadeInUp [animation-delay:0.37s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Địa chỉ chi tiết
                  </label>
                  <input
                    type="text"
                    readOnly={mode === 'view'}
                    value={formData.address.address}
                    onChange={(e)=>setFormData({...formData, address:{...formData.address, address:e.target.value}})}
                    placeholder="123 Nguyễn Văn Linh"
                    className={`w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-xl text-sm 
                      outline-none transition-all duration-300 hover:border-gray-300 
                      hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                      focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]
                      ${mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>

                <div className="animate-fadeInUp [animation-delay:0.4s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Vai trò <span className="text-red-500">*</span>
                  </label>
                  {mode === 'view' ? (
                    <input
                      type="text"
                      readOnly
                      value={getRoleName(formData.role.id)}
                      className="w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-xl text-sm bg-gray-100 cursor-not-allowed"
                    />
                  ) : (
                    <select
                      required
                      value={formData.role.id}
                      onChange={(e)=>setFormData({...formData, role:{id:e.target.value}})}
                      className="w-full px-4 py-3.5 border-2 text-black border-gray-200 rounded-xl text-sm 
                        outline-none transition-all duration-300 hover:border-gray-300 
                        hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                        focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]
                        appearance-none bg-no-repeat bg-[right_16px_center] cursor-pointer pr-12"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230ea5e9' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`
                      }}
                    >
                      <option value="">-- Chọn vai trò --</option>
                      <option value="1">Admin</option>
                      <option value="2">Nhân viên</option>
                      <option value="3">Khách hàng</option>
                      <option value="4">Thủ kho</option>
                    </select>
                  )}
                </div>

                <div className="animate-fadeInUp [animation-delay:0.45s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Trạng thái
                  </label>
                  {mode === 'view' ? (
                    <input
                      type="text"
                      readOnly
                      value={getStatusDisplay(formData.userStatus)}
                      className="w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-xl text-sm bg-gray-100 cursor-not-allowed"
                    />
                  ) : (
                    <select
                      value={formData.userStatus}
                      onChange={(e)=>setFormData({...formData, userStatus:e.target.value})}
                      className="w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-xl text-sm 
                        outline-none transition-all duration-300 hover:border-gray-300 
                        hover:-translate-y-0.5 hover:shadow-md focus:border-[#0ea5e9] 
                        focus:-translate-y-0.5 focus:shadow-[0_8px_24px_rgba(14,165,233,0.2)]
                        appearance-none bg-no-repeat bg-[right_16px_center] cursor-pointer pr-12"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230ea5e9' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`
                      }}
                    >
                      <option value="ACTIVE">Hoạt động</option>
                      <option value="INACTIVE">Ngừng hoạt động</option>
                    </select>
                  )}
                </div>
              </div>
            </div>

            <div className="px-9 py-6 bg-gray-50 flex justify-end gap-3 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3.5 border-2 text-black border-gray-300 bg-white rounded-xl text-sm 
                  font-semibold transition-all duration-300 hover:border-gray-400 
                  hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden"
              >
                {mode === 'view' ? 'Đóng' : 'Hủy'}
              </button>
              
              {mode !== 'view' && (
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3.5 text-white rounded-xl text-sm font-semibold 
                    transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden
                    shadow-lg hover:shadow-xl ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)'
                  }}
                >
                  {loading ? 'Đang xử lý...' : (mode === 'add' ? 'Thêm người dùng' : 'Cập nhật')}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;