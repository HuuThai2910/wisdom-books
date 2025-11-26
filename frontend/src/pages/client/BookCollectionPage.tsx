import { motion } from "framer-motion";
import { FaBook, FaStar, FaFire } from "react-icons/fa";
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
    return (
        <div className="min-h-screen wisbook-gradient-overlay pt-20 relative">
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative wisbook-card-gradient text-gray-800 py-20 overflow-hidden"
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-9xl">📚</div>
                    <div className="absolute bottom-10 right-10 text-9xl">
                        📖
                    </div>
                    <div className="absolute top-1/2 left-1/2 text-7xl">✨</div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center"
                    >
                        <FaBook className="text-6xl mx-auto mb-6" />
                        <h1 className="text-5xl font-bold mb-4">
                            Kho Sách Phong Phú
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Hàng ngàn đầu sách cho bạn lựa chọn - Từ học tập đến
                            giải trí
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-16">
                {/* Stats */}
                <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {bookStats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl"
                        >
                            <div className="text-5xl mb-3">{stat.icon}</div>
                            <div className="text-3xl font-bold text-amber-600 mb-2">
                                {stat.number}
                            </div>
                            <div className="text-gray-600">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Features */}
                <motion.div className="grid md:grid-cols-3 gap-6 mb-16">
                    {bookFeatures.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white border-2 border-blue-100 p-6 rounded-lg text-center hover:shadow-lg"
                            >
                                <Icon className="text-amber-600 text-4xl mb-3 mx-auto" />
                                <h3 className="text-lg font-bold">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Categories */}
                <motion.div className="mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center">
                        Danh Mục Sách
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookCategories.map((category, i) => {
                            const Icon = category.icon;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer"
                                >
                                    <div
                                        className={`bg-gradient-to-r ${category.color} p-6 text-white`}
                                    >
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="text-5xl">
                                                <Icon />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">
                                                    {category.title}
                                                </h3>
                                                <p className="text-sm opacity-90">
                                                    {category.count}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-6xl text-center my-4">
                                            {category.image}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <p className="text-gray-700 mb-3">
                                            {category.desc}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {category.highlights.map(
                                                (h, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
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
                <motion.div className="bg-white rounded-xl shadow-xl p-8 mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">
                        Sách Bán Chạy
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {bestSellers.map((book, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="border-2 border-blue-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-lg"
                            >
                                <div className="text-5xl text-center mb-4">
                                    {book.emoji}
                                </div>

                                <h3 className="font-bold text-lg">
                                    {book.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Tác giả: {book.author}
                                </p>

                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs text-gray-500">
                                        {book.genre}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <FaStar className="text-yellow-500" />
                                        <span className="font-semibold text-gray-800">
                                            {book.rating}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Publishers */}
                <motion.div className="bg-white border-2 border-blue-100 rounded-xl p-8 mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">
                        Nhà Xuất Bản Uy Tín
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {bookPublishers.map((pub, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 0,
                                    x: i % 2 === 0 ? -20 : 20,
                                }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md"
                            >
                                <div className="text-2xl mb-2">📚</div>
                                <h3 className="font-bold">{pub.name}</h3>
                                <p className="text-sm text-amber-600">
                                    {pub.books} đầu sách
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* New Arrivals Banner */}
                <motion.div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl p-8 text-center mb-16">
                    <FaFire className="text-6xl mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-4">
                        Sách Mới Về Hàng Tuần
                    </h2>

                    <p className="text-lg opacity-90 mb-6">
                        Cập nhật liên tục các đầu sách mới nhất từ các nhà xuất
                        bản
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="bg-white text-blue-500 px-8 py-3 rounded-lg hover:bg-blue-50 shadow-lg">
                            Xem sách mới
                        </button>
                        <button className="border-2 border-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-500">
                            Đăng ký nhận thông báo
                        </button>
                    </div>
                </motion.div>

                {/* Why Choose Us */}
                <motion.div className="bg-white rounded-xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Tại Sao Chọn Wisdom Books?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-5xl mb-3">🎁</div>
                            <h3 className="font-bold">Giá Tốt Nhất</h3>
                            <p className="text-gray-600">
                                Cam kết giá cạnh tranh
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="text-5xl mb-3">🚀</div>
                            <h3 className="font-bold">Giao Hàng Nhanh</h3>
                            <p className="text-gray-600">
                                Miễn phí ship 1–3 ngày
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="text-5xl mb-3">💝</div>
                            <h3 className="font-bold">Quà Tặng Hấp Dẫn</h3>
                            <p className="text-gray-600">
                                Voucher, bookmark, bao sách
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Back Button */}
                <motion.div className="text-center mt-12">
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
