// src/data/services.ts
import {
    FaSyncAlt,
    FaTelegramPlane,
    FaLifeRing,
    FaCreditCard,
    FaLock,
    FaBook,
} from "react-icons/fa";

export const serviceItems = [
    {
        icon: FaTelegramPlane,
        title: "Miễn phí giao hàng",
        desc: "Giao nhanh sách đến tận nơi",
        path: "/shipping",
    },
    {
        icon: FaSyncAlt,
        title: "Đổi trả trong 7 ngày",
        desc: "Hỗ trợ đổi trả khi sách lỗi",
        path: "/return-policy",
    },
    {
        icon: FaLifeRing,
        title: "Hỗ trợ 24/7",
        desc: "Giải đáp thắc mắc mọi lúc",
        path: "/customer-support",
    },
    {
        icon: FaCreditCard,
        title: "Thanh toán linh hoạt",
        desc: "Hỗ trợ nhiều hình thức thanh toán",
        path: "/payment-methods",
    },
    {
        icon: FaLock,
        title: "Mua sắm an toàn",
        desc: "Bảo mật thông tin khách hàng",
        path: "/security",
    },
    {
        icon: FaBook,
        title: "Kho sách phong phú",
        desc: "Hàng ngàn đầu sách cho bạn lựa chọn",
        path: "/book-collection",
    },
];
