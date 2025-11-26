import { motion } from "framer-motion";
import {
    FaLock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaEye,
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
    return (
        <div className="min-h-screen wisbook-gradient-overlay pt-20">
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative wisbook-card-gradient text-gray-800 py-20 overflow-hidden"
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-20 text-8xl">🔒</div>
                    <div className="absolute bottom-10 right-20 text-8xl">
                        🛡️
                    </div>
                    <div className="absolute top-1/3 right-1/4 text-6xl">
                        🔐
                    </div>
                    <div className="absolute bottom-1/3 left-1/4 text-6xl">
                        🔑
                    </div>
                </div>

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
                        >
                            <FaLock className="text-6xl mx-auto mb-6" />
                        </motion.div>

                        <h1 className="text-5xl font-bold mb-4">
                            Mua Sắm An Toàn
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Bảo mật thông tin khách hàng – Cam kết bảo vệ quyền
                            riêng tư tuyệt đối
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-16">
                {/* SECURITY PILLARS */}
                <motion.div className="mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center wisbook-gradient-text">
                        4 Trụ Cột Bảo Mật
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {securityPillars.map((pillar, i) => {
                            const Icon = pillar.icon;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl"
                                >
                                    <div
                                        className={`bg-gradient-to-r ${pillar.color} p-6 text-white`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-5xl">
                                                <Icon />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold">
                                                    {pillar.title}
                                                </h3>
                                                <p className="text-sm opacity-90">
                                                    {pillar.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <ul className="space-y-3">
                                            {pillar.details.map(
                                                (detail, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="flex items-start gap-2 text-gray-700"
                                                    >
                                                        <FaCheckCircle className="wisbook-gradient-text mt-1" />
                                                        {detail}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* DATA PROTECTION */}
                <motion.div className="bg-white rounded-xl shadow-xl p-8 mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center wisbook-gradient-text">
                        Cam Kết Bảo Vệ Dữ Liệu
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        {dataProtection.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-6 border-2 border-purple-100 rounded-lg"
                            >
                                <div className="text-5xl mb-4">{item.icon}</div>
                                <h3 className="text-lg font-bold">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600">
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
                                            transition={{ delay: i * 0.1 }}
                                            className="flex gap-3 p-4 bg-blue-50 border-l-4 border-blue-400 rounded"
                                        >
                                            <Icon className="text-green-600 text-xl" />
                                            <p className="text-gray-700">
                                                {tip.tip}
                                            </p>
                                        </motion.div>
                                    );
                                })}
                        </div>

                        {/* DON'T */}
                        <div>
                            <h3 className="text-xl font-bold text-red-700 mb-4 flex gap-2">
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
                                            transition={{ delay: i * 0.1 }}
                                            className="flex gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded"
                                        >
                                            <Icon className="text-red-600 text-xl" />
                                            <p className="text-gray-700">
                                                {tip.tip}
                                            </p>
                                        </motion.div>
                                    );
                                })}
                        </div>
                    </div>
                </motion.div>

                {/* CERTIFICATIONS */}
                <motion.div className="bg-white border-2 border-purple-100 rounded-xl p-8 mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center wisbook-gradient-text">
                        Chứng Nhận & Tiêu Chuẩn
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        {certifications.map((cert, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`${cert.color} p-6 rounded-lg text-center`}
                            >
                                <div className="text-4xl mb-3">🏆</div>
                                <h3 className="font-bold text-lg">
                                    {cert.name}
                                </h3>
                                <p className="text-sm">{cert.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* MONITORING */}
                <motion.div className="bg-white border-2 border-purple-100 rounded-lg p-8 mb-16">
                    <div className="flex gap-6">
                        <FaEye className="text-6xl" />
                        <div>
                            <h2 className="text-2xl font-bold mb-4">
                                Giám Sát 24/7
                            </h2>

                            <p className="text-gray-700 mb-4">
                                Hệ thống giám sát bảo mật hoạt động liên tục,
                                phát hiện và ngăn chặn các mối đe dọa.
                            </p>

                            <ul className="space-y-2 text-gray-700">
                                <li className="flex gap-2">
                                    <FaCheckCircle className="text-blue-600" />{" "}
                                    Phát hiện xâm nhập tự động (IDS/IPS)
                                </li>
                                <li className="flex gap-2">
                                    <FaCheckCircle className="text-blue-600" />{" "}
                                    Sao lưu dữ liệu hàng ngày
                                </li>
                                <li className="flex gap-2">
                                    <FaCheckCircle className="text-blue-600" />{" "}
                                    Cập nhật bảo mật liên tục
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* CONTACT BLOCK */}
                <motion.div className="bg-white rounded-xl shadow-xl p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">
                        Phát hiện vấn đề bảo mật?
                    </h2>

                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Nếu bạn phát hiện bất kỳ lỗ hổng hoặc nghi ngờ tài khoản
                        bị xâm nhập, hãy liên hệ ngay.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg shadow-lg">
                            Báo cáo sự cố bảo mật
                        </button>

                        <button className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg shadow-lg">
                            security@wisdombooks.vn
                        </button>
                    </div>
                </motion.div>

                {/* BACK BUTTON */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mt-12"
                >
                    <Link
                        to="/"
                        className="inline-block wisbook-btn-gradient font-semibold px-8 py-3 rounded-lg shadow-lg"
                    >
                        Quay lại trang chủ
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
