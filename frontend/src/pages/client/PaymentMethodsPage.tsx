import { motion } from "framer-motion";
import { FaCheckCircle, FaCreditCard } from "react-icons/fa";
import { Link } from "react-router-dom";

// 🟦 IMPORT DỮ LIỆU
import {
    paymentMethods,
    securityFeatures,
    paymentSteps,
    promotions,
} from "../../data/service/payment";

export default function PaymentMethodsPage() {
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
                    <div className="absolute top-10 left-10 text-8xl">💳</div>
                    <div className="absolute bottom-10 right-10 text-8xl">
                        📱
                    </div>
                    <div className="absolute top-1/2 left-1/3 text-6xl">🏦</div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center"
                    >
                        <FaCreditCard className="text-6xl mx-auto mb-6" />
                        <h1 className="text-5xl font-bold mb-4">
                            Phương Thức Thanh Toán
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Linh hoạt, an toàn và tiện lợi - Chọn cách thanh
                            toán phù hợp với bạn
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-16">
                {/* PAYMENT METHODS */}
                <motion.div className="mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
                        Các Phương Thức Thanh Toán
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {paymentMethods.map((method, i) => {
                            const Icon = method.icon;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
                                >
                                    <div
                                        className={`bg-gradient-to-r ${method.color} p-6 text-white`}
                                    >
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="text-5xl">
                                                <Icon />
                                            </div>

                                            <div>
                                                <h3 className="text-2xl font-bold">
                                                    {method.title}
                                                </h3>
                                                <p className="text-sm opacity-90">
                                                    {method.desc}
                                                </p>
                                            </div>
                                        </div>

                                        {method.logos.length > 0 && (
                                            <div className="flex gap-4 mt-4 text-4xl">
                                                {method.logos.map(
                                                    (Logo, idx) => (
                                                        <Logo key={idx} />
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h4 className="font-semibold mb-3 text-gray-800">
                                            Ưu điểm:
                                        </h4>

                                        <ul className="space-y-2">
                                            {method.features.map(
                                                (feature, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="flex items-start gap-2 text-gray-700"
                                                    >
                                                        <FaCheckCircle className="wisbook-gradient-text mt-1 flex-shrink-0" />
                                                        <span>{feature}</span>
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

                {/* SECURITY FEATURES */}
                <motion.div className="mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
                        Bảo Mật Tuyệt Đối
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {securityFeatures.map((feature, i) => {
                            const Icon = feature.icon;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white border-2 border-purple-100 p-8 rounded-lg text-center hover:shadow-lg"
                                >
                                    <div className="wisbook-gradient-text text-5xl mb-4">
                                        <Icon />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-800">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* STEPS */}
                <motion.div className="bg-white rounded-xl shadow-xl p-8 mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
                        Quy Trình Thanh Toán
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        {paymentSteps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15 }}
                                className="text-center relative"
                            >
                                <div className="text-6xl mb-4">
                                    {step.image}
                                </div>

                                <div className="w-12 h-12 wisbook-icon-gradient text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                                    {step.step}
                                </div>

                                <h3 className="font-bold text-lg mb-2 text-gray-800">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600">{step.desc}</p>

                                {i < paymentSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 -right-3 w-6 h-0.5 bg-purple-300">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-300 rotate-45"></div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* PROMOTIONS */}
                <motion.div className="mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
                        Ưu Đãi Thanh Toán
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {promotions.map((promo, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className={`${promo.color} border-2 rounded-lg p-6 text-center hover:shadow-lg`}
                            >
                                <div className="text-2xl font-bold text-gray-800 mb-2">
                                    {promo.bank}
                                </div>

                                <div className="text-lg font-semibold text-red-600 mb-2">
                                    {promo.offer}
                                </div>

                                <div className="text-sm text-gray-600">
                                    {promo.condition}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* FOOTER */}
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
