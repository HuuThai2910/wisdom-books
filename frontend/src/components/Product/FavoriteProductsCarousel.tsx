import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    FaChevronLeft,
    FaChevronRight,
    FaArrowLeft,
    FaArrowRight,
} from "react-icons/fa";
import { Book } from "../../types";
import BookCard from "../common/BookCard";

// Inner Carousel Component (cho từng product trong group)
const InnerCarousel = ({ books }: { books: Book[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nextProduct = () => {
        setCurrentIndex((prev) => (prev + 1) % books.length);
    };

    const prevProduct = () => {
        setCurrentIndex((prev) => (prev - 1 + books.length) % books.length);
    };

    useEffect(() => {
        if (isHovered || books.length === 0) return;
        const interval = setInterval(() => {
            nextProduct();
        }, 10000);
        return () => clearInterval(interval);
    }, [currentIndex, isHovered, books.length]);

    if (books.length === 0) return null;

    return (
        <div
            className="productImg-carousel productList-item relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Navigation Buttons (hiện khi hover) */}
            {books.length > 1 && (
                <>
                    <button
                        onClick={prevProduct}
                        className={`absolute top-2 left-2 z-20 w-8 h-8 bg-white/90 hover:bg-blue-600 text-blue-600 hover:text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
                            isHovered
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-75"
                        }`}
                    >
                        <FaArrowLeft className="text-sm" />
                    </button>
                    <button
                        onClick={nextProduct}
                        className={`absolute top-2 right-2 z-20 w-8 h-8 bg-white/90 hover:bg-blue-600 text-blue-600 hover:text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
                            isHovered
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-75"
                        }`}
                    >
                        <FaArrowRight className="text-sm" />
                    </button>
                </>
            )}

            {/* Product Display */}
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                }}
            >
                <BookCard
                    book={books[currentIndex]}
                    index={currentIndex}
                    variant="default"
                    showAddToCart={true}
                />
            </motion.div>
        </div>
    );
};

interface FavoriteProductsCarouselProps {
    books: Book[];
}

export default function FavoriteProductsCarousel({
    books,
}: FavoriteProductsCarouselProps) {
    const [productListData, setProductListData] = useState<Book[][][]>([]);
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
    const [isHoveringOuterCarousel, setIsHoveringOuterCarousel] =
        useState(false);
    const autoplayRef = useRef<number | null>(null);

    useEffect(() => {
        if (books.length === 0) return;

        // Chỉ lấy tối đa 20 sách để hiển thị nhanh
        const limitedBooks = books.slice(100, 120);

        // Chia sách thành groups cho carousel
        // Mỗi group có 4 columns, mỗi column có 2 sách
        const groups: Book[][][] = [];
        const booksPerColumn = 2;
        const columnsPerGroup = 4;
        const booksPerGroup = booksPerColumn * columnsPerGroup; // 8 books per group

        for (
            let i = 0;
            i < Math.min(2, Math.ceil(limitedBooks.length / booksPerGroup));
            i++
        ) {
            const group: Book[][] = [];
            for (let j = 0; j < columnsPerGroup; j++) {
                const startIdx = i * booksPerGroup + j * booksPerColumn;
                const column = limitedBooks.slice(
                    startIdx,
                    startIdx + booksPerColumn
                );
                if (column.length > 0) {
                    group.push(column);
                }
            }
            if (group.length > 0) {
                groups.push(group);
            }
        }
        setProductListData(groups);
    }, [books]);

    const nextGroup = () => {
        setCurrentGroupIndex((prev) => (prev + 1) % productListData.length);
    };

    const prevGroup = () => {
        setCurrentGroupIndex(
            (prev) =>
                (prev - 1 + productListData.length) % productListData.length
        );
    };

    // Auto play outer carousel
    useEffect(() => {
        if (productListData.length === 0 || isHoveringOuterCarousel) return;

        autoplayRef.current = window.setInterval(() => {
            nextGroup();
        }, 15000);

        return () => {
            if (autoplayRef.current) clearInterval(autoplayRef.current);
        };
    }, [productListData.length, currentGroupIndex, isHoveringOuterCarousel]);

    return (
        <section className="products productList overflow-hidden bg-gradient-to-b from-gray-50 to-white py-16 px-25">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mx-auto text-center mb-16 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block"
                    >
                        <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg mb-4 inline-block">
                            ⭐ YÊU THÍCH
                        </span>
                        <h4
                            className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent"
                            style={{
                                fontFamily: "Playfair Display, serif",
                            }}
                        >
                            Sản Phẩm Được Yêu Thích
                        </h4>
                        <p className="text-gray-600 text-lg">
                            Những cuốn sách được độc giả tin yêu nhất
                        </p>
                    </motion.div>
                </div>

                {/* Outer Carousel Container */}
                {productListData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="productList-carousel relative"
                        onMouseEnter={() => setIsHoveringOuterCarousel(true)}
                        onMouseLeave={() => setIsHoveringOuterCarousel(false)}
                    >
                        {/* Outer Navigation Buttons */}
                        {productListData.length > 1 && (
                            <>
                                <button
                                    onClick={prevGroup}
                                    className="absolute -top-16 left-0 z-30 w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-600 text-white rounded-full shadow-lg hover:shadow-blue-600/50 transition-all duration-300 flex items-center justify-center hover:scale-110"
                                >
                                    <FaChevronLeft className="text-lg" />
                                </button>
                                <button
                                    onClick={nextGroup}
                                    className="absolute -top-16 right-0 z-30 w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-600 text-white rounded-full shadow-lg hover:shadow-blue-600/50 transition-all duration-300 flex items-center justify-center hover:scale-110"
                                >
                                    <FaChevronRight className="text-lg" />
                                </button>
                            </>
                        )}

                        {/* Products Grid (Current Group) */}
                        <motion.div
                            key={currentGroupIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                                duration: 0.6,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {productListData[currentGroupIndex].map(
                                (booksArray, idx) => (
                                    <div key={idx}>
                                        <InnerCarousel books={booksArray} />
                                    </div>
                                )
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
