import { motion } from "framer-motion";
import { FaBook, FaStar, FaFire, FaBookOpen, FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";

// IMPORT DATA
import {
    bookCategories,
    bookStats,
    bookFeatures,
    bookPublishers,
    bestSellers,
} from "../../data/service/bookCollection";

export default function BookCollectionPage() {
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
                    className="absolute top-10 left-10 text-9xl opacity-30"
                    animate={floatAnimation}
                >
                    📚
                </motion.div>
                <motion.div
                    className="absolute top-20 right-20 text-8xl opacity-20"
                    animate={{
                        ...floatAnimation,
                        transition: {
                            ...floatAnimation.transition,
                            delay: 0.3,
                        },
                    }}
                >
                    📖
                </motion.div>
                <motion.div
                    className="absolute bottom-10 left-1/4 text-7xl opacity-25"
                    animate={{
                        ...floatAnimation,
                        transition: {
                            ...floatAnimation.transition,
                            delay: 0.6,
                        },
                    }}
                >
                    ✨
                </motion.div>
                <motion.div
                    className="absolute bottom-20 right-1/3 text-6xl opacity-15"
                    animate={{
                        ...floatAnimation,
                        transition: {
                            ...floatAnimation.transition,
                            delay: 0.9,
                        },
                    }}
                >
                    📕
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
                            <FaBook className="text-7xl mx-auto mb-6" />
                        </motion.div>
                        <h1 className="text-6xl font-bold mb-4">
                            Kho Sách Phong Phú
                        </h1>
                        <p className="text-2xl max-w-2xl mx-auto opacity-90">
                            📚 Hàng ngàn đầu sách cho bạn lựa chọn - Từ học tập
                            đến giải trí
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-16">
                {/* Stats với book theme */}
                <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    {bookStats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, type: "spring" }}
                            whileHover={{
                                scale: 1.1,
                                y: -10,
                                boxShadow: "0 15px 30px rgba(37, 99, 235, 0.2)",
                            }}
                            className="bg-white p-8 rounded-2xl shadow-xl text-center border-2 border-transparent hover:border-blue-600 transition-all cursor-pointer relative group"
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
                                className="text-6xl mb-4"
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                }}
                            >
                                {stat.icon}
                            </motion.div>
                            <div className="text-4xl font-bold text-blue-600 mb-3">
                                {stat.number}
                            </div>
                            <div className="text-gray-600 font-medium text-lg">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Features với book theme */}
                <motion.div className="grid md:grid-cols-3 gap-8 mb-16">
                    {bookFeatures.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring" }}
                                whileHover={{
                                    scale: 1.05,
                                    y: -10,
                                    boxShadow:
                                        "0 20px 40px rgba(37, 99, 235, 0.2)",
                                }}
                                className="bg-white border-2 border-transparent hover:border-blue-600 p-8 rounded-2xl text-center shadow-lg transition-all relative group cursor-pointer"
                            >
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
                                    animate={{ rotateY: [0, 360] }}
                                    transition={{
                                        duration: 20,
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: i * 0.5,
                                    }}
                                    className="inline-block"
                                >
                                    <Icon className="text-blue-600 text-5xl mb-4 mx-auto" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.desc}
                                </p>

                                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl -z-10" />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Categories với book theme */}
                <motion.div className="mb-16">
                    <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 flex items-center justify-center gap-3">
                        <FaBookOpen className="text-blue-600" />
                        Danh Mục Sách
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bookCategories.map((category, i) => {
                            const Icon = category.icon;

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
                                    className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-transparent hover:border-blue-600 transition-all cursor-pointer relative group"
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
                                                <h3 className="text-2xl font-bold">
                                                    {category.title}
                                                </h3>
                                                <p className="text-sm opacity-90 mt-1">
                                                    {category.count}
                                                </p>
                                            </div>
                                        </div>
                                        <motion.div
                                            className="text-7xl text-center my-4 relative z-10"
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: i * 0.3,
                                            }}
                                        >
                                            {category.image}
                                        </motion.div>
                                    </div>

                                    <div className="p-8 relative">
                                        <p className="text-gray-700 mb-4 leading-relaxed">
                                            {category.desc}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {category.highlights.map(
                                                (h, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-sm font-medium"
                                                    >
                                                        {h}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Best Sellers */}
                <motion.div className="bg-white rounded-xl shadow-xl p-8 mb-16 relative overflow-hidden">
                    {/* Floating decorations */}
                    <motion.div
                        className="absolute top-8 right-8 text-6xl opacity-10"
                        animate={floatAnimation}
                    >
                        🔥
                    </motion.div>
                    <motion.div
                        className="absolute bottom-8 left-8 text-5xl opacity-10"
                        animate={floatAnimation}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: 0.5,
                        }}
                    >
                        ⭐
                    </motion.div>

                    <h2 className="text-4xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                        <FaFire className="text-blue-600" />
                        Sách Bán Chạy
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {bestSellers.map((book, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: i * 0.1,
                                    type: "spring",
                                    stiffness: 100,
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    y: -10,
                                    boxShadow:
                                        "0 20px 40px rgba(37, 99, 235, 0.2)",
                                }}
                                className="border-2 border-transparent hover:border-blue-600 rounded-lg p-6 bg-white shadow-lg relative group transition-all"
                            >
                                {/* Book decoration */}
                                <motion.div
                                    className="absolute top-2 right-2 text-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                >
                                    📚
                                </motion.div>

                                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />

                                <div className="relative z-10">
                                    <motion.div
                                        className="text-5xl text-center mb-4"
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                        }}
                                    >
                                        {book.emoji}
                                    </motion.div>

                                    <h3 className="font-bold text-lg text-gray-800">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Tác giả: {book.author}
                                    </p>

                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-xs text-blue-600 font-medium">
                                            {book.genre}
                                        </span>

                                        <div className="flex items-center gap-1">
                                            <FaStar className="text-blue-600" />
                                            <span className="font-semibold text-blue-600">
                                                {book.rating}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Publishers */}
                <motion.div className="bg-white border-2 border-blue-100 rounded-xl p-8 mb-16 relative overflow-hidden">
                    <motion.div
                        className="absolute top-6 right-6 text-5xl opacity-10"
                        animate={floatAnimation}
                    >
                        🏢
                    </motion.div>

                    <h2 className="text-4xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                        <FaGlobe className="text-blue-600" />
                        Nhà Xuất Bản Uy Tín
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {bookPublishers.map((pub, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 0,
                                    x: i % 2 === 0 ? -20 : 20,
                                }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: i * 0.05,
                                    type: "spring",
                                    stiffness: 150,
                                }}
                                whileHover={{
                                    scale: 1.1,
                                    y: -5,
                                    boxShadow:
                                        "0 15px 30px rgba(37, 99, 235, 0.15)",
                                }}
                                className="bg-white p-6 rounded-lg shadow-lg text-center border-2 border-transparent hover:border-blue-600 transition-all relative group"
                            >
                                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />

                                <motion.div
                                    className="text-3xl mb-3 relative z-10"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                >
                                    📚
                                </motion.div>
                                <h3 className="font-bold text-gray-800 relative z-10">
                                    {pub.name}
                                </h3>
                                <p className="text-sm text-blue-600 font-medium relative z-10">
                                    {pub.books} đầu sách
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* New Arrivals Banner */}
                <motion.div className="bg-blue-600 text-white rounded-xl p-8 text-center mb-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-50" />

                    <motion.div
                        className="absolute top-4 left-4 text-4xl"
                        animate={floatAnimation}
                    >
                        🔥
                    </motion.div>
                    <motion.div
                        className="absolute bottom-4 right-4 text-4xl"
                        animate={floatAnimation}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: 0.3,
                        }}
                    >
                        📚
                    </motion.div>
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="relative z-10"
                    >
                        <FaFire className="text-6xl mx-auto mb-4" />
                    </motion.div>

                    <h2 className="text-3xl font-bold mb-4 relative z-10">
                        Sách Mới Về Hàng Tuần
                    </h2>

                    <p className="text-lg opacity-90 mb-6 relative z-10">
                        Cập nhật liên tục các đầu sách mới nhất từ các nhà xuất
                        bản 📖
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 relative z-10">
                        <motion.button
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg shadow-lg font-semibold"
                            whileHover={{ scale: 1.05, y: -3 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Xem sách mới 📚
                        </motion.button>
                        <motion.button
                            className="border-2 border-white px-8 py-3 rounded-lg font-semibold"
                            whileHover={{
                                scale: 1.05,
                                y: -3,
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Đăng ký nhận thông báo
                        </motion.button>
                    </div>
                </motion.div>

                {/* Why Choose Us */}
                <motion.div className="bg-white rounded-xl shadow-xl p-8">
                    <h2 className="text-4xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                        <span className="text-4xl">💎</span>
                        Tại Sao Chọn Wisdom Books?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div
                            className="text-center p-6 rounded-xl border-2 border-transparent hover:border-blue-600 transition-all relative group"
                            whileHover={{ scale: 1.05, y: -5 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0 }}
                        >
                            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                            <motion.div
                                className="text-6xl mb-4 relative z-10"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                🎁
                            </motion.div>
                            <h3 className="font-bold text-xl text-blue-600 mb-2 relative z-10">
                                Giá Tốt Nhất
                            </h3>
                            <p className="text-gray-600 relative z-10">
                                Cam kết giá cạnh tranh
                            </p>
                        </motion.div>

                        <motion.div
                            className="text-center p-6 rounded-xl border-2 border-transparent hover:border-blue-600 transition-all relative group"
                            whileHover={{ scale: 1.05, y: -5 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                            <motion.div
                                className="text-6xl mb-4 relative z-10"
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.3,
                                }}
                            >
                                🚀
                            </motion.div>
                            <h3 className="font-bold text-xl text-blue-600 mb-2 relative z-10">
                                Giao Hàng Nhanh
                            </h3>
                            <p className="text-gray-600 relative z-10">
                                Miễn phí ship 1–3 ngày
                            </p>
                        </motion.div>

                        <motion.div
                            className="text-center p-6 rounded-xl border-2 border-transparent hover:border-blue-600 transition-all relative group"
                            whileHover={{ scale: 1.05, y: -5 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                            <motion.div
                                className="text-6xl mb-4 relative z-10"
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.6,
                                }}
                            >
                                💝
                            </motion.div>
                            <h3 className="font-bold text-xl text-blue-600 mb-2 relative z-10">
                                Quà Tặng Hấp Dẫn
                            </h3>
                            <p className="text-gray-600 relative z-10">
                                Voucher, bookmark, bao sách
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Back Button */}
                <motion.div className="text-center mt-12">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                    >
                        <motion.span
                            animate={{ x: [0, -5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            🏠
                        </motion.span>
                        Quay lại trang chủ
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
