import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book } from "../../types";
import BookCard from "../common/BookCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const tabs = [
    { id: "all", label: "Tất Cả Sách" },
    { id: "new", label: "Sách Mới" },
    { id: "featured", label: "Nổi Bật" },
    { id: "top", label: "Bán Chạy" },
] as const;

type TabType = "all" | "new" | "featured" | "top";

interface OurProductsProps {
    books: Book[];
}

export default function OurProducts({ books }: OurProductsProps) {
    const [activeTab, setActiveTab] = useState<TabType>("all");

    // Filter books based on active tab
    const getFilteredBooks = () => {
        const limit = 8; // Show only 8 books per tab
        switch (activeTab) {
            case "new":
                return books
                    .slice()
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt || "").getTime() -
                            new Date(a.createdAt || "").getTime()
                    )
                    .slice(0, limit);
            case "featured":
                return books
                    .filter((book) => book.status === "SALE")
                    .slice(0, limit);
            case "top":
                return books
                    .slice()
                    .sort(
                        (a, b) => (b.sellingPrice || 0) - (a.sellingPrice || 0)
                    )
                    .slice(0, limit);
            default:
                return books.slice(12, 20);
        }
    };

    const filteredBooks = getFilteredBooks();

    return (
        <section className="product bg-gradient-to-b from-white to-blue-50/30 py-16 px-35">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6 md:mb-0"
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Sách Của Chúng Tôi
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap gap-3"
                    >
                        {tabs.map((t) => (
                            <motion.button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                                    activeTab === t.id
                                        ? "text-white bg-blue-600 shadow-lg shadow-blue-600/30"
                                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300 shadow-sm"
                                }`}
                            >
                                {activeTab === t.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-blue-600 rounded-full -z-10"
                                        transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 30,
                                        }}
                                    />
                                )}
                                {t.label}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>

                {/* Products Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                    >
                        {filteredBooks.map((book, i) => (
                            <motion.div
                                key={book.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                            >
                                <BookCard
                                    book={book}
                                    index={i}
                                    showAddToCart={true}
                                    variant="default"
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* View All Button */}
                <div className="flex justify-center">
                    <Link
                        to="/books"
                        className="group inline-flex items-center gap-3 px-8 py-4 text-base font-semibold rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                    >
                        <span>Xem Tất Cả Sản Phẩm</span>
                        <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
