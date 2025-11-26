import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaPlus,
    FaSync,
    FaEdit,
    FaTrash,
    FaEye,
    FaCog,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
    FaSave,
} from "react-icons/fa";
import bookApi from "../../api/bookApi";
import { Book } from "../../types";
import toast from "react-hot-toast";

export default function BookManagement() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBooks, setTotalBooks] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchAuthor, setSearchAuthor] = useState("");
    const [searchPublisher, setSearchPublisher] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [showColumnConfig, setShowColumnConfig] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
        "create"
    );
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [formData, setFormData] = useState<Partial<Book>>({
        title: "",
        author: "",
        publisher: "",
        yearOfPublication: new Date().getFullYear(),
        originalPrice: 0,
        sellingPrice: 0,
        quantity: 0,
        description: "",
        status: "AVAILABLE",
    });

    // Column visibility state
    const [visibleColumns, setVisibleColumns] = useState({
        stt: true,
        title: true,
        author: true,
        publisher: true,
        price: true,
        quantity: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        actions: true,
    });

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBooks();
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(timer);
    }, [searchTerm, searchAuthor, searchPublisher]);

    useEffect(() => {
        fetchBooks();
    }, [currentPage, selectedStatus, selectedLevel, pageSize]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const filterParts: string[] = [];

            if (searchTerm.trim()) {
                filterParts.push(`title~'*${searchTerm}*'`);
            }

            if (searchAuthor.trim()) {
                filterParts.push(`author~'*${searchAuthor}*'`);
            }

            if (searchPublisher.trim()) {
                filterParts.push(`publisher~'*${searchPublisher}*'`);
            }

            if (selectedStatus) {
                filterParts.push(`status:'${selectedStatus}'`);
            }

            const filterQuery = filterParts.join(" and ");

            const response = await bookApi.getAllBooks({
                page: currentPage,
                size: pageSize,
                sort: "createdAt,desc",
                filter: filterQuery || undefined,
            });

            if (response.data) {
                const { result, meta } = response.data;
                setBooks(result || []);
                setTotalPages(meta?.pages || 1);
                setTotalBooks(meta?.total || 0);
            }
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setCurrentPage(0);
        fetchBooks();
    };

    const handleReset = () => {
        setSearchTerm("");
        setSearchAuthor("");
        setSearchPublisher("");
        setSelectedStatus("");
        setSelectedLevel("");
        setCurrentPage(0);
    };

    // Get stock status based on quantity
    const getStockStatus = (quantity: number) => {
        if (quantity === 0) {
            return {
                label: "Hết hàng",
                className: "bg-red-100 text-red-800",
            };
        } else if (quantity < 10) {
            return {
                label: "Gần hết hàng",
                className: "bg-yellow-100 text-yellow-800",
            };
        } else {
            return {
                label: "Còn hàng",
                className: "bg-green-100 text-green-800",
            };
        }
    };

    const openCreateModal = () => {
        setModalMode("create");
        setFormData({
            title: "",
            author: "",
            publisher: "",
            yearOfPublication: new Date().getFullYear(),
            originalPrice: 0,
            sellingPrice: 0,
            quantity: 0,
            description: "",
            status: "AVAILABLE",
        });
        setSelectedBook(null);
        setShowModal(true);
    };

    const openEditModal = (book: Book) => {
        setModalMode("edit");
        setFormData(book);
        setSelectedBook(book);
        setShowModal(true);
    };

    const openViewModal = async (book: Book) => {
        try {
            // Fetch full book details including images
            const response = await bookApi.getBookById(book.id);
            const fullBookData = response.data;

            // Convert bookImage array to image array with full S3 URLs
            if (fullBookData.bookImage && fullBookData.bookImage.length > 0) {
                fullBookData.image = fullBookData.bookImage.map(
                    (img) =>
                        `https://hai-project-images.s3.us-east-1.amazonaws.com/${img.imagePath}`
                );
            }

            setModalMode("view");
            setFormData(fullBookData);
            setSelectedBook(fullBookData);
            setSelectedImageIndex(0); // Reset to first image
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching book details:", error);
            toast.error("Không thể tải thông tin sách!");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBook(null);
        setFormData({
            title: "",
            author: "",
            publisher: "",
            yearOfPublication: new Date().getFullYear(),
            originalPrice: 0,
            sellingPrice: 0,
            quantity: 0,
            description: "",
            status: "AVAILABLE",
        });
    };

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: [
                "originalPrice",
                "sellingPrice",
                "quantity",
                "yearOfPublication",
            ].includes(name)
                ? Number(value)
                : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            console.log("Submitting form data:", formData);
            console.log("Modal mode:", modalMode);
            console.log("Selected book:", selectedBook);

            if (modalMode === "create") {
                const response = await bookApi.createBook(formData);
                console.log("Create response:", response);
                toast.success("Thêm sách thành công!");
            } else if (modalMode === "edit" && selectedBook) {
                const response = await bookApi.updateBook(
                    selectedBook.id,
                    formData
                );
                console.log("Update response:", response);
                toast.success("Cập nhật sách thành công!");
            }

            closeModal();
            fetchBooks();
        } catch (error: any) {
            console.error("Error saving book:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error message:", error.message);

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Có lỗi xảy ra!";
            toast.error(errorMessage);
        }
    };

    const openDeleteConfirm = (book: Book) => {
        setBookToDelete(book);
        setShowDeleteConfirm(true);
    };

    const closeDeleteConfirm = () => {
        setBookToDelete(null);
        setShowDeleteConfirm(false);
    };

    const handleDelete = async () => {
        if (!bookToDelete) return;

        try {
            // Update status to OUT_OF_STOCK instead of deleting
            await bookApi.updateBook(bookToDelete.id, {
                ...bookToDelete,
                status: "OUT_OF_STOCK",
            });
            toast.success("Đã ngừng bán sách này!");
            closeDeleteConfirm();
            fetchBooks();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
            console.error("Error updating book status:", error);
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const toggleColumn = (column: keyof typeof visibleColumns) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [column]: !prev[column],
        }));
    };

    const toggleAllColumns = () => {
        const allChecked = Object.values(visibleColumns).every((v) => v);
        const newState = Object.keys(visibleColumns).reduce(
            (acc, key) => ({
                ...acc,
                [key]: !allChecked,
            }),
            {} as typeof visibleColumns
        );
        setVisibleColumns(newState);
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages - 1, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(0, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded ${
                        currentPage === i
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                >
                    {i + 1}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-10">
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md p-6 mb-6"
                >
                    <h1 className="text-3xl font-bold wisbook-gradient-text mb-6">
                        Quản Lý Sách
                    </h1>

                    {/* Filter Section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên sách:
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập tên sách"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tác giả:
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập tên tác giả"
                                value={searchAuthor}
                                onChange={(e) =>
                                    setSearchAuthor(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái:
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) =>
                                    setSelectedStatus(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            >
                                <option value="">Chọn trạng thái</option>
                                <option value="AVAILABLE">Còn hàng</option>
                                <option value="SALE">Đang giảm giá</option>
                                <option value="OUT_OF_STOCK">Hết hàng</option>
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleReset}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-semibold transition-colors"
                            >
                                Làm lại
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Table Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                    {/* Table Header Actions */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Danh sách Sách
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={openCreateModal}
                                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold transition-colors"
                            >
                                <FaPlus /> Thêm mới
                            </button>
                            <button
                                onClick={handleRefresh}
                                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                title="Làm mới"
                            >
                                <FaSync className="text-gray-600" />
                            </button>
                            <button
                                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                title="Import"
                            >
                                <FaEdit className="text-gray-600" />
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setShowColumnConfig(!showColumnConfig)
                                    }
                                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                    title="Cấu hình cột"
                                >
                                    <FaCog className="text-gray-600" />
                                </button>

                                {/* Column Config Dropdown */}
                                {showColumnConfig && (
                                    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 w-64">
                                        <div className="flex items-center justify-between mb-3 pb-2 border-b">
                                            <span className="font-semibold text-gray-700">
                                                Cấu hình
                                            </span>
                                            <button
                                                onClick={toggleAllColumns}
                                                className="text-sm text-blue-500 hover:text-blue-600"
                                            >
                                                Cột hiện thị
                                            </button>
                                        </div>
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            {Object.entries(visibleColumns).map(
                                                ([key, value]) => (
                                                    <label
                                                        key={key}
                                                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={value}
                                                            onChange={() =>
                                                                toggleColumn(
                                                                    key as keyof typeof visibleColumns
                                                                )
                                                            }
                                                            className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm text-gray-700">
                                                            {key === "stt" &&
                                                                "STT"}
                                                            {key === "title" &&
                                                                "Tên sách"}
                                                            {key === "author" &&
                                                                "Tác giả"}
                                                            {key ===
                                                                "publisher" &&
                                                                "Nhà xuất bản"}
                                                            {key === "price" &&
                                                                "Giá bán"}
                                                            {key ===
                                                                "quantity" &&
                                                                "Số lượng"}
                                                            {key === "status" &&
                                                                "Trạng thái"}
                                                            {key ===
                                                                "createdAt" &&
                                                                "CreatedAt"}
                                                            {key ===
                                                                "updatedAt" &&
                                                                "UpdatedAt"}
                                                            {key ===
                                                                "actions" &&
                                                                "Actions"}
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                        <button
                                            onClick={() =>
                                                setShowColumnConfig(false)
                                            }
                                            className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                                        >
                                            Làm lại
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {visibleColumns.stt && (
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            STT
                                        </th>
                                    )}
                                    {visibleColumns.title && (
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Tên Sách
                                        </th>
                                    )}
                                    {visibleColumns.author && (
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Tác giả
                                        </th>
                                    )}
                                    {visibleColumns.publisher && (
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Nhà xuất bản
                                        </th>
                                    )}
                                    {visibleColumns.price && (
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Giá bán
                                        </th>
                                    )}
                                    {visibleColumns.quantity && (
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Số lượng
                                        </th>
                                    )}
                                    {visibleColumns.status && (
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Trạng thái
                                        </th>
                                    )}
                                    {visibleColumns.createdAt && (
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            CreatedAt
                                        </th>
                                    )}
                                    {visibleColumns.updatedAt && (
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            UpdatedAt
                                        </th>
                                    )}
                                    {visibleColumns.actions && (
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={
                                                Object.values(
                                                    visibleColumns
                                                ).filter((v) => v).length
                                            }
                                            className="px-4 py-8 text-center text-gray-500"
                                        >
                                            Đang tải dữ liệu...
                                        </td>
                                    </tr>
                                ) : books.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={
                                                Object.values(
                                                    visibleColumns
                                                ).filter((v) => v).length
                                            }
                                            className="px-4 py-8 text-center text-gray-500"
                                        >
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                ) : (
                                    books.map((book, index) => (
                                        <tr
                                            key={book.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            {visibleColumns.stt && (
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {currentPage * pageSize +
                                                        index +
                                                        1}
                                                </td>
                                            )}
                                            {visibleColumns.title && (
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium max-w-xs truncate">
                                                    {book.title}
                                                </td>
                                            )}
                                            {visibleColumns.author && (
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {book.author}
                                                </td>
                                            )}
                                            {visibleColumns.publisher && (
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {book.publisher || "N/A"}
                                                </td>
                                            )}
                                            {visibleColumns.price && (
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {book.sellingPrice?.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    ₫
                                                </td>
                                            )}
                                            {visibleColumns.quantity && (
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {book.quantity || 0}
                                                </td>
                                            )}
                                            {visibleColumns.status &&
                                                (() => {
                                                    const stockStatus =
                                                        getStockStatus(
                                                            book.quantity || 0
                                                        );
                                                    return (
                                                        <td className="px-4 py-3">
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.className}`}
                                                            >
                                                                {
                                                                    stockStatus.label
                                                                }
                                                            </span>
                                                        </td>
                                                    );
                                                })()}
                                            {visibleColumns.createdAt && (
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {book.createdAt
                                                        ? new Date(
                                                              book.createdAt
                                                          ).toLocaleString(
                                                              "vi-VN"
                                                          )
                                                        : "N/A"}
                                                </td>
                                            )}
                                            {visibleColumns.updatedAt && (
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {book.updatedAt
                                                        ? new Date(
                                                              book.updatedAt
                                                          ).toLocaleString(
                                                              "vi-VN"
                                                          )
                                                        : "N/A"}
                                                </td>
                                            )}
                                            {visibleColumns.actions && (
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                openViewModal(
                                                                    book
                                                                )
                                                            }
                                                            title="Xem"
                                                            className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                openEditModal(
                                                                    book
                                                                )
                                                            }
                                                            title="Sửa"
                                                            className="p-1.5 hover:bg-yellow-50 rounded text-yellow-600 transition-colors"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                openDeleteConfirm(
                                                                    book
                                                                )
                                                            }
                                                            title="Ngừng bán"
                                                            className="p-1.5 hover:bg-red-50 rounded text-red-600 transition-colors"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                        <div className="text-sm text-gray-700">
                            {currentPage * pageSize + 1}-
                            {Math.min((currentPage + 1) * pageSize, totalBooks)}{" "}
                            trên {totalBooks} rows
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 0}
                                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaChevronLeft className="text-gray-600" />
                            </button>

                            <div className="flex gap-1">
                                {renderPagination()}
                            </div>

                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages - 1}
                                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaChevronRight className="text-gray-600" />
                            </button>

                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(0); // Reset to first page
                                }}
                                className="ml-2 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            >
                                <option value={10}>10 / trang</option>
                                <option value={20}>20 / trang</option>
                                <option value={50}>50 / trang</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* CRUD Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) closeModal();
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
                            >
                                {/* Modal Header */}
                                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {modalMode === "create" &&
                                            "Thêm sách mới"}
                                        {modalMode === "edit" &&
                                            "Chỉnh sửa sách"}
                                        {modalMode === "view" &&
                                            "Chi tiết sách"}
                                    </h3>
                                    <button
                                        onClick={closeModal}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <FaTimes className="text-gray-600" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <form onSubmit={handleSubmit} className="p-6">
                                    {/* Book Images - Only in view mode */}
                                    {modalMode === "view" &&
                                        formData.image &&
                                        formData.image.length > 0 && (
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Hình ảnh sách (
                                                    {formData.image.length} ảnh)
                                                </label>

                                                {/* Main Image Display */}
                                                <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden mb-4 border-2 border-gray-200">
                                                    <img
                                                        src={
                                                            formData.image[
                                                                selectedImageIndex
                                                            ]
                                                        }
                                                        alt={`${
                                                            formData.title
                                                        } - ảnh ${
                                                            selectedImageIndex +
                                                            1
                                                        }`}
                                                        className="w-full h-full object-contain"
                                                    />

                                                    {/* Image Counter */}
                                                    <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                                                        {selectedImageIndex + 1}{" "}
                                                        /{" "}
                                                        {formData.image.length}
                                                    </div>

                                                    {/* Navigation Arrows */}
                                                    {formData.image.length >
                                                        1 && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    setSelectedImageIndex(
                                                                        (
                                                                            prev
                                                                        ) =>
                                                                            prev ===
                                                                            0
                                                                                ? formData.image!
                                                                                      .length -
                                                                                  1
                                                                                : prev -
                                                                                  1
                                                                    );
                                                                }}
                                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold transition-all z-10"
                                                            >
                                                                ‹
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    setSelectedImageIndex(
                                                                        (
                                                                            prev
                                                                        ) =>
                                                                            prev ===
                                                                            formData.image!
                                                                                .length -
                                                                                1
                                                                                ? 0
                                                                                : prev +
                                                                                  1
                                                                    );
                                                                }}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold transition-all z-10"
                                                            >
                                                                ›
                                                            </button>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Thumbnail Carousel */}
                                                {formData.image.length > 1 && (
                                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                                        {formData.image.map(
                                                            (img, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    type="button"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        setSelectedImageIndex(
                                                                            idx
                                                                        );
                                                                    }}
                                                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                                        idx ===
                                                                        selectedImageIndex
                                                                            ? "border-blue-500 ring-2 ring-blue-300"
                                                                            : "border-gray-300 hover:border-blue-400"
                                                                    }`}
                                                                >
                                                                    <img
                                                                        src={
                                                                            img
                                                                        }
                                                                        alt={`Thumbnail ${
                                                                            idx +
                                                                            1
                                                                        }`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Title */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tên sách{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title || ""}
                                                onChange={handleInputChange}
                                                disabled={modalMode === "view"}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-900"
                                            />
                                        </div>

                                        {/* Author */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tác giả{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="author"
                                                value={formData.author || ""}
                                                onChange={handleInputChange}
                                                disabled={modalMode === "view"}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-900"
                                            />
                                        </div>

                                        {/* Publisher */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nhà xuất bản
                                            </label>
                                            <input
                                                type="text"
                                                name="publisher"
                                                value={formData.publisher || ""}
                                                onChange={handleInputChange}
                                                disabled={modalMode === "view"}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-900"
                                            />
                                        </div>

                                        {/* Year of Publication */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Năm xuất bản
                                            </label>
                                            <input
                                                type="number"
                                                name="yearOfPublication"
                                                value={
                                                    formData.yearOfPublication ||
                                                    ""
                                                }
                                                onChange={handleInputChange}
                                                disabled={modalMode === "view"}
                                                min="1900"
                                                max={new Date().getFullYear()}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-900"
                                            />
                                        </div>

                                        {/* Original Price */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Giá gốc{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                name="originalPrice"
                                                value={
                                                    formData.originalPrice || ""
                                                }
                                                onChange={handleInputChange}
                                                disabled={modalMode === "view"}
                                                required
                                                min="0"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-900"
                                            />
                                        </div>

                                        {/* Selling Price */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Giá bán{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                name="sellingPrice"
                                                value={
                                                    formData.sellingPrice || ""
                                                }
                                                onChange={handleInputChange}
                                                disabled={modalMode === "view"}
                                                required
                                                min="0"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-900"
                                            />
                                        </div>

                                        {/* Quantity */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Số lượng{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={formData.quantity || ""}
                                                onChange={handleInputChange}
                                                disabled={modalMode === "view"}
                                                required
                                                min="0"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-900"
                                            />
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Trạng thái
                                            </label>
                                            <select
                                                name="status"
                                                value={
                                                    formData.status ||
                                                    "AVAILABLE"
                                                }
                                                onChange={handleInputChange}
                                                disabled={modalMode === "view"}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-900"
                                            >
                                                <option value="AVAILABLE">
                                                    Còn hàng
                                                </option>
                                                <option value="SALE">
                                                    Đang giảm giá
                                                </option>
                                                <option value="OUT_OF_STOCK">
                                                    Hết hàng
                                                </option>
                                            </select>
                                        </div>

                                        {/* Description */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mô tả
                                            </label>
                                            <textarea
                                                name="description"
                                                value={
                                                    formData.description || ""
                                                }
                                                onChange={handleInputChange}
                                                disabled={modalMode === "view"}
                                                rows={4}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-900"
                                            />
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    {modalMode !== "view" && (
                                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition-colors"
                                            >
                                                <FaSave />
                                                {modalMode === "create"
                                                    ? "Tạo mới"
                                                    : "Lưu thay đổi"}
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteConfirm && bookToDelete && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={closeDeleteConfirm}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-lg shadow-2xl w-full max-w-md"
                            >
                                {/* Confirm Header */}
                                <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                        <FaTrash className="text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-red-900">
                                        Xác nhận ngừng bán
                                    </h3>
                                </div>

                                {/* Confirm Body */}
                                <div className="p-6">
                                    <p className="text-gray-700 mb-2">
                                        Bạn có chắc muốn ngừng bán sách:
                                    </p>
                                    <p className="font-bold text-gray-900 text-lg mb-4">
                                        "{bookToDelete.title}"
                                    </p>
                                    <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                        <span className="font-semibold">
                                            Lưu ý:
                                        </span>{" "}
                                        Sách sẽ được chuyển sang trạng thái "Hết
                                        hàng" và không thể bán được nữa.
                                    </p>
                                </div>

                                {/* Confirm Footer */}
                                <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={closeDeleteConfirm}
                                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-semibold transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition-colors flex items-center gap-2"
                                    >
                                        <FaTrash />
                                        Ngừng bán
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
