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
    const { books } = useBooks();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Random 10 suggested books (excluding current book)
    const suggestedBooks = useMemo(() => {
        if (!books || books.length === 0 || !id) return [];
        const filtered = books.filter((b) => b.id !== parseInt(id));
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 10);
    }, [books, id]);

    useEffect(() => {
        if (id) {
            fetchBookDetail(parseInt(id));
        }
    }, [id]);

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
    const handleAddToCart = () => {
        if (!book) {
            toast.error("Không tìm thấy sách!");
            return; // thoát nếu book null
        }
        if (!book || quantity < 1 || quantity > book.quantity) {
            toast.error(
                quantity < 1
                    ? "Số lượng phải lớn hơn 0!"
                    : `Số lượng vượt quá tồn kho! Chỉ còn ${book?.quantity} cuốn.`
            );
            return;
        }

        // TODO: gọi hàm addToCart thật sự
        dispatch(
            addItem({
                bookId: book.id,
                quantity,
            })
        );
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
        <div className="min-h-screen wisbook-gradient-overlay pt-20 px-35">
            <div className="container mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                    <Link
                        to="/"
                        className="hover:text-purple-600 transition-colors"
                    >
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <Link
                        to="/books"
                        className="hover:text-purple-600 transition-colors"
                    >
                        Sách
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">
                        {book.title}
                    </span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Main Image */}
                        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-4 group">
                            <div
                                className="w-full h-[600px] flex items-center justify-center p-10 rounded-xl border border-gray-200 shadow-sm overflow-hidden cursor-grab active:cursor-grabbing"
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
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    >
                                        <FaChevronLeft className="text-purple-600" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    >
                                        <FaChevronRight className="text-purple-600" />
                                    </button>
                                </>
                            )}

                            {/* Badge */}
                            {book.status === "SALE" && (
                                <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-semibold">
                                    Hot
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-5 gap-3">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleImageChange(index)}
                                        className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                                            selectedImage === index
                                                ? "border-purple-600 shadow-lg"
                                                : "border-gray-200 hover:border-purple-300"
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
                        className="bg-white rounded-2xl shadow-xl p-8 w-5/6"
                    >
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {book.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={`text-lg ${
                                            i < Math.floor(averageRating)
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-gray-600">
                                {averageRating > 0
                                    ? `${averageRating.toFixed(
                                          1
                                      )} (${reviewCount} đánh giá)`
                                    : "(Chưa có đánh giá)"}
                            </span>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-4xl font-bold wisbook-gradient-text">
                                    {book.sellingPrice?.toLocaleString("vi-VN")}
                                    ₫
                                </span>
                                {book.importPrice &&
                                    book.importPrice > book.sellingPrice && (
                                        <span className="text-xl text-gray-400 line-through">
                                            {book.importPrice.toLocaleString(
                                                "vi-VN"
                                            )}
                                            ₫
                                        </span>
                                    )}
                            </div>

                            <div className="text-lg font-semibold">
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
                        <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                            <div className="flex gap-3">
                                <span className="font-semibold text-gray-700 w-32">
                                    Tác giả:
                                </span>
                                <span className="text-gray-900">
                                    {book.author}
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <span className="font-semibold text-gray-700 w-32">
                                    ISBN:
                                </span>
                                <span className="text-gray-900">
                                    {book.isbn}
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <span className="font-semibold text-gray-700 w-32">
                                    Năm xuất bản:
                                </span>
                                <span className="text-gray-900">
                                    {book.yearOfPublication || "Đang cập nhật"}
                                </span>
                            </div>
                            {book.supplier && (
                                <div className="flex gap-3">
                                    <span className="font-semibold text-gray-700 w-32">
                                        Nhà cung cấp:
                                    </span>
                                    <span className="text-gray-900">
                                        {book.supplier.companyName}
                                    </span>
                                </div>
                            )}
                            {book.category && book.category.length > 0 && (
                                <div className="flex gap-3">
                                    <span className="font-semibold text-gray-700 w-32">
                                        Thể loại:
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {book.category.map((cat) => (
                                            <span
                                                key={cat.id}
                                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                                            >
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="mb-6">
                            <div className="flex items-center gap-6">
                                <label className="font-semibold text-gray-700">
                                    Số lượng:
                                </label>
                                {/* Input số lượng */}
                                <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-3 py-1.5 gap-2">
                                    {/* Nút - */}
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50 transition"
                                    >
                                        <FaMinus className="text-gray-600 text-sm" />
                                    </button>

                                    {/* INPUT số */}
                                    <input
                                        type="number"
                                        value={quantity}
                                        min={1}
                                        onFocus={() => {
                                            setPrevQuantity(quantity);
                                        }}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === "") {
                                                setQuantity(null as any);
                                                return;
                                            }
                                            const num = parseInt(val);
                                            if (!isNaN(num) && num >= 1) {
                                                setQuantity(num);
                                            }
                                        }}
                                        onBlur={() => {
                                            if (
                                                quantity > (book.quantity || 1)
                                            ) {
                                                toast.error(
                                                    `Số lượng vượt quá tồn kho!\n Chỉ còn ${book?.quantity} cuốn.`
                                                );
                                                setQuantity(prevQuantity);
                                            }
                                        }}
                                        className="w-14 text-center font-semibold text-lg text-gray-900 outline-none bg-transparent rounded-full"
                                    />

                                    {/* Nút + */}
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={
                                            quantity >= (book.quantity || 1)
                                        }
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50 transition"
                                    >
                                        <FaPlus className="text-gray-600 text-sm" />
                                    </button>
                                </div>

                                {/* Block trạng thái tồn kho (đẹp – căn giữa) */}
                                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 shadow">
                                    <span className="text-green-700 font-semibold">
                                        Còn
                                    </span>
                                    <span className="text-green-900 font-bold">
                                        {book.quantity}
                                    </span>
                                    <span className="text-green-700">
                                        sản phẩm
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-6 w-full">
                            {/* Nút MUA NGAY */}
                            <button
                                onClick={handleBuyNow}
                                disabled={!book.quantity || book.quantity <= 0}
                                className="
            flex-1 
            bg-white 
            text-blue-600 
            border border-blue-600
            font-semibold 
            py-3 px-6 
            rounded-full 
            flex items-center justify-center gap-2 
            transition-all duration-300
            shadow-sm
            hover:shadow-lg hover:shadow-blue-300/40
            disabled:opacity-50 disabled:cursor-not-allowed
        "
                            >
                                <FaShoppingCart className="text-lg transition-all" />
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
        border border-blue-600
        font-semibold 
        py-3 px-6 
        rounded-full 
        flex items-center justify-center gap-2 
        transition-all duration-300
        shadow-md
        hover:shadow-lg hover:shadow-blue-300/40
        disabled:opacity-50 disabled:cursor-not-allowed
    "
                            >
                                <FaShoppingCart className="text-lg transition-all" />
                                Thêm vào giỏ hàng
                            </button>
                        </div>

                        {/* Social Share */}
                        <div>
                            <p className="font-semibold text-gray-700 mb-3">
                                Chia sẻ:
                            </p>
                            <div className="flex gap-3">
                                <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                                    <FaFacebookF />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors">
                                    <FaTwitter />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors">
                                    <FaPinterest />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Tab Headers */}
                    <div className="flex border-b border-gray-200">
                        {/* TAB 1 */}
                        <button
                            onClick={() => setActiveTab("description")}
                            className={`flex-1 py-4 px-6 font-semibold flex items-center justify-center gap-2 transition-all
            ${
                activeTab === "description"
                    ? "wisbook-gradient-text border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-gray-900"
            }`}
                        >
                            <BookOpen className="w-5 h-5 text-amber-600" />
                            <span>Mô tả sản phẩm</span>
                        </button>

                        {/* TAB 2 */}
                        <button
                            onClick={() => setActiveTab("specs")}
                            className={`flex-1 py-4 px-6 font-semibold flex items-center justify-center gap-2 transition-all
            ${
                activeTab === "specs"
                    ? "wisbook-gradient-text border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-gray-900"
            }`}
                        >
                            <Info className="w-5 h-5 text-amber-600" />
                            <span>Thông tin sách</span>
                        </button>

                        {/* TAB 3 */}
                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`flex-1 py-4 px-6 font-semibold flex items-center justify-center gap-2 transition-all
            ${
                activeTab === "reviews"
                    ? "wisbook-gradient-text border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-gray-900"
            }`}
                        >
                            <MessageSquare className="w-5 h-5 text-amber-600" />
                            <span>
                                Đánh giá{" "}
                                {reviewCount > 0 ? `(${reviewCount})` : ""}
                            </span>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === "description" && (
                            <div className="prose max-w-none">
                                {book.shortDes && (
                                    <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                                        <p className="text-gray-800 font-medium">
                                            {book.shortDes}
                                        </p>
                                    </div>
                                )}
                                <div
                                    className="text-gray-700 leading-relaxed prose max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            book.description ||
                                            "<p>Đang cập nhật mô tả sản phẩm...</p>",
                                    }}
                                />
                            </div>
                        )}

                        {activeTab === "specs" && (
                            <div className="grid md:grid-cols-2 gap-4">
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
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div>
                                {book.review && book.review.length > 0 ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 pb-6 border-b">
                                            <div className="text-center">
                                                <div className="text-5xl font-bold wisbook-gradient-text mb-2">
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
                                        <button className="mt-4 wisbook-btn-gradient text-white font-semibold py-2 px-6 rounded-lg">
                                            Viết đánh giá đầu tiên
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Suggested Books Section */}
                {suggestedBooks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-16"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">
                            Gợi Ý Cho Bạn
                        </h2>
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
