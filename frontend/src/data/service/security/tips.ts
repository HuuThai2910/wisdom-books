import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export const securityTips = [
    { icon: FaCheckCircle, tip: "Sử dụng mật khẩu mạnh và duy nhất", type: "do" },
    { icon: FaCheckCircle, tip: "Bật xác thực 2 lớp (OTP)", type: "do" },
    { icon: FaCheckCircle, tip: "Đăng xuất khi dùng máy công cộng", type: "do" },
    { icon: FaCheckCircle, tip: "Kiểm tra HTTPS trước khi nhập thông tin", type: "do" },

    { icon: FaExclamationTriangle, tip: "Không chia sẻ mật khẩu/OTP", type: "dont" },
    { icon: FaExclamationTriangle, tip: "Không bấm link lạ trong email/SMS", type: "dont" },
    { icon: FaExclamationTriangle, tip: "Không dùng WiFi công cộng để giao dịch", type: "dont" },
    { icon: FaExclamationTriangle, tip: "Không lưu thông tin thẻ trên trình duyệt yếu", type: "dont" },
];
