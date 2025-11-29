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
            className="productImg-carousel productList-item relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Navigation Buttons (hiện khi hover) */}
            {books.length > 1 && (
                <>
                    <button
                        onClick={prevProduct}
                        className={`absolute top-0 left-0 z-20 px-3 py-1 wisbook-btn-gradient rounded-full transition-all duration-300 ${
                            isHovered ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <FaArrowLeft className="text-sm" />
                    </button>
                    <button
                        onClick={nextProduct}
                        className={`absolute top-0 right-0 z-20 px-3 py-1 wisbook-btn-gradient rounded-full transition-all duration-300 ${
                            isHovered ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <FaArrowRight className="text-sm" />
                    </button>
                </>
            )}

            {/* Product Display */}
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.95 }}
                transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 15,
                    mass: 0.8,
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
        const limitedBooks = books.slice(0, 20);

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
        <section className="products productList overflow-hidden bg-gray-50 py-16 px-35">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mx-auto text-center mb-12 max-w-3xl">
                    <motion.h4
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-blue-500 text-4xl font-bold mb-2 pb-2 border-b-2 border-blue-500 inline-block rounded-b-lg"
                        style={{
                            fontFamily: "Playfair Display, serif",
                            fontStyle: "italic",
                            color: "#3b82f6",
                            textShadow: "2px 4px 8px rgba(0,0,0,0.25)",
                        }}
                    >
                        Sản Phẩm Được Yêu Thích
                    </motion.h4>
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
                                    className="absolute -top-10 left-0 z-30 px-10 py-2 wisbook-btn-gradient rounded-full transition-all duration-300 flex items-center gap-2"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    onClick={nextGroup}
                                    className="absolute -top-10 right-0 z-30 px-10 py-2 wisbook-btn-gradient rounded-full transition-all duration-300 flex items-center gap-2"
                                >
                                    <FaChevronRight />
                                </button>
                            </>
                        )}

                        {/* Products Grid (Current Group) */}
                        <motion.div
                            key={currentGroupIndex}
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "-100%" }}
                            transition={{
                                type: "spring",
                                stiffness: 70,
                                damping: 18,
                                mass: 1,
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8"
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
