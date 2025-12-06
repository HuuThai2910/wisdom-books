import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Info, MessageSquare } from "lucide-react";
import {
    FaShoppingCart,
    FaStar,
    FaFacebookF,
    FaTwitter,
    FaPinterest,
    FaChevronLeft,
    FaChevronRight,
    FaMinus,
    FaPlus,
} from "react-icons/fa";
import bookApi from "../../api/bookApi";
import { Book } from "../../types";
import { useBooks } from "../../contexts/BookContext";
import BookCard from "../../components/common/BookCard";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../app/store";
import { addItem } from "../../features/cart/cartSlice";
import { setCheckoutItems } from "../../features/checkout/checkoutSlice";
export default function BookDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [prevQuantity, setPrevQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<
        "description" | "specs" | "reviews"
    >("description");
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);
    const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
    const { books } = useBooks();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Get books with same categories (excluding current book)
    const suggestedBooks = useMemo(() => {
        if (!book || !book.category || book.category.length === 0) {
            return relatedBooks
                .filter((b) => b.id !== parseInt(id || "0"))
                .slice(0, 10);
        }

        // Get category IDs from current book
        const categoryIds = book.category.map((cat) => cat.id);

        // Filter books that share at least one category
        const booksWithSameCategory = relatedBooks.filter((b) => {
            if (b.id === book.id) return false;
            if (!b.category || b.category.length === 0) return false;

            return b.category.some((cat) => categoryIds.includes(cat.id));
        });

        // Sort by number of matching categories (descending)
        const sorted = booksWithSameCategory.sort((a, b) => {
            const aMatches =
                a.category?.filter((cat) => categoryIds.includes(cat.id))
                    .length || 0;
            const bMatches =
                b.category?.filter((cat) => categoryIds.includes(cat.id))
                    .length || 0;
            return bMatches - aMatches;
        });

        return sorted.slice(0, 10);
    }, [book, relatedBooks, id]);

    useEffect(() => {
        if (id) {
            fetchBookDetail(parseInt(id));
        }
    }, [id]);

    // Fetch related books when book changes
    useEffect(() => {
        const fetchRelatedBooks = async () => {
            try {
                // Fetch ALL books (or a large number) to ensure we get enough related books
                const response = await bookApi.getAllBooks({
                    page: 0,
                    size: 500, // Increased from 100 to get more books
                    sort: "createdAt,desc",
                });
                console.log(
                    "Total books fetched for related:",
                    response.data.result?.length
                );
                setRelatedBooks(response.data.result || []);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        fetchRelatedBooks();
    }, [book]);

    const fetchBookDetail = async (bookId: number) => {
        try {
            setLoading(true);
            const response = await bookApi.getBookById(bookId);
            if (response.data) {
                setBook(response.data);
            }
        } catch (error) {
            console.error("Error fetching book detail:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= (book?.quantity || 1)) {
            setQuantity(newQuantity);
        }
    };
    const handleAddToCart = async () => {
        if (!book) {
            toast.error("Không tìm thấy sách!");
            return;
        }

        // Kiểm tra số lượng trong kho
        if (!book.quantity || book.quantity <= 0) {
            toast.error("Sản phẩm hiện đã hết hàng!");
            return;
        }

        // Parse và validate số lượng từ input (có thể là string hoặc number)
        let validQuantity = parseInt(String(quantity)) || 1;

        // Đảm bảo số lượng >= 1
        if (validQuantity < 1 || isNaN(validQuantity)) {
            validQuantity = 1;
            setQuantity(1);
            toast.error("Số lượng không hợp lệ!");
            return;
        }

        // Đảm bảo số lượng không vượt quá tồn kho
        if (validQuantity > book.quantity) {
            setQuantity(book.quantity);
            toast.error(
                `Số lượng vượt quá tồn kho!\nChỉ còn ${book.quantity} cuốn.`
            );
            return;
        }

        // Thêm vào giỏ hàng với số lượng đã validate
        try {
            await dispatch(
                addItem({
                    bookId: book.id,
                    quantity: validQuantity,
                })
            ).unwrap();
        } catch (error: any) {
            // Hiển thị lỗi từ backend nếu có (ví dụ: số lượng trong giỏ + số lượng thêm vượt quá tồn kho)
            if (error) {
                toast.error(error);
            }
        }
    };

    // Hàm mua sách ngay lập tức mà không thêm vào giỏ hàng
    const handleBuyNow = () => {
        if (!book) {
            toast.error("Không tìm thấy sách!");
            return; // thoát nếu book null
        }

        dispatch(
            setCheckoutItems([
                {
                    id: book.id,
                    quantity,
                    book: {
                        id: book.id,
                        title: book.title,
                        price: book.sellingPrice,
                        image: book.bookImage?.[0]?.imagePath ?? "",
                        quantity: book.quantity,
                    },
                },
            ])
        );
        navigate("/checkout");
    };

    const handleImageChange = (index: number) => {
        setSelectedImage(index);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Smooth transition cho zoom position
        requestAnimationFrame(() => {
            setZoomPosition({ x, y });
        });
    };

    const handleMouseEnter = () => {
        setIsZooming(true);
    };

    const handleMouseLeave = () => {
        setIsZooming(false);
    };

    const nextImage = () => {
        const images = book?.bookImage;
        if (images && images.length > 0) {
            setSelectedImage((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = () => {
        const images = book?.bookImage;
        if (images && images.length > 0) {
            setSelectedImage(
                (prev) => (prev - 1 + images.length) % images.length
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen wisbook-gradient-overlay pt-20">
                <div className="container mx-auto px-6 py-16">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-xl text-gray-600">
                            Đang tải thông tin sách...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen wisbook-gradient-overlay pt-20">
                <div className="container mx-auto px-6 py-16">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-xl text-gray-600">
                            Không tìm thấy sách
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const images =
        book.bookImage && book.bookImage.length > 0
            ? book.bookImage.map(
                  (img) =>
                      `https://hai-project-images.s3.us-east-1.amazonaws.com/${img.imagePath}`
              )
            : ["https://via.placeholder.com/500x600?text=No+Image"];

    const averageRating =
        book.review && book.review.length > 0
            ? book.review.reduce((sum, r) => sum + r.rating, 0) /
              book.review.length
            : 0;

    const reviewCount = book.review?.length || 0;

    return (
        <div className="min-h-screen wisbook-gradient-overlay pt-15 px-35">
            <div className="container mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-12 gap-8 mb-16">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-5"
                    >
                        {/* Main Image */}
                        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-4 group border-2 border-blue-100">
                            <div
                                className="w-full h-[500px] flex items-center justify-center p-8 rounded-xl border border-blue-200 shadow-sm overflow-hidden cursor-grab active:cursor-grabbing"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <img
                                    src={images[selectedImage]}
                                    alt={book.title}
                                    className="max-h-full max-w-full object-cover rounded-lg will-change-transform"
                                    style={
                                        isZooming
                                            ? {
                                                  transform: "scale(2.5)",
                                                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                  transition:
                                                      "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform-origin 0.15s ease-out",
                                              }
                                            : {
                                                  transition:
                                                      "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                                              }
                                    }
                                />
                            </div>

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-600/90 hover:bg-blue-600 hover:text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    >
                                        <FaChevronLeft className="text-blue-600 group-hover:text-white" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-600/90 hover:bg-blue-600 hover:text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    >
                                        <FaChevronRight className="text-blue-600 group-hover:text-white" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleImageChange(index)}
                                        className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                            selectedImage === index
                                                ? "border-blue-600 shadow-lg scale-105"
                                                : "border-gray-200 hover:border-blue-400"
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${book.title} - ${index + 1}`}
                                            className="w-full h-24 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7 bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100"
                    >
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {book.title}
                        </h1>

                        <div className="mb-5">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-3xl font-bold text-blue-600">
                                    {book.sellingPrice?.toLocaleString("vi-VN")}
                                    ₫
                                </span>
                                {book.importPrice &&
                                    book.importPrice > book.sellingPrice && (
                                        <span className="text-lg text-gray-400 line-through">
                                            {book.importPrice.toLocaleString(
                                                "vi-VN"
                                            )}
                                            ₫
                                        </span>
                                    )}
                            </div>

                            <div className="text-base font-semibold">
                                {book.quantity === 0 ? (
                                    <span className="text-red-600">
                                        Hết hàng
                                    </span>
                                ) : book.quantity <= 10 ? (
                                    <span className="text-orange-500">
                                        Gần hết hàng
                                    </span>
                                ) : (
                                    <span className="text-green-600">
                                        Còn hàng
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Book Info */}
                        <div className="space-y-2.5 mb-5 pb-5 border-b border-gray-200">
                            <div className="flex gap-3">
                                <span className="font-semibold text-gray-700 text-sm w-28">
                                    Tác giả:
                                </span>
                                <span className="text-gray-900 text-sm">
                                    {book.author}
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <span className="font-semibold text-gray-700 text-sm w-28">
                                    ISBN:
                                </span>
                                <span className="text-gray-900 text-sm">
                                    {book.isbn}
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <span className="font-semibold text-gray-700 text-sm w-28">
                                    Năm xuất bản:
                                </span>
                                <span className="text-gray-900 text-sm">
                                    {book.yearOfPublication || "Đang cập nhật"}
                                </span>
                            </div>
                            {book.supplier && (
                                <div className="flex gap-3">
                                    <span className="font-semibold text-gray-700 text-sm w-28">
                                        Nhà cung cấp:
                                    </span>
                                    <span className="text-gray-900 text-sm">
                                        {book.supplier.companyName}
                                    </span>
                                </div>
                            )}
                            {book.category && book.category.length > 0 && (
                                <div className="flex gap-3">
                                    <span className="font-semibold text-gray-700 text-sm w-28">
                                        Thể loại:
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {book.category.map((cat) => (
                                            <span
                                                key={cat.id}
                                                className="px-2.5 py-0.5 bg-blue-600 text-white rounded-full text-xs font-medium shadow-sm"
                                            >
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="mb-5">
                            <div className="flex items-center gap-4">
                                <label className="font-semibold text-gray-700 text-sm">
                                    Số lượng:
                                </label>
                                {/* Input số lượng */}
                                <div className="flex items-center bg-white border-2 border-blue-200 rounded-full shadow-sm px-2.5 py-1 gap-2">
                                    {/* Nút - */}
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-blue-100 disabled:opacity-50 transition-all duration-300"
                                    >
                                        <FaMinus className="text-blue-600 text-xs" />
                                    </button>

                                    {/* INPUT số */}
                                    <input
                                        type="number"
                                        value={quantity}
                                        min={1}
                                        max={book.quantity}
                                        onFocus={() => {
                                            setPrevQuantity(quantity);
                                        }}
                                        onKeyPress={(e) => {
                                            // Chỉ cho phép số (0-9)
                                            if (!/[0-9]/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={(e) => {
                                            const val = e.target.value;

                                            // Nếu rỗng, set về null tạm thời
                                            if (val === "") {
                                                setQuantity(null as any);
                                                return;
                                            }

                                            // Chỉ chấp nhận số
                                            const num = parseInt(val);
                                            if (isNaN(num)) {
                                                return; // Không làm gì nếu không phải số
                                            }

                                            // Nếu nhỏ hơn 1, set về 1
                                            if (num < 1) {
                                                setQuantity(1);
                                                return;
                                            }

                                            // Nếu lớn hơn tồn kho, set về book.quantity
                                            if (num > (book.quantity || 1)) {
                                                setQuantity(book.quantity);
                                                return;
                                            }

                                            // Set giá trị hợp lệ
                                            setQuantity(num);
                                        }}
                                        onBlur={() => {
                                            // Parse số lượng hiện tại
                                            const currentQty =
                                                parseInt(String(quantity)) || 1;

                                            // Nếu nhỏ hơn 1 hoặc NaN, set về 1
                                            if (
                                                currentQty < 1 ||
                                                isNaN(currentQty)
                                            ) {
                                                setQuantity(1);
                                                return;
                                            }

                                            // Nếu vượt quá tồn kho, set về book.quantity
                                            if (
                                                currentQty >
                                                (book.quantity || 1)
                                            ) {
                                                setQuantity(book.quantity);
                                            }
                                        }}
                                        className="w-12 text-center font-semibold text-base text-gray-900 outline-none bg-transparent rounded-full"
                                    />

                                    {/* Nút + */}
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={
                                            quantity >= (book.quantity || 1)
                                        }
                                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-blue-100 disabled:opacity-50 transition-all duration-300"
                                    >
                                        <FaPlus className="text-blue-600 text-xs" />
                                    </button>
                                </div>

                                {/* Block trạng thái tồn kho (đẹp – căn giữa) */}
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border-2 border-blue-200 shadow-sm">
                                    <span className="text-blue-700 font-semibold text-sm">
                                        Còn
                                    </span>
                                    <span className="text-blue-900 font-bold text-sm">
                                        {book.quantity}
                                    </span>
                                    <span className="text-blue-700 text-sm">
                                        sản phẩm
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-5 w-full">
                            {/* Nút MUA NGAY */}
                            <button
                                onClick={handleBuyNow}
                                disabled={!book.quantity || book.quantity <= 0}
                                className="
            flex-1 
            bg-white 
            text-blue-600 
            border-2 border-blue-600
            font-semibold 
            text-sm
            py-2.5 px-5 
            rounded-full 
            flex items-center justify-center gap-2 
            transition-all duration-500
            shadow-md
            hover:bg-blue-600 hover:text-white
            hover:shadow-lg hover:shadow-blue-300/50
            hover:scale-105
            disabled:opacity-50 disabled:cursor-not-allowed
        "
                            >
                                <FaShoppingCart className="text-base transition-all" />
                                Mua ngay
                            </button>

                            {/* Nút THÊM VÀO GIỎ */}
                            <button
                                onClick={handleAddToCart}
                                disabled={!book.quantity || book.quantity <= 0}
                                className="
        flex-1 
        bg-blue-600 
        text-white 
        border-2 border-blue-600
        font-semibold 
        text-sm
        py-2.5 px-5 
        rounded-full 
        flex items-center justify-center gap-2 
        transition-all duration-500
        shadow-md
        hover:bg-blue-700
        hover:shadow-lg hover:shadow-blue-400/50
        hover:scale-105
        disabled:opacity-50 disabled:cursor-not-allowed
    "
                            >
                                <FaShoppingCart className="text-base transition-all" />
                                Thêm vào giỏ hàng
                            </button>
                        </div>

                        {/* Social Share */}
                        <div className="mb-5">
                            <p className="font-semibold text-gray-700 text-sm mb-2">
                                Chia sẻ:
                            </p>
                            <div className="flex gap-2">
                                <button className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all duration-300 shadow-md">
                                    <FaFacebookF className="text-sm" />
                                </button>
                                <button className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 hover:scale-110 transition-all duration-300 shadow-md">
                                    <FaTwitter className="text-sm" />
                                </button>
                                <button className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 hover:scale-110 transition-all duration-300 shadow-md">
                                    <FaPinterest className="text-sm" />
                                </button>
                            </div>
                        </div>

                        {/* Services Section */}
                        <div className="mt-6 pt-6 border-t-2 border-gray-200">
                            <h3 className="font-bold text-gray-800 text-base mb-4">
                                Dịch vụ của chúng tôi
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg
                                            className="w-4 h-4 text-blue-600"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            Giao tận nhà trong{" "}
                                            <span className="font-semibold text-blue-600">
                                                3 - 7 ngày làm việc
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg
                                            className="w-4 h-4 text-blue-600"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            Miễn phí giao hàng Toàn Quốc cho tất
                                            cả các đơn hàng khi mua tại{"  "}
                                            <span className="font-semibold text-blue-600">
                                                Wisdom Book
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Promotions Section */}
                        <div className="mt-6 pt-6 border-t-2 border-gray-200">
                            <h3 className="font-bold text-gray-800 text-base mb-4">
                                Dịch vụ & Khuyến mãi
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-xl flex-shrink-0 mt-0.5">
                                        📌
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Tặng kèm Bookmark (đánh dấu trang) cho
                                        các sách Ẩm thực, Kinh doanh, Thiếu nhi, Du lịch
                                    </p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-xl flex-shrink-0 mt-0.5">
                                        🎁
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        <span className="font-semibold text-blue-600">
                                            FREESHIP
                                        </span>{" "}
                                        cho tất cả các đơn hàng khi mua tại Wisdom Book
                                    </p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-xl flex-shrink-0 mt-0.5">
                                        🎁
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Tặng kèm {" "}
                                        <span className="font-semibold text-blue-600">
                                            VOUCHER lên đến 20K
                                        </span>{" "}
                                        cho tất cả các khách hàng tại Wisdom Book ngãu nhiên
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-100"
                >
                    {/* Tab Headers */}
                    <div className="flex border-b-2 border-blue-100 bg-blue-50/30">
                        {/* TAB 1 */}
                        <button
                            onClick={() => setActiveTab("description")}
                            className={`flex-1 py-4 px-6 font-semibold flex items-center justify-center gap-2 transition-all duration-500 relative
            ${
                activeTab === "description"
                    ? "text-blue-600 bg-white"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
            }`}
                        >
                            {activeTab === "description" && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <BookOpen className="w-5 h-5" />
                            <span>Mô tả sản phẩm</span>
                        </button>

                        {/* TAB 2 */}
                        <button
                            onClick={() => setActiveTab("specs")}
                            className={`flex-1 py-4 px-6 font-semibold flex items-center justify-center gap-2 transition-all duration-500 relative
            ${
                activeTab === "specs"
                    ? "text-blue-600 bg-white"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
            }`}
                        >
                            {activeTab === "specs" && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <Info className="w-5 h-5" />
                            <span>Thông tin sách</span>
                        </button>

                        {/* TAB 3 */}
                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`flex-1 py-4 px-6 font-semibold flex items-center justify-center gap-2 transition-all duration-500 relative
            ${
                activeTab === "reviews"
                    ? "text-blue-600 bg-white"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
            }`}
                        >
                            {activeTab === "reviews" && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <MessageSquare className="w-5 h-5" />
                            <span>
                                Đánh giá{" "}
                                {reviewCount > 0 ? `(${reviewCount})` : ""}
                            </span>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === "description" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="prose max-w-none"
                            >
                                {book.shortDes && (
                                    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-gray-800 font-medium">
                                            {book.shortDes}
                                        </p>
                                    </div>
                                )}
                                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {book.description ||
                                        "Đang cập nhật mô tả sản phẩm..."}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "specs" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="grid md:grid-cols-2 gap-4"
                            >
                                <div className="flex py-3 border-b border-gray-200">
                                    <span className="font-semibold text-gray-700 w-48">
                                        Tác giả:
                                    </span>
                                    <span className="text-gray-900">
                                        {book.author}
                                    </span>
                                </div>
                                <div className="flex py-3 border-b border-gray-200">
                                    <span className="font-semibold text-gray-700 w-48">
                                        ISBN:
                                    </span>
                                    <span className="text-gray-900">
                                        {book.isbn}
                                    </span>
                                </div>
                                <div className="flex py-3 border-b border-gray-200">
                                    <span className="font-semibold text-gray-700 w-48">
                                        Năm xuất bản:
                                    </span>
                                    <span className="text-gray-900">
                                        {book.yearOfPublication ||
                                            "Đang cập nhật"}
                                    </span>
                                </div>
                                {book.supplier && (
                                    <>
                                        <div className="flex py-3 border-b border-gray-200">
                                            <span className="font-semibold text-gray-700 w-48">
                                                Nhà cung cấp:
                                            </span>
                                            <span className="text-gray-900">
                                                {book.supplier.companyName}
                                            </span>
                                        </div>
                                        <div className="flex py-3 border-b border-gray-200">
                                            <span className="font-semibold text-gray-700 w-48">
                                                Điện thoại NCC:
                                            </span>
                                            <span className="text-gray-900">
                                                {book.supplier.phone}
                                            </span>
                                        </div>
                                        <div className="flex py-3 border-b border-gray-200">
                                            <span className="font-semibold text-gray-700 w-48">
                                                Email NCC:
                                            </span>
                                            <span className="text-gray-900">
                                                {book.supplier.email}
                                            </span>
                                        </div>
                                    </>
                                )}
                                <div className="flex py-3 border-b border-gray-200">
                                    <span className="font-semibold text-gray-700 w-48">
                                        Số lượng:
                                    </span>
                                    <span className="text-gray-900">
                                        {book.quantity} cuốn
                                    </span>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "reviews" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {book.review && book.review.length > 0 ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 pb-6 border-b border-blue-200">
                                            <div className="text-center">
                                                <div className="text-5xl font-bold text-blue-600 mb-2">
                                                    {averageRating.toFixed(1)}
                                                </div>
                                                <div className="flex items-center gap-1 mb-1">
                                                    {[...Array(5)].map(
                                                        (_, i) => (
                                                            <FaStar
                                                                key={i}
                                                                className={`${
                                                                    i <
                                                                    Math.floor(
                                                                        averageRating
                                                                    )
                                                                        ? "text-yellow-400"
                                                                        : "text-gray-300"
                                                                }`}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {reviewCount} đánh giá
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {book.review.map((review) => (
                                                <div
                                                    key={review.id}
                                                    className="p-4 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {[...Array(5)].map(
                                                            (_, i) => (
                                                                <FaStar
                                                                    key={i}
                                                                    className={`text-sm ${
                                                                        i <
                                                                        review.rating
                                                                            ? "text-yellow-400"
                                                                            : "text-gray-300"
                                                                    }`}
                                                                />
                                                            )
                                                        )}
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(
                                                                review.reviewDate
                                                            ).toLocaleDateString(
                                                                "vi-VN"
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700">
                                                        {review.comment}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-600 text-lg">
                                            Chưa có đánh giá nào cho sản phẩm
                                            này.
                                        </p>
                                        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105">
                                            Viết đánh giá đầu tiên
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Related Books Section - Same Category */}
                {suggestedBooks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-16"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Sách Cùng Thể Loại
                            </h2>
                            {book?.category && book.category.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {book.category.slice(0, 3).map((cat) => (
                                        <span
                                            key={cat.id}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                                        >
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {suggestedBooks.map((suggestedBook, idx) => (
                                <BookCard
                                    key={suggestedBook.id}
                                    book={suggestedBook}
                                    index={idx}
                                    showAddToCart={true}
                                    variant="default"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
