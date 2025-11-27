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
                return books.slice(0, limit);
        }
    };

    const filteredBooks = getFilteredBooks();

    return (
        <section className="product bg-white py-16">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10">
                    <motion.h1
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl font-bold mb-6 md:mb-0"
                        style={{
                            fontFamily: "Playfair Display, serif",
                            fontStyle: "italic",
                            color: "#1a1a1a",
                            textShadow: "2px 4px 8px rgba(0,0,0,0.25)",
                        }}
                    >
                        Sách Của Chúng Tôi
                    </motion.h1>

                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-wrap gap-3"
                    >
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`px-5 py-2 rounded-full text-xl font-semibold transition-all ${
                                    activeTab === t.id
                                        ? "text-blue-500 shadow-md bg-blue-100"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Products Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.5 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {filteredBooks.map((book, i) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                index={i}
                                showAddToCart={true}
                                variant="default"
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>
                <div className="flex justify-center mt-10">
                    <Link
                        to="/books"
                        className="group mt-10 mx-auto inline-flex items-center gap-2 px-10 py-3 text-lg font-semibold rounded-full border-2 border-blue-500 text-blue-600 bg-white shadow-lg hover:shadow-xl hover:bg-blue-500 hover:text-white transition-all duration-300"
                    >
                        Xem Tất Cả Sản Phẩm
                        <ArrowRight className="size-5 text-blue-600 transition-all duration-300 group-hover:text-white group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
