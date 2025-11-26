import {
    FaPhone,
    FaEnvelope,
    FaFacebookMessenger
} from "react-icons/fa";

export const contactMethods = [
    {
        icon: FaPhone,
        title: "Hotline",
        info: "1900-xxxx",
        desc: "Miễn phí cả ngày lẫn đêm",
        color: "from-blue-400 to-blue-500",
        hoverColor: "hover:from-blue-500 hover:to-blue-600",
    },
    {
        icon: FaEnvelope,
        title: "Email",
        info: "support@wisdombooks.vn",
        desc: "Phản hồi trong 2 giờ",
        color: "from-blue-300 to-blue-400",
        hoverColor: "hover:from-blue-400 hover:to-blue-500",
    },
    {
        icon: FaFacebookMessenger,
        title: "Messenger",
        info: "m.me/wisdombooks",
        desc: "Chat trực tiếp với tư vấn viên",
        color: "from-blue-200 to-blue-300",
        hoverColor: "hover:from-blue-300 hover:to-blue-400",
    },
];
