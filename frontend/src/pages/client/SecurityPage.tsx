import { motion, Variants } from "framer-motion";
import {
    FaLock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaEye,
    FaShieldAlt,
    FaUserShield,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// 🟦 IMPORT DỮ LIỆU
import {
    securityPillars,
    dataProtection,
    securityTips,
    certifications,
} from "../../data/service/security";

export default function SecurityPage() {
    const floatAnimation: Variants = {
        float: {
            y: [-10, 10],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse" as const,
                ease: "easeInOut",
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* HEADER với floating animations */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative bg-blue-600 text-white py-24 overflow-hidden"
            >
                {/* Floating decorations */}
                <motion.div
                    className="absolute top-10 left-10 text-7xl opacity-30"
                    variants={floatAnimation}
                    animate="float"
                >
                    🔒
                </motion.div>
                <motion.div
                    className="absolute top-20 right-20 text-6xl opacity-20"
                    animate={{
                        y: [-10, 10],
                        transition: {
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse" as const,
                            ease: "easeInOut",
                            delay: 0.3,
                        },
                    }}
                >
                    📚
                </motion.div>
                <motion.div
                    className="absolute bottom-10 left-1/4 text-5xl opacity-25"
                    animate={{
                        y: [-10, 10],
                        transition: {
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse" as const,
                            ease: "easeInOut",
                            delay: 0.6,
                        },
                    }}
                >
                    🛡️
                </motion.div>
                <motion.div
                    className="absolute bottom-20 right-1/3 text-8xl opacity-15"
                    animate={{
                        y: [-10, 10],
                        transition: {
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse" as const,
                            ease: "easeInOut",
                            delay: 0.9,
                        },
                    }}
                >
                    🔐
                </motion.div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-block"
                        >
                            <FaLock className="text-7xl mx-auto mb-6" />
                        </motion.div>

                        <h1 className="text-6xl font-bold mb-4">
                            Mua Sắm An Toàn
                        </h1>

                        <p className="text-2xl max-w-2xl mx-auto opacity-90">
                            🔒 Bảo mật thông tin khách hàng – Cam kết bảo vệ
                            quyền riêng tư tuyệt đối
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-16">
                {/* SECURITY PILLARS với book theme */}
                <motion.div className="mb-16">
                    <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 flex items-center justify-center gap-3">
                        <FaShieldAlt className="text-blue-600" />4 Trụ Cột Bảo
                        Mật
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {securityPillars.map((pillar, i) => {
                            const Icon = pillar.icon;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: i * 0.1,
                                        type: "spring",
                                    }}
                                    whileHover={{
                                        scale: 1.03,
                                        y: -5,
                                        boxShadow:
                                            "0 20px 40px rgba(37, 99, 235, 0.2)",
                                    }}
                                    className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-transparent hover:border-blue-600 transition-all relative group"
                                >
                                    {/* Book decoration */}
                                    <motion.div
                                        className="absolute top-3 right-3 text-4xl opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                        }}
                                    >
                                        📚
                                    </motion.div>

                                    <div className="bg-blue-600 p-8 text-white relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-50" />

                                        <div className="flex items-center gap-4 relative z-10">
                                            <motion.div
                                                className="text-6xl"
                                                animate={{ rotateY: [0, 360] }}
                                                transition={{
                                                    duration: 20,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                    delay: i * 0.5,
                                                }}
                                            >
                                                <Icon />
                                            </motion.div>
                                            <div>
                                                <h3 className="text-3xl font-bold">
                                                    {pillar.title}
                                                </h3>
                                                <p className="text-sm opacity-90 mt-1">
                                                    {pillar.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 relative">
                                        <ul className="space-y-4">
                                            {pillar.details.map(
                                                (detail, idx) => (
                                                    <motion.li
                                                        key={idx}
                                                        initial={{
                                                            opacity: 0,
                                                            x: -10,
                                                        }}
                                                        whileInView={{
                                                            opacity: 1,
                                                            x: 0,
                                                        }}
                                                        viewport={{
                                                            once: true,
                                                        }}
                                                        transition={{
                                                            delay: idx * 0.1,
                                                        }}
                                                        whileHover={{ x: 5 }}
                                                        className="flex items-start gap-3 text-gray-700"
                                                    >
                                                        <FaCheckCircle className="text-blue-600 mt-1 text-lg shrink-0" />
                                                        <span className="leading-relaxed">
                                                            📖 {detail}
                                                        </span>
                                                    </motion.li>
                                                )
                                            )}
                                        </ul>

                                        {/* Hover background */}
                                        <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* DATA PROTECTION với book theme */}
                <motion.div className="bg-white rounded-2xl shadow-2xl p-10 mb-16 border border-blue-100">
                    <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 flex items-center justify-center gap-3">
                        <FaUserShield className="text-blue-600" />
                        Cam Kết Bảo Vệ Dữ Liệu
                    </h2>

                    <div className="grid md:grid-cols-4 gap-8">
                        {dataProtection.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring" }}
                                whileHover={{
                                    scale: 1.1,
                                    y: -10,
                                    boxShadow:
                                        "0 15px 30px rgba(37, 99, 235, 0.2)",
                                }}
                                className="text-center p-8 border-2 border-transparent hover:border-blue-600 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer relative group"
                            >
                                <motion.div
                                    className="absolute top-2 right-2 text-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                                    animate={{ rotate: [0, 360] }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                >
                                    📚
                                </motion.div>

                                <motion.div
                                    className="text-6xl mb-4 inline-block"
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                    }}
                                >
                                    {item.icon}
                                </motion.div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* SECURITY TIPS */}
                <motion.div className="mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center wisbook-gradient-text">
                        Hướng Dẫn Bảo Mật Cho Khách Hàng
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* DO */}
                        <div>
                            <h3 className="text-xl font-bold wisbook-gradient-text mb-4 flex gap-2">
                                <FaCheckCircle /> NÊN LÀM
                            </h3>

                            {securityTips
                                .filter((t) => t.type === "do")
                                .map((tip, i) => {
                                    const Icon = tip.icon;
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                delay: i * 0.1,
                                                type: "spring",
                                            }}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            className="flex gap-4 p-5 bg-blue-50 border-l-4 border-blue-600 rounded-r-xl hover:bg-blue-100 transition-all cursor-pointer shadow-sm"
                                        >
                                            <Icon className="text-blue-600 text-2xl shrink-0" />
                                            <p className="text-gray-800 leading-relaxed">
                                                📖 {tip.tip}
                                            </p>
                                        </motion.div>
                                    );
                                })}
                        </div>

                        {/* DON'T */}
                        <div>
                            <h3 className="text-2xl font-bold text-red-700 mb-6 flex gap-3 items-center">
                                <FaExclamationTriangle /> KHÔNG NÊN LÀM
                            </h3>

                            {securityTips
                                .filter((t) => t.type === "dont")
                                .map((tip, i) => {
                                    const Icon = tip.icon;
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                delay: i * 0.1,
                                                type: "spring",
                                            }}
                                            whileHover={{ scale: 1.02, x: -5 }}
                                            className="flex gap-4 p-5 bg-red-50 border-l-4 border-red-600 rounded-r-xl hover:bg-red-100 transition-all cursor-pointer shadow-sm"
                                        >
                                            <Icon className="text-red-600 text-2xl shrink-0" />
                                            <p className="text-gray-800 leading-relaxed">
                                                ⛔ {tip.tip}
                                            </p>
                                        </motion.div>
                                    );
                                })}
                        </div>
                    </div>
                </motion.div>

                {/* CERTIFICATIONS với book theme */}
                <motion.div className="bg-white border-2 border-blue-100 rounded-2xl p-10 mb-16 shadow-xl">
                    <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
                        🏆 Chứng Nhận & Tiêu Chuẩn
                    </h2>

                    <div className="grid md:grid-cols-4 gap-8">
                        {certifications.map((cert, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring" }}
                                whileHover={{
                                    scale: 1.1,
                                    y: -10,
                                    boxShadow:
                                        "0 15px 30px rgba(37, 99, 235, 0.2)",
                                }}
                                className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl text-center border-2 border-blue-200 hover:border-blue-600 transition-all cursor-pointer relative group"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                    }}
                                    className="text-5xl mb-4"
                                >
                                    🏆
                                </motion.div>
                                <h3 className="font-bold text-xl text-gray-800 mb-2">
                                    {cert.name}
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {cert.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* MONITORING với book theme */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white border-2 border-blue-100 rounded-2xl p-10 mb-16 shadow-xl"
                >
                    <div className="flex gap-8 items-start">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <FaEye className="text-7xl text-blue-600" />
                        </motion.div>
                        <div>
                            <h2 className="text-3xl font-bold mb-4 text-gray-800">
                                Giám Sát 24/7
                            </h2>

                            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                                Hệ thống giám sát bảo mật hoạt động liên tục,
                                phát hiện và ngăn chặn các mối đe dọa.
                            </p>

                            <ul className="space-y-3">
                                <motion.li
                                    className="flex gap-3 items-center text-gray-700"
                                    whileHover={{ x: 5 }}
                                >
                                    <FaCheckCircle className="text-blue-600 text-xl" />
                                    <span className="text-lg">
                                        📖 Phát hiện xâm nhập tự động (IDS/IPS)
                                    </span>
                                </motion.li>
                                <motion.li
                                    className="flex gap-3 items-center text-gray-700"
                                    whileHover={{ x: 5 }}
                                >
                                    <FaCheckCircle className="text-blue-600 text-xl" />
                                    <span className="text-lg">
                                        📖 Sao lưu dữ liệu hàng ngày
                                    </span>
                                </motion.li>
                                <motion.li
                                    className="flex gap-3 items-center text-gray-700"
                                    whileHover={{ x: 5 }}
                                >
                                    <FaCheckCircle className="text-blue-600 text-xl" />
                                    <span className="text-lg">
                                        📖 Cập nhật bảo mật liên tục
                                    </span>
                                </motion.li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* CONTACT BLOCK với book theme */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl p-10 text-center mb-16 border-2 border-blue-200"
                >
                    <h2 className="text-3xl font-bold mb-4 text-blue-600">
                        Phát hiện vấn đề bảo mật?
                    </h2>

                    <p className="text-gray-700 mb-6 max-w-2xl mx-auto text-lg leading-relaxed">
                        Nếu bạn phát hiện bất kỳ lỗ hổng hoặc nghi ngờ tài khoản
                        bị xâm phạm, vui lòng liên hệ ngay:
                    </p>

                    <motion.a
                        href="mailto:security@wisbook.com"
                        className="inline-flex items-center gap-3 bg-blue-600 text-white font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl hover:bg-blue-700 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>📧 security@wisbook.com</span>
                    </motion.a>
                </motion.div>

                {/* BACK BUTTON */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-3 bg-blue-600 text-white font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl hover:bg-blue-700 transition-all group"
                        >
                            <span>Quay lại trang chủ</span>
                            <motion.span
                                animate={{ x: [0, -5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                🏠
                            </motion.span>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
