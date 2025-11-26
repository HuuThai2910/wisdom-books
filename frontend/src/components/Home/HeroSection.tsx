import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
    return (
        <section className="relative py-20 overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <h1 className="text-5xl md:text-6xl font-bold wisbook-gradient-text mb-6">
                        Wisdom Books
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Khám phá thế giới tri thức qua hàng ngàn đầu sách chất
                        lượng
                    </p>
                    <Link
                        to="/books"
                        className="inline-block wisbook-btn-gradient text-white font-semibold py-3 px-8 rounded-lg"
                    >
                        Khám phá ngay
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
