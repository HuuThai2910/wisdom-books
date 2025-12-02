import { UserParams, UpdateUserParams, UserDetailResponse, uploadAvatar, getAvatarUrl } from '../../api/userApi';
import { AppDispatch } from '@/app/store';
import { createUserforAdmin, updateUserforAdmin } from '../../features/user/useSlice';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import addressData, { WardMapping } from "vietnam-address-database";

const wardMappings = addressData.find(
  (x: any) => x.type === "table" && x.name === "ward_mappings"
)!.data as WardMapping[];

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'add' | 'edit' | 'view';
  initialData?: UserDetailResponse;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
  province?: string;
  ward?: string;
  address?: string;
  role?: string;
}

const UserModal = ({ isOpen, onClose, onSuccess, mode, initialData }: UserModalProps) => {
  const dispatch=useDispatch<AppDispatch>();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [wardsForSelectedCity, setWardsForSelectedCity] = useState<string[]>([]);
  
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
    // Lọc phường theo tỉnh/thành phố được chọn (giống DeliveryInformation.tsx)
    if (!formData.address.province) {
      setWardsForSelectedCity([]);
      return;
    }
    
    const filteredWards = wardMappings
      .filter((w) => {
        const provinceToMatch = formData.address.province.replace(
          /^(Thành phố |Tỉnh )/i,
          ""
        );
        const wardProvince = w.new_province_name.replace(
          /^(Thành phố |Tỉnh )/i,
          ""
        );
        return (
          wardProvince === provinceToMatch ||
          w.new_province_name === formData.address.province
        );
      })
      .map((w) => w.new_ward_name);

    setWardsForSelectedCity(Array.from(new Set(filteredWards)));
  }, [formData.address.province]);

  useEffect( () => {
    if ((mode === 'edit' || mode === 'view') && initialData) {
      console.log('UserModal initialData:', initialData);
      const roleId = initialData.role ? String(initialData.role) : '';

      setFormData({
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        gender: initialData.gender || '',
        address: initialData.address || { address: '', ward: '', province: '' },
        role: { id: roleId },
        userStatus: initialData.userStatus || 'ACTIVE',
        password: 'Abcd1234!',
        confirmPassword: 'Abcd1234!',
      });

      // Only set avatar preview if avatarURL exists and is not empty
      if (initialData.avatarURL && initialData.avatarURL.trim() !== '') {
        const url = "https://hai-project-images.s3.us-east-1.amazonaws.com/" + initialData.avatarURL;
        setAvatarPreview(url);
      } else {
        setAvatarPreview(null);
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
    setErrors({});
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
      
      // Store file in formData
      setFormData(prev => ({
        ...prev,
        avatarFile: file
      }));
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFormData(prev => ({
      ...prev,
      avatarFile: undefined
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate fullName
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 3 ký tự';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải có 10 số và bắt đầu bằng 0';
    }

    // Validate password (only for add mode)
    if (mode === 'add') {
      if (!formData.password) {
        newErrors.password = 'Vui lòng nhập mật khẩu';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
    }

    // Validate role
    if (!formData.role.id) {
      newErrors.role = 'Vui lòng chọn vai trò';
    }

    // Validate address fields
    if (!formData.address.province.trim()) {
      newErrors.province = 'Vui lòng chọn tỉnh/thành phố';
    }

    if (!formData.address.ward.trim()) {
      newErrors.ward = 'Vui lòng chọn phường/xã';
    }

    if (!formData.address.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ chi tiết';
    } else if (formData.address.address.trim().length < 5) {
      newErrors.address = 'Địa chỉ phải có ít nhất 5 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    setLoading(true);

    try {
      let avatarFilename = initialData?.avatarURL; 
      if (formData.avatarFile) {
        const uploadResponse = await uploadAvatar(formData.avatarFile);
        avatarFilename = uploadResponse.data.data;
        console.log('Avatar uploaded:', avatarFilename);
      }

      if (mode === 'add') {
        const userDataToSubmit = {
          ...formData,
          avatarURL: avatarFilename
        };
        
        console.log('Creating user with data:', JSON.stringify(userDataToSubmit, null, 2));
        await dispatch(createUserforAdmin({user: userDataToSubmit})).unwrap();
        toast.success('Thêm người dùng thành công!');
        onSuccess();
        onClose();
      } else {
        // Update existing user
        if (!initialData?.id) {
          toast.error('Lỗi: Không tìm thấy ID người dùng!');
          setLoading(false);
          return;
        }

        const updateData: UpdateUserParams = {
          fullName: formData.fullName,
          phone: formData.phone,
          gender: formData.gender,
          email: formData.email,
          address: formData.address,
          role: formData.role.id,
          status: formData.userStatus,
          avatarURL: avatarFilename,
        };

        await dispatch(updateUserforAdmin({ id: String(initialData.id), user: updateData })).unwrap();
        toast.success('Cập nhật người dùng thành công!');
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center 
        justify-center animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-[90%] max-w-[900px] 
        max-h-[90vh] overflow-auto shadow-2xl flex relative">

        {/* Left Side - Avatar Section */}
        <div className="w-[300px] h-[138vh] bg-[#3b82f6] p-10 
          flex flex-col items-center">
          <h3 className="text-white text-lg font-semibold mb-6 text-center">
            Ảnh đại diện
          </h3>

          <div className="relative mb-6">
            <div className="relative w-[150px] h-[150px]">
              <div className="w-[150px] h-[150px] rounded-full border-4 border-white/40 
                shadow-lg bg-white/20 flex items-center justify-center text-white text-5xl font-semibold
                overflow-hidden">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-white text-5xl font-semibold">👤</span>';
                    }}
                  />
                ) : (
                  <span>👤</span>
                )}
              </div>
              
              {avatarPreview && mode !== 'view' && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute top-0 right-0 w-9 h-9 rounded-full bg-red-500 
                    border-2 border-white text-white text-xl flex items-center 
                    justify-center transition-all duration-200 hover:bg-red-600 shadow-md"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {mode !== 'view' && (
            <label className="px-8 py-3 bg-white text-[#3b82f6] 
              rounded-lg text-sm font-semibold cursor-pointer 
              transition-all duration-200 hover:bg-white/90 shadow-md">
              Chọn ảnh
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          )}

          <p className="text-center text-white/90 text-xs mt-6 px-5 py-3 leading-relaxed">
            JPG, PNG hoặc GIF<br />Tối đa 2MB
          </p>
        </div>

        {/* Right Side - Form Section */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="px-9 py-7 bg-[#3b82f6] text-white flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              {mode === 'add' ? 'Thêm người dùng mới' : mode === 'view' ? 'Xem thông tin người dùng' : 'Chỉnh sửa người dùng'}
            </h2>
            
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-white/20 text-white text-2xl flex items-center justify-center 
                transition-all duration-200 hover:bg-white/30"
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
                    disabled={mode === 'edit' || mode === 'view'}
                    readOnly={mode === 'view'}
                    value={formData.email}
                    onChange={(e)=>{
                      setFormData({...formData, email:e.target.value});
                      if (errors.email) setErrors({...errors, email: undefined});
                    }}
                    placeholder="example@email.com"
                    className={`w-full px-4 py-3.5 text-black border-2 rounded-lg text-sm 
                      outline-none transition-all duration-200 hover:border-gray-300 
                      focus:border-[#2196F3] 
                      focus:shadow-lg
                      ${errors.email ? 'border-red-500' : 'border-gray-200'}
                      ${mode === 'edit' || mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {mode === 'add' && (
                  <>
                    <div className="col-span-2 animate-fadeInUp [animation-delay:0.15s]">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e)=>{
                          setFormData({...formData, password:e.target.value});
                          if (errors.password) setErrors({...errors, password: undefined});
                        }}
                        placeholder="Nhập mật khẩu"
                        className={`w-full px-4 py-3.5 text-black border-2 rounded-lg text-sm 
                          outline-none transition-all duration-200 hover:border-gray-300 
                          focus:border-[#2196F3] 
                          focus:shadow-lg
                          ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                      )}
                    </div>
                    <div className="col-span-2 animate-fadeInUp [animation-delay:0.18s]">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Xác nhận mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e)=>{
                          setFormData({...formData, confirmPassword:e.target.value});
                          if (errors.confirmPassword) setErrors({...errors, confirmPassword: undefined});
                        }}
                        placeholder="Nhập lại mật khẩu"
                        className={`w-full px-4 py-3.5 text-black border-2 rounded-lg text-sm 
                          outline-none transition-all duration-200 hover:border-gray-300 
                          focus:border-[#2196F3] 
                          focus:shadow-lg
                          ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </>
                )}

                <div className="col-span-2 animate-fadeInUp [animation-delay:0.2s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    readOnly={mode === 'view'}
                    value={formData.fullName}
                    onChange={(e)=>{
                      setFormData({...formData, fullName:e.target.value});
                      if (errors.fullName) setErrors({...errors, fullName: undefined});
                    }}
                    placeholder="Nguyễn Văn A"
                    className={`w-full px-4 py-3.5 text-black border-2 rounded-lg text-sm 
                      outline-none transition-all duration-200 hover:border-gray-300 
                      focus:border-[#2196F3] 
                      focus:shadow-lg
                      ${errors.fullName ? 'border-red-500' : 'border-gray-200'}
                      ${mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div className="animate-fadeInUp [animation-delay:0.25s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    readOnly={mode === 'view'}
                    value={formData.phone}
                    onChange={(e)=>{
                      setFormData({...formData, phone:e.target.value});
                      if (errors.phone) setErrors({...errors, phone: undefined});
                    }}
                    placeholder="0123456789"
                    className={`w-full px-4 py-3.5 text-black border-2 rounded-lg text-sm 
                      outline-none transition-all duration-200 hover:border-gray-300 
                      focus:border-[#2196F3] 
                      focus:shadow-lg
                      ${errors.phone ? 'border-red-500' : 'border-gray-200'}
                      ${mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
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
                      className="w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                    />
                  ) : (
                    <select
                      value={formData.gender}
                      onChange={(e)=>setFormData({...formData, gender:e.target.value})}
                      className="w-full px-4 py-3.5 border-2 text-black border-gray-200 rounded-lg text-sm 
                        outline-none transition-all duration-200 hover:border-gray-300 
                        focus:border-[#2196F3] 
                        focus:shadow-lg
                        appearance-none bg-no-repeat bg-[right_16px_center] cursor-pointer pr-12"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232196F3' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`
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
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  {mode === 'view' ? (
                    <input
                      type="text"
                      readOnly
                      value={formData.address.province}
                      className="w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                    />
                  ) : (
                    <>
                      <select
                        value={formData.address.province}
                        onChange={(e)=>{
                          setFormData({...formData, address:{...formData.address, province:e.target.value, ward: ''}});
                          if (errors.province) setErrors({...errors, province: undefined});
                        }}
                        className={`w-full px-4 py-3.5 border-2 text-black rounded-lg text-sm 
                          outline-none transition-all duration-200 hover:border-gray-300 
                          focus:border-[#2196F3] 
                          focus:shadow-lg
                          appearance-none bg-no-repeat bg-[right_16px_center] cursor-pointer pr-12
                          ${errors.province ? 'border-red-500' : 'border-gray-200'}`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232196F3' d='4l5 5 5-5z'/%3E%3C/svg%3E")`
                        }}
                      >
                        <option value="">-- Chọn Tỉnh/Thành phố --</option>
                        {Array.from(
                          new Set(wardMappings.map((w) => w.new_province_name))
                        ).map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                      {errors.province && (
                        <p className="text-red-500 text-xs mt-1">{errors.province}</p>
                      )}
                    </>
                  )}
                </div>

                <div className="animate-fadeInUp [animation-delay:0.36s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phường/Xã <span className="text-red-500">*</span>
                  </label>
                  {mode === 'view' ? (
                    <input
                      type="text"
                      readOnly
                      value={formData.address.ward}
                      className="w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                    />
                  ) : (
                    <>
                      <select
                        value={formData.address.ward}
                        onChange={(e)=>{
                          setFormData({...formData, address:{...formData.address, ward:e.target.value}});
                          if (errors.ward) setErrors({...errors, ward: undefined});
                        }}
                        disabled={!formData.address.province}
                        className={`w-full px-4 py-3.5 border-2 text-black rounded-lg text-sm 
                          outline-none transition-all duration-200 hover:border-gray-300 
                          focus:border-[#2196F3] 
                          focus:shadow-lg
                          appearance-none bg-no-repeat bg-[right_16px_center] cursor-pointer pr-12
                          ${errors.ward ? 'border-red-500' : 'border-gray-200'}
                          ${!formData.address.province ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232196F3' d='M1 4l5 5 5-5z'/%3E%3C/svg%3E")`
                        }}
                      >
                        <option value="">-- Chọn Phường/Xã --</option>
                        {wardsForSelectedCity.map((ward) => (
                          <option key={ward} value={ward}>
                            {ward}
                          </option>
                        ))}
                      </select>
                      {errors.ward && (
                        <p className="text-red-500 text-xs mt-1">{errors.ward}</p>
                      )}
                    </>
                  )}
                </div>

                <div className="col-span-2 animate-fadeInUp [animation-delay:0.37s]">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Địa chỉ chi tiết <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    readOnly={mode === 'view'}
                    value={formData.address.address}
                    onChange={(e)=>{
                      setFormData({...formData, address:{...formData.address, address:e.target.value}});
                      if (errors.address) setErrors({...errors, address: undefined});
                    }}
                    placeholder="Số nhà, tên đường"
                    className={`w-full px-4 py-3.5 text-black border-2 rounded-lg text-sm 
                      outline-none transition-all duration-200 hover:border-gray-300 
                      focus:border-[#2196F3] 
                      focus:shadow-lg
                      ${errors.address ? 'border-red-500' : 'border-gray-200'}
                      ${mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                  )}
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
                      className="w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                    />
                  ) : (
                    <>
                      <select
                        value={formData.role.id}
                        onChange={(e)=>{
                          setFormData({...formData, role:{id:e.target.value}});
                          if (errors.role) setErrors({...errors, role: undefined});
                        }}
                        className={`w-full px-4 py-3.5 border-2 text-black rounded-lg text-sm 
                          outline-none transition-all duration-200 hover:border-gray-300 
                          focus:border-[#2196F3] 
                          focus:shadow-lg
                          appearance-none bg-no-repeat bg-[right_16px_center] cursor-pointer pr-12
                          ${errors.role ? 'border-red-500' : 'border-gray-200'}`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232196F3' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`
                        }}
                      >
                        <option value="">-- Chọn vai trò --</option>
                        <option value="1">Admin</option>
                        <option value="2">Nhân viên</option>
                        <option value="3">Khách hàng</option>
                        <option value="4">Thủ kho</option>
                      </select>
                      {errors.role && (
                        <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                      )}
                    </>
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
                      className="w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                    />
                  ) : (
                    <select
                      value={formData.userStatus}
                      onChange={(e)=>setFormData({...formData, userStatus:e.target.value})}
                      className="w-full px-4 py-3.5 text-black border-2 border-gray-200 rounded-lg text-sm 
                        outline-none transition-all duration-200 hover:border-gray-300 
                        focus:border-[#2196F3] 
                        focus:shadow-lg
                        appearance-none bg-no-repeat bg-[right_16px_center] cursor-pointer pr-12"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232196F3' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`
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
                className="px-8 py-3.5 border-2 text-black border-gray-300 bg-white rounded-lg text-sm 
                  font-semibold transition-all duration-200 hover:bg-gray-50"
              >
                {mode === 'view' ? 'Đóng' : 'Hủy'}
              </button>
              
              {mode !== 'view' && (
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg text-sm font-semibold 
                    transition-all duration-200 shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
