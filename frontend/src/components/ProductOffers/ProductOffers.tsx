import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import product1 from "../../assets/img/banner_05.jpg";
import product2 from "../../assets/img/banner_06.jpg";

// Tạo MotionLink đúng chuẩn
const MotionLink = motion(Link);

const offers = [
    {
        id: 1,
        title: "Kho Sách Khổng Lồ",
        subtitle: "Hơn 10.000+ đầu sách được cập nhật mỗi ngày.",
        highlight: "Khám phá ngay",
        image: product1,
        path: "/books",
    },
    {
        id: 2,
        title: "Giao Hàng Nhanh - Giá Tốt",
        subtitle: "Ưu đãi hấp dẫn và giao hàng toàn quốc.",
        highlight: "Mua sắm liền tay",
        image: product2,
        path: "/books",
    },
];

export default function ProductOffers() {
    return (
        <section className="bg-transparent py-12">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-6">
                {offers.map((offer, i) => (
                    <MotionLink
                        key={offer.id}
                        to={offer.path}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 0.6,
                            delay: i * 0.15,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        whileHover={{
                            y: -8,
                            transition: { duration: 0.3 },
                        }}
                        className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group"
                    >
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0">
                            <img
                                src={offer.image}
                                alt={offer.title}
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-8 h-64 flex flex-col justify-center">
                            <div>
                                {/* Subtitle */}
                                <p className="text-white/90 text-sm mb-4 font-medium tracking-wide">
                                    {offer.subtitle}
                                </p>

                                {/* Title */}
                                <h3 className="text-white text-3xl font-bold mb-6 leading-tight drop-shadow-lg">
                                    {offer.title}
                                </h3>

                                {/* CTA Button */}
                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:gap-4">
                                    <span>{offer.highlight}</span>
                                    <span className="transition-transform group-hover:translate-x-1">
                                        →
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Corner Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-500" />
                    </MotionLink>
                ))}
            </div>
        </section>
    );
}
