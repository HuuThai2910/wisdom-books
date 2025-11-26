import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaEye } from "react-icons/fa";
import { Book } from "../../types";

interface BookCardProps {
    book: Book;
}

export default function BookCard({ book }: BookCardProps) {
    const imageUrl =
        book.bookImage && book.bookImage.length > 0
            ? `https://hai-project-images.s3.us-east-1.amazonaws.com/${book.bookImage[0].imagePath}`
            : "https://via.placeholder.com/300x400?text=No+Image";

    const isNew =
        book.createdAt &&
        new Date().getTime() - new Date(book.createdAt).getTime() <
            30 * 24 * 60 * 60 * 1000;
    const isSale = book.status === "SALE";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group relative"
        >
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all duration-500 hover:shadow-xl">
                <Link
                    to={`/books/${book.id}`}
                    className="block relative overflow-hidden"
                >
                    <img
                        src={imageUrl}
                        alt={book.title}
                        className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {(isNew || isSale) && (
                        <div
                            className={`absolute top-3 right-3 w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                                isNew
                                    ? "wisbook-icon-gradient"
                                    : "bg-orange-500"
                            }`}
                        >
                            {isNew ? "Mới" : "Hot"}
                        </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 rounded-full wisbook-icon-hover-orange flex items-center justify-center shadow-lg">
                            <FaEye className="text-white text-xl" />
                        </div>
                    </div>
                </Link>

                <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{book.author}</p>
                    <Link to={`/books/${book.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 h-14 hover:text-purple-600 transition-colors">
                            {book.title}
                        </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                        <span className="wisbook-gradient-text font-semibold text-lg">
                            {book.sellingPrice?.toLocaleString("vi-VN")}₫
                        </span>
                        <button className="w-9 h-9 rounded-full wisbook-icon-hover-orange flex items-center justify-center">
                            <FaShoppingCart className="text-white text-sm" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
