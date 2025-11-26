import { motion } from "framer-motion";
import { FaTelegramPlane } from "react-icons/fa";
import { Link } from "react-router-dom";

import {
    shippingBenefits,
    shippingZones,
    shippingSteps,
    shippingPartners,
} from "../../data/service/shipping/index";

export default function ShippingPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen wisbook-gradient-overlay pt-20">
            {/* HERO */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative wisbook-card-gradient text-gray-800 py-20 overflow-hidden"
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-8xl">🚀</div>
                    <div className="absolute bottom-10 right-10 text-8xl">
                        📦
                    </div>
                    <div className="absolute top-1/2 left-1/3 text-6xl">🚚</div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center"
                    >
                        <FaTelegramPlane className="text-6xl mx-auto mb-6" />
                        <h1 className="text-5xl font-bold mb-4">
                            Miễn Phí Giao Hàng
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Giao nhanh sách đến tận nơi - Cam kết chất lượng
                            dịch vụ tốt nhất
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* CONTENT */}
            <div className="container mx-auto px-4 py-16">
                {/* BENEFITS */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-8 mb-16"
                >
                    {shippingBenefits.map((benefit, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="wisbook-gradient-text text-5xl mb-4">
                                <benefit.icon />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-600">{benefit.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* SHIPPING ZONES */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-lg shadow-xl p-8 mb-16"
                >
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        Thời Gian & Phí Giao Hàng
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-800">
                                        Khu vực
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-800">
                                        Thời gian
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-800">
                                        Phí vận chuyển
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {shippingZones.map((zone, i) => (
                                    <motion.tr
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`border-b ${
                                            zone.highlight
                                                ? "bg-blue-50"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <td className="px-6 py-4 text-gray-800">
                                            {zone.zone}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {zone.time}
                                        </td>
                                        <td className="px-6 py-4 font-semibold wisbook-gradient-text">
                                            {zone.fee}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* SHIPPING STEPS */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white border-2 border-blue-100 rounded-lg p-8 mb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Quy Trình Giao Hàng
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        {shippingSteps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="text-center bg-white p-6 rounded-lg shadow-md"
                            >
                                <div className="text-5xl mb-3">
                                    {step.emoji}
                                </div>
                                <div className="w-12 h-12 wisbook-icon-gradient text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                    {step.step}
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* SHIPPING PARTNERS */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-lg shadow-xl p-8 mb-16"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Đối Tác Vận Chuyển
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6 text-center">
                        {shippingPartners.map((partner, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-all"
                            >
                                <div className="text-4xl mb-2">
                                    {partner.emoji}
                                </div>
                                <div className="font-semibold text-gray-800">
                                    {partner.name}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* BACK HOME BUTTON */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-12"
                >
                    <Link
                        to="/"
                        className="inline-block wisbook-btn-gradient font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl"
                    >
                        Quay lại trang chủ
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
