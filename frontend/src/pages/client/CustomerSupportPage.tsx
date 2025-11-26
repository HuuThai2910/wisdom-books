import { motion } from "framer-motion";
import { FaLifeRing, FaQuestionCircle } from "react-icons/fa";
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

    return (
        <div className="min-h-screen wisbook-gradient-overlay pt-20">
            {/* HEADER */}
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
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1,
                            }}
                        >
                            <FaLifeRing className="text-6xl mx-auto mb-6" />
                        </motion.div>

                        <h1 className="text-5xl font-bold mb-4">
                            Hỗ Trợ Khách Hàng 24/7
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Giải đáp thắc mắc mọi lúc - Đội ngũ tư vấn chuyên
                            nghiệp luôn sẵn sàng
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* BODY */}
            <div className="container mx-auto px-4 py-16">
                {/* FEATURES */}
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
                                className="bg-white border-2 border-blue-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
                            >
                                <div className="text-indigo-600 text-5xl mb-4">
                                    <Icon />
                                </div>

                                <h3 className="text-xl font-bold mb-2 text-gray-800">
                                    {feature.title}
                                </h3>

                                <p className="text-gray-600">{feature.desc}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* CONTACT METHODS */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
                        Kênh Liên Hệ
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
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
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    className={`bg-gradient-to-br ${method.color} ${method.hoverColor}
                                        rounded-xl p-8 text-white shadow-xl transition-all cursor-pointer`}
                                >
                                    <div className="text-5xl mb-4">
                                        <Icon />
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2">
                                        {method.title}
                                    </h3>

                                    <p className="text-xl font-semibold mb-2">
                                        {method.info}
                                    </p>

                                    <p className="text-sm opacity-90">
                                        {method.desc}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* FAQ */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-lg shadow-xl p-8 mb-16"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                        Câu Hỏi Thường Gặp
                    </h2>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="border-l-4 border-blue-400 bg-blue-50 p-6 rounded-r-lg hover:bg-blue-100 transition-colors"
                            >
                                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-start gap-2">
                                    <FaQuestionCircle className="text-blue-500 flex-shrink-0 mt-1" />
                                    {faq.question}
                                </h3>

                                <p className="text-gray-700 ml-7">
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
