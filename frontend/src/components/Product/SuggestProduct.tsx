import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    FaShoppingCart,
    FaHeart,
    FaRandom,
    FaEye,
    FaChevronLeft,
    FaChevronRight,
    FaArrowLeft,
    FaArrowRight,
} from "react-icons/fa";
import bookApi from "../../api/bookApi";
import { Book } from "../../types";

// Product Item Component (Reusable)
const ProductItem = ({ book }: { book: Book }) => {
    const imageUrl =
        book.bookImage && book.bookImage.length > 0
            ? `https://hai-project-images.s3.us-east-1.amazonaws.com/${book.bookImage[0].imagePath}`
            : "https://via.placeholder.com/300x400?text=No+Image";

    return (
        <div className="products-mini-item border rounded-lg group relative bg-white">
            <div className="row g-0">
                {/* Image Column (40%) */}
                <div className="col-5">
                    <a
                        href={`/books/${book.id}`}
                        className="products-mini-img border-r border-gray-200 h-full relative overflow-hidden rounded-l-lg block bg-white"
                    >
                        <div className="w-full h-48 p-3 bg-white flex items-center justify-center">
                            <img
                                src={imageUrl}
                                className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                alt={book.title}
                            />
                        </div>
                        {/* Quick View Icon - Center, smooth orange transition on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer bg-blue-600 hover:bg-orange-500 transition-all duration-300">
                                <FaEye className="text-white text-xl" />
                            </div>
                        </div>
                    </a>
                </div>

                {/* Info Column (60%) */}
                <div className="col-7">
                    <div className="products-mini-content p-3">
                        <a
                            href={`/books/${book.id}`}
                            className="block text-sm text-gray-600 hover:text-blue-600 transition mb-2"
                        >
                            {book.author}
                        </a>
                        <a
                            href={`/books/${book.id}`}
                            className="block text-lg font-semibold text-gray-900 hover:text-blue-600 transition leading-tight line-clamp-2"
                        >
                            {book.title}
                        </a>
                        <div className="mt-2">
                            <span className="font-semibold text-lg text-red-600">
                                {book.sellingPrice.toLocaleString("vi-VN")}₫
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add to Cart Section */}
            <div className="products-mini-add absolute bottom-0 -left-[1px] -right-[1px] flex items-center justify-between bg-white border border-t-0 border-gray-200 p-3 opacity-0 group-hover:opacity-100 group-hover:-mb-[75px] transition-all duration-500 z-10 rounded-b-lg">
                <button className="btn btn-primary flex items-center gap-2 wisbook-btn-gradient font-semibold rounded-full py-2 px-4 transition-all duration-300">
                    <FaShoppingCart />
                    <span className="text-sm">Thêm vào giỏ</span>
                </button>
                <div className="flex gap-2">
                    <button className="btn-sm-square w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-blue-500 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-300">
                        <FaRandom className="text-xs" />
                    </button>
                </div>
            </div>
        </div>
    );
};

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
            className="productImg-carousel productList-item relative mb-[75px]"
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
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
            >
                <ProductItem book={books[currentIndex]} />
            </motion.div>
        </div>
    );
};

interface SuggestProductProps {
    books: Book[];
}

export default function SuggestProduct({ books }: SuggestProductProps) {
    const [productListData, setProductListData] = useState<Book[][][]>([]);
    const [bestsellerData, setBestsellerData] = useState<Book[]>([]);
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
    const [isHoveringOuterCarousel, setIsHoveringOuterCarousel] =
        useState(false);
    const autoplayRef = useRef<number | null>(null);

    useEffect(() => {
        if (books.length === 0) return;

        // Chỉ lấy tối đa 20 sách để hiển thị nhanh
        const limitedBooks = books.slice(0, 20);

        // Chia sách thành groups cho carousel
        // Mỗi group có 4 columns, mỗi column có 2 sách (giảm từ 3 xuống 2)
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

        // Bestseller - lấy 6 sách đầu tiên
        setBestsellerData(limitedBooks.slice(0, 6));
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
        <>
            {/* ===== PRODUCT LIST SECTION (Carousel) ===== */}
            <section className="products productList overflow-hidden bg-gray-50 py-16">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="mx-auto text-center mb-12 max-w-3xl">
                        <motion.h4
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-blue-500 text-5xl font-semibold mb-2 pb-2 border-b-2 border-blue-500 inline-block rounded-b-lg font-bold"
                            style={{
                                fontFamily: "Playfair Display, serif",
                                fontStyle: "italic",
                                color: "#3b82f6",
                                textShadow: "2px 4px 8px rgba(0,0,0,0.25)",
                            }}
                        >
                            Sản Phẩm Đươc Yêu Thích
                        </motion.h4>
                    </div>

                    {/* Outer Carousel Container */}
                    {productListData.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="productList-carousel relative"
                            onMouseEnter={() =>
                                setIsHoveringOuterCarousel(true)
                            }
                            onMouseLeave={() =>
                                setIsHoveringOuterCarousel(false)
                            }
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
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
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

            {/* ===== BESTSELLER SECTION (Grid) ===== */}
            <section className="products bg-white py-16">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="mx-auto text-center mb-12 max-w-2xl">
                        <motion.h4
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-orange-500 text-lg font-semibold mb-4 pb-2 border-b-2 border-orange-500 inline-block rounded-b-lg"
                        >
                            Sách Bán Chạy
                        </motion.h4>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-gray-600 mt-4"
                        >
                            Khám phá những cuốn sách được yêu thích nhất tại
                            Wisdom Books
                        </motion.p>
                    </div>

                    {/* Bestseller Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bestsellerData.map((book, idx) => (
                            <motion.div
                                key={book.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: (idx % 3) * 0.2, // Stagger effect
                                }}
                                viewport={{ once: true }}
                                className="mb-[75px]"
                            >
                                <ProductItem book={book} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CSS Styles */}
            <style>{`
        /* Product Mini Item */
        .products .products-mini-item {
          position: relative;
          transition: all 0.5s ease;
        }

        .products .products-mini-item:hover {
          border-bottom-left-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        }

        /* Image zoom không bị overflow */
        .products-mini-img {
          position: relative;
        }

        /* Quick View Icon centered */
        .products-mini-icon {
          transform: translate(-50%, -50%);
        }

        /* Add to Cart positioning */
        .products-mini-add {
          will-change: margin-bottom, opacity;
        }

        /* Carousel height */
        .productList .productList-carousel {
          min-height: 280px;
        }

        /* Button styles */
        .btn.btn-primary {
          font-family: 'Roboto', sans-serif;
          font-weight: 400;
        }

        .btn-sm-square {
          font-weight: normal;
        }

        /* Border utilities */
        .border-r {
          border-right-width: 1px;
        }

        /* Title border radius */
        .title-border-radius {
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }

        /* Smooth transitions */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
        </>
    );
}
