import {
    FaCreditCard,
    FaMoneyBillWave,
    FaMobileAlt,
    FaUniversity,
} from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";

export const paymentMethods = [
    {
        icon: FaCreditCard,
        title: "Thẻ tín dụng/ghi nợ",
        desc: "Visa, Mastercard, JCB, American Express",
        color: "from-blue-400 to-blue-500",
        features: [
            "Thanh toán nhanh chóng",
            "Bảo mật 3D Secure",
            "Hoàn tiền trong 1-3 ngày",
        ],
        logos: [SiVisa, SiMastercard],
    },
    {
        icon: FaMobileAlt,
        title: "Ví điện tử",
        desc: "MoMo, ZaloPay, VNPay, ShopeePay",
        color: "from-blue-300 to-blue-400",
        features: [
            "Ưu đãi hoàn tiền",
            "Tích điểm thưởng",
            "Liên kết ngân hàng dễ dàng",
        ],
        logos: [],
    },
    {
        icon: FaUniversity,
        title: "Chuyển khoản ngân hàng",
        desc: "Hỗ trợ tất cả ngân hàng tại Việt Nam",
        color: "from-blue-200 to-blue-300",
        features: [
            "Miễn phí giao dịch",
            "Chuyển nhanh 24/7",
            "Xác nhận tự động",
        ],
        logos: [],
    },
    {
        icon: FaMoneyBillWave,
        title: "Thanh toán khi nhận hàng (COD)",
        desc: "Trả tiền mặt khi nhận sách",
        color: "from-blue-100 to-blue-200",
        features: [
            "Kiểm tra hàng trước khi trả tiền",
            "An toàn, tiện lợi",
            "Phí COD: 15.000đ",
        ],
        logos: [],
    },
];
