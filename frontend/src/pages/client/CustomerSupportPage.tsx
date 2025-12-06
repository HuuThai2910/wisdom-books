import { motion } from "framer-motion";
import { FaLifeRing, FaQuestionCircle, FaComments } from "react-icons/fa";
import { Link } from "react-router-dom";

// ⭐ IMPORT DỮ LIỆU
import {
    contactMethods,
    faqs,
    supportFeatures,
} from "../../data/service/support/index";

export default function CustomerSupportPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
    };

    const floatAnimation = {
        y: [-10, 10],
        transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut",
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
                    animate={floatAnimation}
                >
                    📚
                </motion.div>
                <motion.div
                    className="absolute top-20 right-20 text-6xl opacity-20"
                    animate={{
                        ...floatAnimation,
                        transition: {
                            ...floatAnimation.transition,
                            delay: 0.3,
                        },
                    }}
                >
                    💬
                </motion.div>
                <motion.div
                    className="absolute bottom-10 left-1/4 text-5xl opacity-25"
                    animate={{
                        ...floatAnimation,
                        transition: {
                            ...floatAnimation.transition,
                            delay: 0.6,
                        },
                    }}
                >
                    📞
                </motion.div>
                <motion.div
                    className="absolute bottom-20 right-1/3 text-8xl opacity-15"
                    animate={{
                        ...floatAnimation,
                        transition: {
                            ...floatAnimation.transition,
                            delay: 0.9,
                        },
                    }}
                >
                    🎧
                </motion.div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1,
                            }}
                            className="inline-block"
                        >
                            <FaLifeRing className="text-7xl mx-auto mb-6" />
                        </motion.div>

                        <h1 className="text-6xl font-bold mb-4">
                            Hỗ Trợ Khách Hàng 24/7
                        </h1>
                        <p className="text-2xl max-w-2xl mx-auto opacity-90">
                            💡 Giải đáp thắc mắc mọi lúc - Đội ngũ tư vấn chuyên
                            nghiệp luôn sẵn sàng
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* BODY */}
            <div className="container mx-auto px-4 py-16">
                {/* FEATURES với book theme */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-8 mb-16"
                >
                    {supportFeatures.map((feature, i) => {
                        const Icon = feature.icon;

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
                                {/* Book decoration */}
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
                                    {feature.title}
                                </h3>

                                <p className="text-gray-600 leading-relaxed">
                                    {feature.desc}
                                </p>

                                {/* Hover background */}
                                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl -z-10" />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* CONTACT METHODS với book theme */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 flex items-center justify-center gap-3">
                        <FaComments className="text-blue-600" />
                        Kênh Liên Hệ
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {contactMethods.map((method, i) => {
                            const Icon = method.icon;

                            return (
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
                                            "0 20px 40px rgba(37, 99, 235, 0.4)",
                                    }}
                                    className="bg-blue-600 rounded-2xl p-10 text-white shadow-2xl transition-all cursor-pointer relative overflow-hidden group"
                                >
                                    {/* Floating book decoration */}
                                    <motion.div
                                        className="absolute top-3 right-3 text-5xl opacity-20"
                                        animate={{ y: [-5, 5] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                        }}
                                    >
                                        📚
                                    </motion.div>

                                    <motion.div
                                        className="text-6xl mb-5 relative z-10"
                                        animate={{ rotate: [0, 360] }}
                                        transition={{
                                            duration: 20,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    >
                                        <Icon />
                                    </motion.div>

                                    <h3 className="text-2xl font-bold mb-3 relative z-10">
                                        {method.title}
                                    </h3>

                                    <p className="text-xl font-semibold mb-3 relative z-10">
                                        {method.info}
                                    </p>

                                    <p className="text-sm opacity-90 leading-relaxed relative z-10">
                                        {method.desc}
                                    </p>

                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* FAQ với book theme */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-2xl p-10 mb-16 border border-blue-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 text-9xl opacity-10 text-blue-100">
                        ❓
                    </div>

                    <h2 className="text-4xl font-bold mb-10 text-center text-gray-800 flex items-center justify-center gap-3 relative z-10">
                        <FaQuestionCircle className="text-blue-600" />
                        Câu Hỏi Thường Gặp
                    </h2>

                    <div className="space-y-5 relative z-10">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring" }}
                                whileHover={{
                                    scale: 1.02,
                                    x: 5,
                                    borderColor: "#2563eb",
                                }}
                                className="border-l-4 border-blue-600 bg-blue-50 p-6 rounded-r-2xl hover:bg-blue-100 transition-all cursor-pointer shadow-md hover:shadow-xl group"
                            >
                                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-start gap-3 group-hover:text-blue-600 transition-colors">
                                    <motion.div
                                        whileHover={{ rotate: 360, scale: 1.2 }}
                                        transition={{ type: "spring" }}
                                    >
                                        <FaQuestionCircle className="text-blue-600 shrink-0 mt-1" />
                                    </motion.div>
                                    <span>📖 {faq.question}</span>
                                </h3>

                                <p className="text-gray-700 ml-10 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* FOOTER */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
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
