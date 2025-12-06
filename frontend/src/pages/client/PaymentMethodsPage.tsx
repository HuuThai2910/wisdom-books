import { motion } from "framer-motion";
import {
    FaCheckCircle,
    FaCreditCard,
    FaShieldAlt,
    FaWallet,
    FaMobileAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// 🟦 IMPORT DỮ LIỆU
import {
    paymentMethods,
    securityFeatures,
    paymentSteps,
    promotions,
} from "../../data/service/payment";

export default function PaymentMethodsPage() {
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
                    💳
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
                    📚
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
                    💰
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
                    🏦
                </motion.div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{ rotateY: [0, 360] }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="inline-block"
                        >
                            <FaCreditCard className="text-7xl mx-auto mb-6" />
                        </motion.div>
                        <h1 className="text-6xl font-bold mb-4">
                            Phương Thức Thanh Toán
                        </h1>
                        <p className="text-2xl max-w-2xl mx-auto opacity-90">
                            💳 Linh hoạt, an toàn và tiện lợi - Chọn cách thanh
                            toán phù hợp với bạn
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-16">
                {/* PAYMENT METHODS với book theme */}
                <motion.div className="mb-16">
                    <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 flex items-center justify-center gap-3">
                        <FaWallet className="text-blue-600" />
                        Các Phương Thức Thanh Toán
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {paymentMethods.map((method, i) => {
                            const Icon = method.icon;

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
                                        {/* Subtle gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-50" />

                                        <div className="flex items-center gap-4 mb-4 relative z-10">
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
                                                    {method.title}
                                                </h3>
                                                <p className="text-sm opacity-90 mt-1">
                                                    {method.desc}
                                                </p>
                                            </div>
                                        </div>

                                        {method.logos.length > 0 && (
                                            <div className="flex gap-4 mt-4 text-5xl relative z-10">
                                                {method.logos.map(
                                                    (Logo, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            whileHover={{
                                                                scale: 1.2,
                                                                rotate: 10,
                                                            }}
                                                        >
                                                            <Logo />
                                                        </motion.div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 relative">
                                        <h4 className="font-bold text-xl mb-4 text-gray-800">
                                            Ưu điểm:
                                        </h4>

                                        <ul className="space-y-3">
                                            {method.features.map(
                                                (feature, idx) => (
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
                                                        <FaCheckCircle className="text-blue-600 mt-1 shrink-0 text-lg" />
                                                        <span className="leading-relaxed">
                                                            📖 {feature}
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

                {/* SECURITY FEATURES với book theme */}
                <motion.div className="mb-16">
                    <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 flex items-center justify-center gap-3">
                        <FaShieldAlt className="text-blue-600" />
                        Bảo Mật Tuyệt Đối
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {securityFeatures.map((feature, i) => {
                            const Icon = feature.icon;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: i * 0.1,
                                        type: "spring",
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        y: -10,
                                        boxShadow:
                                            "0 20px 40px rgba(37, 99, 235, 0.2)",
                                    }}
                                    className="bg-white border-2 border-transparent hover:border-blue-600 p-8 rounded-2xl text-center shadow-lg transition-all relative group cursor-pointer"
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
                                        className="text-blue-600 text-6xl mb-4 inline-block"
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
                    </div>
                </motion.div>

                {/* STEPS với timeline animation */}
                <motion.div className="bg-white rounded-2xl shadow-2xl p-10 mb-16 border border-blue-100">
                    <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 flex items-center justify-center gap-3">
                        <FaMobileAlt className="text-blue-600" />
                        Quy Trình Thanh Toán
                    </h2>

                    <div className="grid md:grid-cols-4 gap-8">
                        {paymentSteps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, type: "spring" }}
                                whileHover={{ scale: 1.1, y: -10 }}
                                className="text-center relative"
                            >
                                <motion.div
                                    className="text-7xl mb-4"
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                    }}
                                >
                                    {step.image}
                                </motion.div>

                                <motion.div
                                    className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg"
                                    whileHover={{ scale: 1.2, rotate: 360 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                    }}
                                >
                                    {step.step}
                                </motion.div>

                                <h3 className="font-bold text-xl mb-2 text-gray-800">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {step.desc}
                                </p>

                                {i < paymentSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 -right-4 w-8 h-1 bg-blue-300 z-10">
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
