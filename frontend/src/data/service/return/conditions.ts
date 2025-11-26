import { FaBoxOpen, FaClipboardCheck, FaShieldAlt } from "react-icons/fa";

export const returnConditions = [
    {
        icon: FaBoxOpen,
        title: "Sách còn nguyên vẹn",
        desc: "Sách chưa qua sử dụng, không bị rách, gấp góc hoặc bẩn",
    },
    {
        icon: FaClipboardCheck,
        title: "Đầy đủ phụ kiện",
        desc: "Giữ nguyên bao bì, tem nhãn và các phụ kiện kèm theo (nếu có)",
    },
    {
        icon: FaShieldAlt,
        title: "Trong vòng 7 ngày",
        desc: "Kể từ ngày nhận hàng (theo dấu vận đơn)",
    },
];
