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
        <section className="bg-gray-50 py-10 px-35">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8">
                {offers.map((offer, i) => (
                    <MotionLink
                        key={offer.id}
                        to={offer.path}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="
                            flex items-center justify-between
                            bg-white rounded-xl shadow-md p-8 border
                            hover:shadow-lg transition group
                        "
                    >
                        <div>
                            <p className="text-gray-500 mb-3">{offer.subtitle}</p>

                            <h3 className="text-blue-500 text-xl font-semibold mb-2">
                                {offer.title}
                            </h3>

                            <h1 className="text-sm font-bold text-gray-800 group-hover:text-red-600 transition">
                                {offer.highlight} →
                            </h1>
                        </div>

                        <img
                            src={offer.image}
                            alt={offer.title}
                            className="
                                w-40 h-40
                                object-cover object-center
                                rounded-xl border border-gray-200 shadow-md
                                transform transition-transform duration-500 ease-out
                                group-hover:scale-110
                            "
                        />
                    </MotionLink>
                ))}
            </div>
        </section>
    );
}
