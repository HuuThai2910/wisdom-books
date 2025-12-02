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

                    {/* Out of Stock Badge */}
                    {(!book.quantity || book.quantity <= 0) && (
                        <div className="absolute top-0 right-0 overflow-hidden w-24 h-24 pointer-events-none">
                            <div className="absolute top-6 -right-6 bg-red-600 text-white text-xs font-bold px-10 py-1 rotate-45 shadow-lg whitespace-nowrap">
                                HẾT HÀNG
                            </div>
                        </div>
                    )}

                    {/* Quick View Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-500 bg-black/30">
                        <div className="flex items-center gap-3">
                            <Link to={`/books/${book.id}`}>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                                    <FaEye className="text-xl" />
                                </div>
                            </Link>
                            {showAddToCart && (
                                <button
                                    onClick={() => handleAddToCart(book.id)}
                                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                                >
                                    <FaShoppingCart className="text-xl" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {/* Info */}
                <div className="text-center p-4 rounded-b-lg">
                    <Link to={`/books/${book.id}`}>
                        <p className="text-base font-semibold text-gray-900 mb-2 truncate hover:text-blue-600 transition-colors">
                            {book.title}
                        </p>
                    </Link>
                    <p className="text-xs text-gray-500 mb-2">
                        Tác giả: {book.author}
                    </p>
                    <div className="space-x-2">
                        <span className="text-red-600 font-semibold text-sm">
                            Giá: {book.sellingPrice.toLocaleString("vi-VN")}₫
                        </span>
                    </div>
                </div>
            </div>

            {/* Styles */}
            <style>{`
                .product-item-add {
                    will-change: margin-bottom, opacity;
                }
            `}</style>
        </motion.div>
    );
}
