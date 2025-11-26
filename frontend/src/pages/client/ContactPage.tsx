import { motion } from "framer-motion";
import { useState } from "react";
import {
    FaPaperPlane,
    FaBookOpen,
    FaHeadset,
    FaMapMarkerAlt,
} from "react-icons/fa";

import {
    contactInfo,
    faqData,
    socialLinks,
    storeImage,
    storeMap,
} from "../../data/contact";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <div className="min-h-screen wisbook-gradient-overlay pt-20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-200/10 rounded-full blur-3xl"></div>
            </div>

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl"
                        >
                            <FaHeadset className="text-4xl text-white" />
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Liên Hệ Với WisBook
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                            Chúng tôi luôn sẵn sàng{" "}
                            <span className="text-blue-600 font-semibold">
                                lắng nghe
                            </span>{" "}
                            và{" "}
                            <span className="text-purple-600 font-semibold">
                                hỗ trợ
                            </span>{" "}
                            bạn
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 relative z-20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => {
                            const Icon = info.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                    }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>

                                    <div className="relative bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl border border-gray-100 transition-all">
                                        <div
                                            className={`w-16 h-16 ${info.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                                        >
                                            <Icon className="text-3xl text-white" />
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            {info.title}
                                        </h3>

                                        <p className="text-gray-900 font-semibold mb-1">
                                            {info.content}
                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            {info.detail}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-16 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-5 gap-12 items-start">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="lg:col-span-3 relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-3xl blur-2xl"></div>

                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <FaPaperPlane className="text-white text-xl" />
                                    </div>

                                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Gửi Tin Nhắn
                                    </h2>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                                Họ và tên *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                style={{ color: "black" }}
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Nguyễn Văn A"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                style={{ color: "black" }}
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="email@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                                Số điện thoại *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                style={{ color: "black" }}
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="0912345678"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                                Chủ đề *
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                style={{ color: "black" }}
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Tư vấn mua sách"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                            Nội dung *
                                        </label>
                                        <textarea
                                            name="message"
                                            style={{ color: "black" }}
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={6}
                                            className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                            placeholder="Nhập nội dung tin nhắn..."
                                            required
                                        ></textarea>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center gap-3"
                                    >
                                        <FaPaperPlane />
                                        Gửi Tin Nhắn
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>

                        {/* Right column — Store Image + Social + Map */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="lg:col-span-2 space-y-6"
                        >
                            {/* Store Image */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                                <img
                                    src={storeImage}
                                    alt="WisBook Store"
                                    className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                                <div className="absolute bottom-0 p-6 text-white">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FaBookOpen className="text-3xl" />
                                        <h3 className="text-2xl font-bold">
                                            WisBook Store
                                        </h3>
                                    </div>
                                    <p className="text-blue-200">
                                        Nơi khơi nguồn tri thức
                                    </p>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="relative bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    Kết Nối Với Chúng Tôi
                                </h3>
                                <p className="text-gray-600 text-sm mb-6">
                                    Theo dõi để cập nhật sách mới & khuyến mãi
                                </p>

                                <div className="grid grid-cols-4 gap-3">
                                    {socialLinks.map((item, idx) => {
                                        const Icon = item.icon;
                                        return (
                                            <motion.a
                                                key={idx}
                                                href={item.href}
                                                whileHover={{
                                                    scale: 1.1,
                                                    y: -5,
                                                }}
                                                className={`aspect-square rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${item.color}`}
                                            >
                                                <Icon className="text-2xl" />
                                            </motion.a>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Map */}
                            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                        <FaMapMarkerAlt />
                                        Vị Trí Cửa Hàng
                                    </h3>
                                </div>

                                <iframe
                                    src={storeMap}
                                    width="100%"
                                    height="280"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 relative z-10">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Câu Hỏi Thường Gặp
                        </h2>
                        <p className="text-xl text-gray-600">
                            Những thắc mắc phổ biến từ khách hàng
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
                        {faqData.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl">{faq.icon}</div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                                            {faq.q}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
