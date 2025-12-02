import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import addressData, { WardMapping } from "vietnam-address-database";
import { updateUser, uploadAvatar, getUserById } from '../../api/userApi';

const wardMappings = addressData.find(
    (x: any) => x.type === "table" && x.name === "ward_mappings"
)!.data as WardMapping[];

interface UserData {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    avatar?: string;
    gender?: string;
    role?: number;
    userStatus?: string;
    address?: {
        province: string;
        ward: string;
        address: string;
    };
}

export default function SettingsPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserData | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        province: '',
        ward: '',
        address: '',
        gender: 'MALE',
    });
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [wardsForSelectedCity, setWardsForSelectedCity] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Lấy thông tin user chi tiết từ API giống manage-user
        const loadUserData = async () => {
            // Lấy user từ localStorage
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                toast.error('Vui lòng đăng nhập');
                navigate('/login');
                return;
            }

            let userId: number;
            try {
                const userData = JSON.parse(storedUser);
                userId = userData.id;
                if (!userId) {
                    toast.error('Vui lòng đăng nhập');
                    navigate('/login');
                    return;
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                toast.error('Vui lòng đăng nhập');
                navigate('/login');
                return;
            }

            try {
                setInitialLoading(true);
                // Gọi API getUserById giống như manage-user
                const response = await getUserById(String(userId));
                const userData = response.data.data;
                
                // Map dữ liệu từ backend
                const fullUserData: UserData = {
                    id: userData.id,
                    fullName: userData.fullName || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    avatar: userData.avatarURL,
                    gender: userData.gender,
                    role: userData.role,
                    userStatus: userData.userStatus,
                    address: userData.address
                };

                setUser(fullUserData);
                setFormData({
                    fullName: fullUserData.fullName,
                    email: fullUserData.email,
                    phone: fullUserData.phone,
                    province: fullUserData.address?.province || '',
                    ward: fullUserData.address?.ward || '',
                    address: fullUserData.address?.address || '',
                    gender: fullUserData.gender || 'MALE',
                });
                setAvatarPreview(fullUserData.avatar || '');
            } catch (error: any) {
                console.error('Error fetching user data:', error);
                toast.error('Không thể tải thông tin người dùng');
                navigate('/login');
            } finally {
                setInitialLoading(false);
            }
        };

        loadUserData();
    }, [navigate]);

    // Cập nhật danh sách phường/xã khi chọn tỉnh/thành phố
    useEffect(() => {
        if (!formData.province) {
            setWardsForSelectedCity([]);
            return;
        }

        const filteredWards = wardMappings
            .filter((w) => {
                const provinceToMatch = formData.province.replace(
                    /^(Thành phố |Tỉnh )/i,
                    ""
                );
                const wardProvince = w.new_province_name.replace(
                    /^(Thành phố |Tỉnh )/i,
                    ""
                );
                return (
                    wardProvince === provinceToMatch ||
                    w.new_province_name === formData.province
                );
            })
            .map((w) => w.new_ward_name);

        setWardsForSelectedCity(Array.from(new Set(filteredWards)));
    }, [formData.province]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Kích thước ảnh không được vượt quá 2MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                toast.error('Vui lòng chọn file ảnh');
                return;
            }

            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setAvatarPreview(user?.avatar || '');
        setAvatarFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.fullName.trim()) {
                toast.error('Vui lòng nhập họ tên');
                setLoading(false);
                return;
            }

            if (!formData.email.trim()) {
                toast.error('Vui lòng nhập email');
                setLoading(false);
                return;
            }

            if (!user?.id) {
                toast.error('Không tìm thấy thông tin người dùng');
                setLoading(false);
                return;
            }

            // Upload avatar nếu có file mới
            let avatarURL = user.avatar;
            if (avatarFile) {
                try {
                    const uploadResponse = await uploadAvatar(avatarFile);
                    avatarURL = uploadResponse.data.data;
                    const fullAvatarURL = avatarURL?.startsWith('http') 
                        ? avatarURL 
                        : `https://hai-project-images.s3.us-east-1.amazonaws.com/${avatarURL}`;
                    avatarURL = fullAvatarURL;
                } catch (error) {
                    console.error('Error uploading avatar:', error);
                    toast.error('Lỗi khi tải ảnh lên');
                    setLoading(false);
                    return;
                }
            }

            // Chuẩn bị dữ liệu update giống manage-user
            const updateData = {
                fullName: formData.fullName,
                phone: formData.phone,
                gender: formData.gender,
                email: formData.email,
                address: {
                    province: formData.province,
                    ward: formData.ward,
                    address: formData.address,
                },
                role: String(user.role || '3'),
                status: user.userStatus || 'ACTIVE',
                avatarURL: avatarURL,
            };

            // Gọi API update với user ID giống manage-user
            await updateUser(String(user.id), updateData);

            // Cập nhật state local
            const updatedUser: UserData = {
                ...user,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                avatar: avatarURL,
                gender: formData.gender,
                address: {
                    province: formData.province,
                    ward: formData.ward,
                    address: formData.address,
                }
            };

            // Lưu vào localStorage và dispatch event để Header update
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('userUpdated'));

            setUser(updatedUser);
            setIsEditing(false);
            setAvatarFile(null);
            
            toast.success('Cập nhật thông tin thành công!');
        } catch (error: any) {
            console.error('Error updating user:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                province: user.address?.province || '',
                ward: user.address?.ward || '',
                address: user.address?.address || '',
                gender: user.gender || 'MALE',
            });
            setAvatarPreview(user.avatar || '');
            setAvatarFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
        setIsEditing(false);
    };

    if (initialLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Cài đặt tài khoản</h1>
                    <p className="text-gray-600">Quản lý thông tin cá nhân của bạn</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative group">
                                    {avatarPreview ? (
                                        <img 
                                            src={avatarPreview} 
                                            alt={user.fullName}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-white shadow-lg">
                                            {user.fullName?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    {isEditing && (
                                        <>
                                            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                                <FaCamera className="text-white text-2xl" />
                                                <input 
                                                    ref={fileInputRef}
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="hidden" 
                                                />
                                            </label>
                                            {avatarFile && (
                                                <button
                                                    type="button"
                                                    onClick={removeAvatar}
                                                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 border-2 border-white text-white text-lg flex items-center justify-center transition-all duration-200 hover:bg-red-600 shadow-lg"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="text-white">
                                    <h2 className="text-2xl font-bold">{user.fullName}</h2>
                                    <p className="text-blue-100">{user.email}</p>
                                </div>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-md"
                                >
                                    Chỉnh sửa
                                </button>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                                    Thông tin cá nhân
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <FaUser className="inline mr-2 text-blue-600" />
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                                                isEditing 
                                                    ? 'border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200' 
                                                    : 'border-gray-200 bg-gray-50'
                                            } outline-none`}
                                            placeholder="Nhập họ tên"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <FaEnvelope className="inline mr-2 text-blue-600" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                                                isEditing 
                                                    ? 'border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200' 
                                                    : 'border-gray-200 bg-gray-50'
                                            } outline-none`}
                                            placeholder="Nhập email"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <FaPhone className="inline mr-2 text-blue-600" />
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                                                isEditing 
                                                    ? 'border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200' 
                                                    : 'border-gray-200 bg-gray-50'
                                            } outline-none`}
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Giới tính
                                        </label>
                                        {isEditing ? (
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 appearance-none bg-no-repeat bg-[right_16px_center] cursor-pointer"
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232563eb' d='M1 4l5 5 5-5z'/%3E%3C/svg%3E")`,
                                                }}
                                            >
                                                <option value="MALE">Nam</option>
                                                <option value="FEMALE">Nữ</option>
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={formData.gender === 'MALE' ? 'Nam' : 'Nữ'}
                                                disabled
                                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 outline-none"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                                    <FaMapMarkerAlt className="inline mr-2 text-blue-600" />
                                    Địa chỉ
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Tỉnh/Thành phố
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={formData.province}
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        province: e.target.value,
                                                        ward: '',
                                                    });
                                                }}
                                                className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 appearance-none bg-no-repeat bg-[right_16px_center] cursor-pointer"
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232563eb' d='M1 4l5 5 5-5z'/%3E%3C/svg%3E")`,
                                                }}
                                            >
                                                <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                                {Array.from(
                                                    new Set(
                                                        wardMappings.map((w) => w.new_province_name)
                                                    )
                                                ).map((province) => (
                                                    <option key={province} value={province}>
                                                        {province}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={formData.province}
                                                disabled
                                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 outline-none"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phường/Xã
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={formData.ward}
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        ward: e.target.value,
                                                    });
                                                }}
                                                disabled={!formData.province}
                                                className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 appearance-none bg-no-repeat bg-[right_16px_center] cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232563eb' d='M1 4l5 5 5-5z'/%3E%3C/svg%3E")`,
                                                }}
                                            >
                                                <option value="">
                                                    {formData.province 
                                                        ? "-- Chọn Phường/Xã --" 
                                                        : "-- Chọn Tỉnh/TP trước --"}
                                                </option>
                                                {wardsForSelectedCity.map((ward) => (
                                                    <option key={ward} value={ward}>
                                                        {ward}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={formData.ward}
                                                disabled
                                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 outline-none"
                                            />
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Địa chỉ chi tiết
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            rows={3}
                                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 resize-none ${
                                                isEditing 
                                                    ? 'border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200' 
                                                    : 'border-gray-200 bg-gray-50'
                                            } outline-none`}
                                            placeholder="Nhập địa chỉ chi tiết"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-8 flex gap-4 justify-end pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                                >
                                    <FaTimes />
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave />
                                            Lưu thay đổi
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                    >
                        ← Quay lại trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
}
