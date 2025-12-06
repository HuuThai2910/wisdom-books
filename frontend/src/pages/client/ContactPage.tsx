import { motion } from "framer-motion";
import { useState } from "react";
import {
    FaPaperPlane,
    FaBookOpen,
    FaHeadset,
    FaMapMarkerAlt,
    FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";
import Breadcrumb from "../../components/common/Breadcrumb";

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const serviceId = "service_xvx17bh";
            const templateId = "template_290k67w";
            const publicKey = "6HQ6fxuSA9nwlH26t";
            const templateParams = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message,
            };
            await emailjs.send(
                serviceId,
                templateId,
                templateParams,
                publicKey
            );
            toast.success(
                "Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.",
                {
                    duration: 5000,
                    icon: "✅",
                }
            );
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            toast.error(
                "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại hoặc liên hệ trực tiếp qua email!",
                {
                    duration: 5000,
                }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20 px-20 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10 pt-5">
                <Breadcrumb items={[{ label: "Liên hệ" }]} />
            </div>
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div
                    className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div
                    className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "2s" }}
                ></div>
            </div>

            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.2,
                                type: "spring",
                            }}
                            className="inline-block mb-4"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-transform">
                                <FaHeadset className="text-4xl text-white" />
                            </div>
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                            Liên Hệ Với WisBook
                        </h1>

                        <p className="text-lg text-gray-700 leading-relaxed font-medium">
                            Chúng tôi luôn sẵn sàng{" "}
                            <span className="text-blue-600 font-bold">
                                lắng nghe
                            </span>{" "}
                            và{" "}
                            <span className="text-blue-600 font-bold">
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
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-400/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>

                                    <div className="relative bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl border-2 border-blue-100 transition-all">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform">
                                            <Icon className="text-2xl text-white" />
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                                            {info.title}
                                        </h3>

                                        <p className="text-gray-900 font-semibold mb-1 text-sm">
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
                            <div className="absolute inset-0 bg-blue-600/10 rounded-3xl blur-2xl"></div>

                            <div className="relative bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                                        <FaPaperPlane className="text-white text-xl" />
                                    </div>

                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        Gửi{" "}
                                        <span className="text-blue-600">
                                            Tin Nhắn
                                        </span>
                                    </h2>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="grid md:grid-cols-2 gap-4">
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
                                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
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
                                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
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
                                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
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
                                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
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
                                            rows={5}
                                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-none transition-all text-sm"
                                            placeholder="Nhập nội dung tin nhắn..."
                                            required
                                        ></textarea>
                                    </div>

                                    <motion.button
                                        whileHover={{
                                            scale: isSubmitting ? 1 : 1.02,
                                            boxShadow: isSubmitting
                                                ? undefined
                                                : "0 20px 40px rgba(59, 130, 246, 0.3)",
                                        }}
                                        whileTap={{
                                            scale: isSubmitting ? 1 : 0.98,
                                        }}
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-blue-600/50 flex items-center justify-center gap-2 transition-all ${
                                            isSubmitting
                                                ? "opacity-70 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <FaSpinner className="text-xl animate-spin" />
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane className="text-xl" />
                                                Gửi Tin Nhắn
                                            </>
                                        )}
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
                                    className="w-full h-[240px] object-cover group-hover:scale-105 transition-transform duration-500"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                                <div className="absolute bottom-0 p-4 text-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaBookOpen className="text-2xl" />
                                        <h3 className="text-xl font-bold">
                                            WisBook Store
                                        </h3>
                                    </div>
                                    <p className="text-blue-300 text-sm">
                                        Nơi khơi nguồn tri thức
                                    </p>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="relative bg-white rounded-3xl shadow-xl p-5 border-2 border-blue-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Kết Nối Với{" "}
                                    <span className="text-blue-600">
                                        Chúng Tôi
                                    </span>
                                </h3>
                                <p className="text-gray-600 text-sm mb-6">
                                    Theo dõi để cập nhật sách mới & khuyến mãi
                                    hấp dẫn
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
                                                <Icon className="text-xl" />
                                            </motion.a>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Map */}
                            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-blue-200">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                                            <FaMapMarkerAlt className="text-lg" />
                                        </div>
                                        Vị Trí Cửa Hàng
                                    </h3>
                                </div>

                                <iframe
                                    src={storeMap}
                                    width="100%"
                                    height="220"
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
                        className="text-center mb-10"
                    >
                        <div className="inline-block mb-3">
                            <span className="bg-blue-600 text-white px-5 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                                ❓ FAQ
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900">
                            Câu Hỏi{" "}
                            <span className="text-blue-600">Thường Gặp</span>
                        </h2>
                        <p className="text-lg text-gray-600">
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
                                className="relative bg-white rounded-2xl shadow-lg p-5 border-2 border-blue-100 hover:shadow-xl hover:border-blue-300 transition-all"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="text-3xl">{faq.icon}</div>

                                    <div>
                                        <h3 className="text-base font-bold text-gray-800 mb-1.5">
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
