import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
    storyImages,
    stats,
    values,
    categories,
    testimonials,
    milestones,
} from "../../data/about/index";
const AnimatedCounter = ({
    target,
    suffix = "",
}: {
    target: number;
    suffix?: string;
}) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const stepDuration = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [isVisible, target]);

    return (
        <div ref={ref} className="text-4xl font-bold mb-2">
            {count.toLocaleString()}
            {suffix}
        </div>
    );
};

const StoryImageCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = storyImages;

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative group"
        >
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <div className="absolute inset-0 wisbook-icon-gradient rounded-2xl transform rotate-3 -z-10"></div>

                {/* Images */}
                <div className="relative h-[400px]">
                    {images.map((image, index) => (
                        <motion.img
                            key={index}
                            src={image.url}
                            alt={image.alt}
                            initial={false}
                            animate={{
                                opacity: currentIndex === index ? 1 : 0,
                                scale: currentIndex === index ? 1 : 0.95,
                                x:
                                    currentIndex === index
                                        ? 0
                                        : index > currentIndex
                                        ? 50
                                        : -50,
                            }}
                            transition={{
                                duration: 0.7,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                        />
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white wisbook-gradient-text w-12 h-12 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                    <FaChevronLeft />
                </button>
                <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white wisbook-gradient-text w-12 h-12 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                    <FaChevronRight className="text-xl" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`transition-all duration-300 rounded-full ${
                                currentIndex === index
                                    ? "bg-white w-8 h-2"
                                    : "bg-white/50 hover:bg-white/75 w-2 h-2"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default function About() {
    return (
        <div className="min-h-screen wisbook-gradient-overlay pt-20">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-6 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 wisbook-gradient-text">
                            Về Wisdom Books
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Nơi khơi nguồn tri thức, lan tỏa tình yêu sách
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <StoryImageCarousel />

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold mb-6 text-gray-800">
                                Câu chuyện của chúng tôi
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Wisdom Books được thành lập với sứ mệnh mang đến
                                cho độc giả Việt Nam một kho tàng tri thức phong
                                phú, đa dạng từ văn học, kinh tế, kỹ năng sống
                                đến sách thiếu nhi.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Từ một cửa hàng nhỏ, chúng tôi đã không ngừng
                                phát triển và hiện là một trong những nhà sách
                                trực tuyến uy tín hàng đầu với hơn 50,000 đầu
                                sách và phục vụ hơn 100,000 khách hàng trên toàn
                                quốc.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Chúng tôi tin rằng sách không chỉ là nguồn tri
                                thức mà còn là người bạn đồng hành, giúp con
                                người phát triển toàn diện và sống có ý nghĩa
                                hơn.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 wisbook-btn-gradient">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="text-center text-white"
                            >
                                <stat.icon className="text-5xl mx-auto mb-4 opacity-90" />
                                <AnimatedCounter
                                    target={stat.number}
                                    suffix={stat.suffix}
                                />
                                <div className="text-blue-100 text-lg font-semibold">
                                    {stat.label}
                                </div>
                                <div className="text-blue-200 text-sm mt-1">
                                    {stat.desc}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4 text-gray-800">
                            Hành trình phát triển
                        </h2>
                        <p className="text-xl text-gray-600">
                            15 năm không ngừng nỗ lực và phát triển
                        </p>
                    </motion.div>

                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={index}
                                initial={{
                                    opacity: 0,
                                    x: index % 2 === 0 ? -50 : 50,
                                }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.2,
                                }}
                                viewport={{ once: true }}
                                className={`relative flex items-center mb-12 ${
                                    index % 2 === 0
                                        ? "flex-row"
                                        : "flex-row-reverse"
                                }`}
                            >
                                <div
                                    className={`w-5/12 ${
                                        index % 2 === 0
                                            ? "text-right pr-8"
                                            : "text-left pl-8"
                                    }`}
                                >
                                    <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100">
                                        <h3 className="text-2xl font-bold text-blue-600 mb-2">
                                            {milestone.year}
                                        </h3>
                                        <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                            {milestone.title}
                                        </h4>
                                        <p className="text-gray-600">
                                            {milestone.desc}
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
                                <div className="w-5/12"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4 text-gray-800">
                            Danh mục sách đa dạng
                        </h2>
                        <p className="text-xl text-gray-600">
                            Hơn 50,000 đầu sách thuộc nhiều thể loại khác nhau
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-2xl font-bold mb-2">
                                        {category.name}
                                    </h3>
                                    <p className="text-blue-200 text-lg font-semibold">
                                        {category.count} đầu sách
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4 text-gray-800">
                            Khách hàng nói gì về chúng tôi
                        </h2>
                        <p className="text-xl text-gray-600">
                            Hàng trăm nghìn đánh giá 5 sao từ độc giả
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.2,
                                }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="flex items-center mb-4">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-blue-200"
                                    />
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-blue-600 text-sm">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="w-5 h-5 text-yellow-400 fill-current"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-600 leading-relaxed italic">
                                    "{testimonial.content}"
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4 text-gray-800">
                            Sứ mệnh của chúng tôi
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Lan tỏa tri thức, khơi dậy niềm đam mê đọc sách và
                            góp phần xây dựng một cộng đồng yêu sách, yêu học
                            hỏi
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="w-14 h-14 wisbook-icon-gradient rounded-full flex items-center justify-center mb-4">
                                    <value.icon className="text-2xl text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {value.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl font-bold mb-6 text-gray-800">
                            Hãy để chúng tôi đồng hành cùng bạn
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Khám phá hàng ngàn đầu sách hay, ưu đãi hấp dẫn và
                            trải nghiệm mua sắm tuyệt vời tại Wisdom Books
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            Khám phá ngay
                        </motion.button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
