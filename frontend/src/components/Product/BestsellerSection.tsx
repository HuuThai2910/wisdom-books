import { motion } from "framer-motion";
import { Book } from "../../types";
import BookCard from "../common/BookCard";

interface BestsellerSectionProps {
    books: Book[];
}

export default function BestsellerSection({ books }: BestsellerSectionProps) {
    // Lấy tối đa 6 sách đầu tiên cho bestseller
    const bestsellerData = books.slice(0, 6);

    return (
        <section className="products bg-white pb-25 pt-10 px-35">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mx-auto text-center mb-12 max-w-2xl">
                    <motion.h4
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-blue-600 text-4xl font-bold mb-2 pb-2 border-b-2 border-blue-500 inline-block rounded-b-lg"
                        style={{
                            fontFamily: "Playfair Display, serif",
                            fontStyle: "italic",
                            textShadow: "2px 4px 8px rgba(0,0,0,0.25)",
                        }}
                    >
                        Sách bán chạy
                    </motion.h4>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-black mt-4 text-sm"
                    >
                        Khám phá những cuốn sách được yêu thích nhất tại Wisdom Books
                    </motion.p>
                </div>

                {/* Bestseller Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bestsellerData.map((book, idx) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            index={idx}
                            variant="default"
                            showAddToCart={true}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
