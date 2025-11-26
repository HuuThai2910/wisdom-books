import {
    FaLock,
    FaUserShield,
    FaShieldAlt,
    FaKey
} from "react-icons/fa";

export const securityPillars = [
    {
        icon: FaLock,
        title: "Mã hóa dữ liệu",
        desc: "SSL/TLS 256-bit cho mọi giao dịch",
        details: [
            "Bảo vệ thông tin cá nhân",
            "Mã hóa dữ liệu thanh toán",
            "Chứng chỉ SSL từ nhà cung cấp uy tín",
        ],
        color: "from-blue-400 to-blue-500",
    },
    {
        icon: FaUserShield,
        title: "Bảo vệ tài khoản",
        desc: "Xác thực đa yếu tố (MFA)",
        details: [
            "Xác thực 2 lớp qua OTP",
            "Thông báo đăng nhập lạ",
            "Khóa tài khoản tự động khi phát hiện bất thường",
        ],
        color: "from-blue-300 to-blue-400",
    },
    {
        icon: FaShieldAlt,
        title: "Tuân thủ tiêu chuẩn",
        desc: "PCI DSS & GDPR Compliance",
        details: [
            "Tuân thủ PCI DSS Level 1",
            "Bảo vệ dữ liệu cá nhân (GDPR)",
            "Kiểm toán bảo mật định kỳ",
        ],
        color: "from-blue-200 to-blue-300",
    },
    {
        icon: FaKey,
        title: "Quản lý mật khẩu",
        desc: "Yêu cầu mật khẩu mạnh",
        details: [
            "Tối thiểu 8 ký tự, kết hợp chữ hoa, số, ký tự đặc biệt",
            "Mã hóa mật khẩu bằng bcrypt",
            "Tùy chọn đăng nhập sinh trắc học",
        ],
        color: "from-blue-100 to-blue-200",
    },
];
