import { motion, Variants } from "framer-motion";
import { FaSyncAlt, FaCheckCircle, FaUndo } from "react-icons/fa";
import { Link } from "react-router-dom";

// 📌 IMPORT DỮ LIỆU TỪ FILE RIÊNG
import {
    returnConditions,
    returnReasons,
    returnSteps,
} from "../../data/service/return";

export default function ReturnPolicyPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

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
            {/* Hero Section với floating books */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative bg-blue-600 text-white py-24 overflow-hidden"
            >
                {/* Floating book decorations */}
                <motion.div
                    className="absolute top-10 left-10 text-7xl opacity-30"
                    variants={floatAnimation}
                    animate="float"
                >
                    📚
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
                    🔄
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
                    ✅
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
                    📦
                </motion.div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="inline-block"
                        >
                            <FaSyncAlt className="text-7xl mx-auto mb-6" />
                        </motion.div>
                        <h1 className="text-6xl font-bold mb-4">
                            Chính Sách Đổi Trả
                        </h1>
                        <p className="text-2xl max-w-2xl mx-auto opacity-90">
                            🔄 Đổi trả dễ dàng trong 7 ngày - Quyền lợi của bạn
                            là ưu tiên hàng đầu
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-16">
                {/* 📌 Điều Kiện Đổi Trả */}
                {/* 📌 Điều Kiện Đổi Trả với book theme */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-8 mb-16"
                >
                    {returnConditions.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.05,
                                    y: -10,
                                    boxShadow:
                                        "0 20px 40px rgba(37, 99, 235, 0.2)",
                                }}
                                className="bg-white border-2 border-transparent hover:border-blue-600 p-8 rounded-2xl shadow-lg transition-all relative group cursor-pointer"
                            >
                                {/* Book emoji decoration */}
                                <motion.div
                                    className="absolute top-3 right-3 text-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                >
                                    📚
                                </motion.div>

                                <motion.div
                                    className="text-blue-600 text-6xl mb-4"
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
                                <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.desc}
                                </p>

                                {/* Hover background overlay */}
                                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl -z-10" />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* 📌 Các lý do được đổi trả với book theme */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-2xl p-10 mb-16 border border-blue-100 relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 text-blue-100 text-9xl opacity-20 -mr-10 -mt-10">
                        ✅
                    </div>

                    <h2 className="text-4xl font-bold mb-8 text-gray-800 flex items-center gap-3 relative z-10">
                        <FaCheckCircle className="text-blue-600" />
                        Trường Hợp Được Đổi Trả
                    </h2>

                    <div className="grid md:grid-cols-2 gap-5 relative z-10">
                        {returnReasons.map((reason, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring" }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                className="flex items-start gap-4 p-5 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all cursor-pointer border-2 border-transparent hover:border-blue-600"
                            >
                                <motion.div
                                    className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 text-lg font-bold shadow-lg"
                                    whileHover={{ rotate: 360, scale: 1.2 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                    }}
                                >
                                    ✓
                                </motion.div>
                                <p className="text-gray-800 font-medium leading-relaxed flex items-center gap-2">
                                    📖 {reason}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 📌 Quy trình đổi trả với timeline effect */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 relative"
                >
                    <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 flex items-center justify-center gap-3">
                        <FaUndo className="text-blue-600" />
                        Quy Trình Đổi Trả
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {returnSteps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: i * 0.15,
                                    duration: 0.6,
                                    type: "spring",
                                }}
                                whileHover={{
                                    scale: 1.08,
                                    y: -10,
                                    boxShadow:
                                        "0 20px 40px rgba(37, 99, 235, 0.3)",
                                }}
                                className="relative"
                            >
                                <div className="bg-blue-600 rounded-2xl p-8 text-white h-full shadow-xl relative overflow-hidden group cursor-pointer">
                                    {/* Book emoji decoration */}
                                    <motion.div
                                        className="absolute top-2 right-2 text-4xl opacity-30"
                                        animate={{ rotate: [0, 360] }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    >
                                        📚
                                    </motion.div>

                                    <div className="relative z-10">
                                        <motion.div
                                            className="text-sm font-bold mb-3 opacity-80 bg-white/20 px-4 py-1 rounded-full inline-block"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {step.step}
                                        </motion.div>
                                        <h3 className="text-2xl font-bold mb-4 leading-tight">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm opacity-90 leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>

                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                {/* Step connector */}
                                {i < returnSteps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-1 bg-blue-300 z-10">
                                        <motion.div
                                            className="h-full bg-blue-600"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "100%" }}
                                            transition={{
                                                delay: i * 0.15 + 0.3,
                                                duration: 0.5,
                                            }}
                                        />
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full"></div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 📌 Lưu ý quan trọng */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-10 mb-16 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 text-9xl opacity-10">
                        ⚠️
                    </div>

                    <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3 relative z-10">
                        ⚠️ Lưu Ý Quan Trọng
                    </h2>

                    <ul className="space-y-4 text-gray-800 relative z-10">
                        <motion.li
                            className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02, x: 5 }}
                        >
                            <span className="text-orange-600 font-bold text-2xl">
                                •
                            </span>
                            <span className="leading-relaxed">
                                📹 Khách hàng vui lòng quay video khi mở hàng để
                                làm bằng chứng
                            </span>
                        </motion.li>

                        <motion.li
                            className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                        >
                            <span className="text-orange-600 font-bold text-2xl">
                                •
                            </span>
                            <span className="leading-relaxed">
                                🚫 Không áp dụng đổi trả cho sách sale đặc biệt
                                (trừ lỗi từ shop)
                            </span>
                        </motion.li>

                        <motion.li
                            className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                        >
                            <span className="text-orange-600 font-bold text-2xl">
                                •
                            </span>
                            <span className="leading-relaxed">
                                💰 Shop chịu phí nếu lỗi từ shop, khách chịu phí
                                nếu đổi ý
                            </span>
                        </motion.li>
                    </ul>
                </motion.div>

                {/* 📌 Back to home */}
                <div className="text-center">
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
                </div>
            </div>
        </div>
    );
}
