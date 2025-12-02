import { motion } from "framer-motion";
import { FaShoppingCart, FaStar, FaRandom, FaEye } from "react-icons/fa";
import { Book } from "../../types";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../app/store";
import { addItem } from "../../features/cart/cartSlice";
import toast from "react-hot-toast";

interface BookCardProps {
    book: Book;
    index?: number;
    showAddToCart?: boolean;
    variant?: "default" | "compact";
}

export default function BookCard({
    book,
    index = 0,
    showAddToCart = true,
    variant = "default",
}: BookCardProps) {
    const dispatch = useAppDispatch();
    // Hàm thêm sản phẩm vào cart
    const handleAddToCart = async (bookId: number) => {
        // Kiểm tra số lượng trong kho trước khi thêm
        if (!book.quantity || book.quantity <= 0) {
            toast.error("Sản phẩm hiện đã hết hàng!");
            return;
        }

        try {
            await dispatch(
                addItem({
                    bookId,
                    quantity: 1,
                })
            ).unwrap();
        } catch (error: any) {
            // Hiển thị lỗi nếu có
            if (error) {
                toast.error(error);
            }
        }
    };

    const imageUrl =
        book.bookImage && book.bookImage.length > 0
            ? `https://hai-project-images.s3.us-east-1.amazonaws.com/${book.bookImage[0].imagePath}`
            : "https://anhdephd.vn/wp-content/uploads/2022/06/hinh-anh-sach-800x457.jpg";

    const isNew =
        book.createdAt &&
        new Date().getTime() - new Date(book.createdAt).getTime() <
            30 * 24 * 60 * 60 * 1000;
    const isSale = book.status === "SALE";
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
            }}
            className="product-item relative h-full w-full group"
        >
            {/* Product Inner */}
            <div className="product-item-inner h-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-500 group-hover:border-b-0 group-hover:rounded-b-none">
                {/* Image */}
                <div className="relative overflow-hidden rounded-t-lg block bg-white">
                    <div className="w-full h-80 p-4 bg-white flex items-center justify-center">
                        <img
                            src={imageUrl}
                            alt={book.title}
                            className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Label */}
                    {(isNew || isSale) && (
                        <div
                            className={`absolute top-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                                isNew
                                    ? "wisbook-icon-gradient"
                                    : "bg-orange-500"
                            }`}
                        >
                            {isNew ? "Mới" : "Hot"}
                        </div>
                    )}

                    {/* Quick View Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-500">
                        <Link to={`/books/${book.id}`}>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer bg-blue-500 hover:bg-orange-500 transition-all duration-300">
                                <FaEye className="text-white text-xl" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Info */}
                <div className="text-center p-4 rounded-b-lg">
                    <p className="text-sm text-gray-500 mb-2">
                        Tác giả: {book.author}
                    </p>
                    <Link to={`/books/${book.id}`}>
                        <p className="text-base font-semibold text-gray-900 mb-2 truncate hover:text-blue-600 transition-colors">
                            {book.title}
                        </p>
                    </Link>
                    <div className="space-x-2">
                        <span className="text-red-600 font-semibold text-lg">
                            {book.sellingPrice.toLocaleString("vi-VN")}₫
                        </span>
                    </div>
                    {book.quantity && book.quantity > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                            Còn lại: {book.quantity.toLocaleString()} cuốn
                        </p>
                    )}
                </div>
            </div>

            {/* Add to Cart (Hover Slide Up) */}
            {showAddToCart && (
                <div className="product-item-add absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 group-hover:-mb-[100px] transition-all duration-500 z-10 bg-white border border-t-0 border-gray-200 rounded-b-lg p-4 pt-0">
                    <div className="flex justify-center mb-4">
                        <button
                            onClick={() => handleAddToCart(book.id)}
                            className="inline-flex items-center justify-center gap-2 font-semibold rounded-full py-2 px-6 transition-all duration-500 bg-blue-600 hover:bg-red-500 text-white hover:scale-[1.05]"
                        >
                            <FaShoppingCart className="text-base" />
                            <span>Thêm giỏ hàng</span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, idx) => (
                                <FaStar key={idx} className="text-yellow-400" />
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <Link to={`/books/${book.id}`}>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                                    <FaRandom />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Styles */}
            <style>{`
                .product-item-add {
                    will-change: margin-bottom, opacity;
                }
            `}</style>
        </motion.div>
    );
}
