import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaArrowLeft,
    FaEdit,
    FaChevronLeft,
    FaChevronRight,
    FaTag,
    FaCalendar,
    FaBox,
    FaDollarSign,
    FaInfoCircle,
} from "react-icons/fa";
import bookApi from "../../api/bookApi";
import { Book } from "../../types";
import toast from "react-hot-toast";

export default function ViewBookDetail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bookId = searchParams.get("id");
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        if (bookId) {
            fetchBookDetail(parseInt(bookId));
        }
    }, [bookId]);

    const fetchBookDetail = async (id: number) => {
        try {
            setLoading(true);
            const response = await bookApi.getBookById(id);
            const fullBookData = response.data;

            // Convert bookImage array to image array with full S3 URLs
            if (fullBookData.bookImage && fullBookData.bookImage.length > 0) {
                fullBookData.image = fullBookData.bookImage.map(
                    (img: any) =>
                        `https://hai-project-images.s3.us-east-1.amazonaws.com/${img.imagePath}`
                );
            }

            setBook(fullBookData);
        } catch (error) {
            console.error("Error fetching book details:", error);
            toast.error("Không thể tải thông tin sách!");
        } finally {
            setLoading(false);
        }
    };

    const handlePrevImage = () => {
        setSelectedImageIndex((prev) =>
            prev === 0 ? (book?.image?.length || 1) - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prev) =>
            prev === (book?.image?.length || 1) - 1 ? 0 : prev + 1
        );
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: any = {
            SALE: {
                label: "Đang bán",
                className: "bg-blue-100 text-blue-800 border-blue-200",
            },
            STOP_SALE: {
                label: "Ngừng bán",
                className: "bg-yellow-100 text-yellow-800 border-yellow-200",
            },
            OUT_STOCK: {
                label: "Hết hàng",
                className: "bg-red-100 text-red-800 border-red-200",
            },
        };
        return (
            statusConfig[status] || {
                label: status,
                className: "bg-gray-100 text-gray-800 border-gray-200",
            }
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-10 flex items-center justify-center">
                <div className="text-xl text-gray-600">Đang tải...</div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-10">
                <div className="container mx-auto px-6">
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-600">
                            Không tìm thấy sách
                        </p>
                        <button
                            onClick={() => navigate("/admin/books")}
                            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const statusBadge = getStatusBadge(book.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-10">
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex items-center justify-between"
                >
                    <button
                        onClick={() => navigate("/admin/books")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <FaArrowLeft />
                        <span className="font-semibold">Quay lại</span>
                    </button>
                    <button
                        onClick={() =>
                            navigate(`/admin/books/edit?id=${book.id}`)
                        }
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                        <FaEdit />
                        <span>Chỉnh sửa</span>
                    </button>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="grid lg:grid-cols-2 gap-8 p-8">
                        {/* Left - Images */}
                        <div>
                            <div className="sticky top-24">
                                {/* Main Image */}
                                <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-[4/5] mb-4">
                                    {book.image && book.image.length > 0 ? (
                                        <>
                                            <img
                                                src={
                                                    book.image[
                                                        selectedImageIndex
                                                    ]
                                                }
                                                alt={`${book.title} - ảnh ${
                                                    selectedImageIndex + 1
                                                }`}
                                                className="w-full h-full object-contain"
                                            />
                                            {book.image.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={
                                                            handlePrevImage
                                                        }
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                                                    >
                                                        <FaChevronLeft />
                                                    </button>
                                                    <button
                                                        onClick={
                                                            handleNextImage
                                                        }
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                                                    >
                                                        <FaChevronRight />
                                                    </button>
                                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
                                                        {selectedImageIndex + 1}{" "}
                                                        / {book.image.length}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <FaInfoCircle className="text-6xl" />
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Gallery */}
                                {book.image && book.image.length > 1 && (
                                    <div className="grid grid-cols-5 gap-2">
                                        {book.image.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setSelectedImageIndex(index)
                                                }
                                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                                    selectedImageIndex === index
                                                        ? "border-blue-500 shadow-lg scale-105"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Thumbnail ${
                                                        index + 1
                                                    }`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right - Details */}
                        <div className="space-y-6">
                            {/* Title & Status */}
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                    {book.title}
                                </h1>
                                <span
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${statusBadge.className}`}
                                >
                                    <FaTag />
                                    {statusBadge.label}
                                </span>
                            </div>

                            {/* Basic Info Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                                        <FaDollarSign />
                                        <span className="text-sm font-medium">
                                            Giá bán
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-900">
                                        {book.sellingPrice?.toLocaleString(
                                            "vi-VN"
                                        )}
                                        ₫
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                                    <div className="flex items-center gap-2 text-green-600 mb-2">
                                        <FaBox />
                                        <span className="text-sm font-medium">
                                            Số lượng
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-900">
                                        {book.quantity || 0}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                                        <FaDollarSign />
                                        <span className="text-sm font-medium">
                                            Giá nhập
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {book.importPrice?.toLocaleString(
                                            "vi-VN"
                                        )}
                                        ₫
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                                    <div className="flex items-center gap-2 text-amber-600 mb-2">
                                        <FaCalendar />
                                        <span className="text-sm font-medium">
                                            Năm XB
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-amber-900">
                                        {book.yearOfPublication}
                                    </p>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <DetailRow
                                    label="Tác giả"
                                    value={book.author}
                                />
                                <DetailRow label="ISBN" value={book.isbn} />
                                <DetailRow
                                    label="Nhà xuất bản"
                                    value={book.publisher || "N/A"}
                                />
                                <DetailRow
                                    label="Nhà cung cấp"
                                    value={book.supplier?.companyName || "N/A"}
                                />
                                {book.category && book.category.length > 0 && (
                                    <div className="flex gap-3">
                                        <span className="text-sm font-semibold text-gray-500 min-w-[120px]">
                                            Danh mục:
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {book.category.map((cat) => (
                                                <span
                                                    key={cat.id}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-200"
                                                >
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Short Description */}
                            {book.shortDes && (
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                                        Mô tả ngắn
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {book.shortDes}
                                    </p>
                                </div>
                            )}

                            {/* Full Description */}
                            {book.description && (
                                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                                        Mô tả chi tiết
                                    </h3>
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html: book.description,
                                        }}
                                    />
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="pt-4 border-t border-gray-200 text-sm text-gray-500 space-y-1">
                                {book.createdAt && (
                                    <p>
                                        <span className="font-medium">
                                            Tạo lúc:
                                        </span>{" "}
                                        {new Date(
                                            book.createdAt
                                        ).toLocaleString("vi-VN")}
                                    </p>
                                )}
                                {book.updatedAt && (
                                    <p>
                                        <span className="font-medium">
                                            Cập nhật:
                                        </span>{" "}
                                        {new Date(
                                            book.updatedAt
                                        ).toLocaleString("vi-VN")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// Helper component for detail rows
function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex gap-3">
            <span className="text-sm font-semibold text-gray-500 min-w-[120px]">
                {label}:
            </span>
            <span className="text-sm text-gray-900 font-medium">{value}</span>
        </div>
    );
}
