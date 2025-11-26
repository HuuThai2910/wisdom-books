import { motion } from "framer-motion";
import { FaSyncAlt } from "react-icons/fa";
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

    return (
        <div className="min-h-screen wisbook-gradient-overlay pt-20">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative wisbook-card-gradient text-gray-800 py-20 overflow-hidden"
            >
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center"
                    >
                        <FaSyncAlt className="text-6xl mx-auto mb-6 animate-spin-slow" />
                        <h1 className="text-5xl font-bold mb-4">
                            Chính Sách Đổi Trả
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Đổi trả dễ dàng trong 7 ngày - Quyền lợi của bạn là
                            ưu tiên hàng đầu
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-16">
                {/* 📌 Điều Kiện Đổi Trả */}
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
                                className="bg-white border-2 border-blue-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
                            >
                                <div className="text-green-600 text-5xl mb-4">
                                    <Icon />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-gray-800">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* 📌 Các lý do được đổi trả */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-lg shadow-xl p-8 mb-16"
                >
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">
                        Trường Hợp Được Đổi Trả
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {returnReasons.map((reason, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-3 p-4 wisbook-card-gradient rounded-lg"
                            >
                                <div className="w-6 h-6 wisbook-icon-gradient text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    ✓
                                </div>
                                <p className="text-gray-700">{reason}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 📌 Quy trình đổi trả */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
                        Quy Trình Đổi Trả
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {returnSteps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.6 }}
                                className="relative"
                            >
                                <div
                                    className={`bg-gradient-to-br ${step.color} rounded-lg p-6 text-white h-full shadow-lg hover:shadow-xl transition-shadow`}
                                >
                                    <div className="text-sm font-semibold mb-2 opacity-90">
                                        {step.step}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm opacity-90">
                                        {step.desc}
                                    </p>
                                </div>

                                {i < returnSteps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gray-300 z-10">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rotate-45"></div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 📌 Lưu ý */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white border-2 border-blue-100 rounded-lg p-8"
                >
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        Lưu Ý Quan Trọng
                    </h2>

                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-3">
                            <span className="text-green-600 font-bold">•</span>
                            <span>
                                Khách hàng vui lòng quay video khi mở hàng để
                                làm bằng chứng
                            </span>
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="text-green-600 font-bold">•</span>
                            <span>
                                Không áp dụng đổi trả cho sách sale đặc biệt
                                (trừ lỗi từ shop)
                            </span>
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="text-green-600 font-bold">•</span>
                            <span>
                                Shop chịu phí nếu lỗi từ shop, khách chịu phí
                                nếu đổi ý
                            </span>
                        </li>
                    </ul>
                </motion.div>

                {/* 📌 Back to home */}
                <div className="text-center mt-12">
                    <Link
                        to="/"
                        className="inline-block wisbook-btn-gradient font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl"
                    >
                        Quay lại trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}
