import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FaSortUp,
  FaSortDown,
  FaSort,
} from "react-icons/fa";
import bookApi from "../../api/bookApi";
import fileApi from "../../api/fileApi";
import { Book } from "../../types";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";

export default function BookManagement() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [searchPublisher, setSearchPublisher] = useState("");
  const [searchSupplier, setSearchSupplier] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Book>>({
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    yearOfPublication: new Date().getFullYear(),
    importPrice: 0,
    sellingPrice: 0,
    quantity: 0,
    shortDes: "",
    description: "",
    status: "SALE",
  });

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    stt: true,
    title: true,
    author: true,
    supplier: true,
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
  }, [searchTerm, searchAuthor, searchPublisher, searchSupplier]);

  useEffect(() => {
    fetchBooks();
  }, [
    currentPage,
    selectedStatus,
    selectedLevel,
    pageSize,
    sortBy,
    sortDirection,
  ]);

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

      if (searchSupplier.trim()) {
        filterParts.push(`supplier.companyName~'*${searchSupplier}*'`);
      }

      if (selectedStatus) {
        filterParts.push(`status=='${selectedStatus}'`);
      }

      const filterQuery = filterParts.join(" and ");
      const sortQuery = `${sortBy},${sortDirection}`;

      const response = await bookApi.getAllBooks({
        page: currentPage,
        size: pageSize,
        sort: sortQuery,
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
    setSearchSupplier("");
    setSelectedStatus("");
    setSelectedLevel("");
    setSortBy("createdAt");
    setSortDirection("desc");
    setCurrentPage(0);
  };

  // Handle column header click for sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle direction if same column
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // Set new column and default to ascending
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Render sort icon based on column state
  const renderSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <FaSortUp className="ml-1 text-blue-500" />
    ) : (
      <FaSortDown className="ml-1 text-blue-500" />
    );
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
    navigate("/admin/books/create");
  };

  const openEditModal = (book: Book) => {
    navigate(`/admin/books/edit?id=${book.id}`);
  };

  const openViewModal = async (book: Book) => {
    navigate(`/admin/books/view?id=${book.id}`);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setUploadedFiles([]);
    setPreviewImages([]);
    setFormData({
      title: "",
      author: "",
      isbn: "",
      publisher: "",
      yearOfPublication: new Date().getFullYear(),
      importPrice: 0,
      sellingPrice: 0,
      quantity: 0,
      shortDes: "",
      description: "",
      status: "SALE",
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
        "importPrice",
        "sellingPrice",
        "quantity",
        "yearOfPublication",
      ].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    // Validate file types
    const invalidFiles = fileArray.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error("Chỉ chấp nhận file ảnh (jpg, jpeg, png)!");
      return;
    }

    setUploadedFiles(fileArray);

    // Create preview URLs
    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);

    // Revoke the removed preview URL to free memory
    URL.revokeObjectURL(previewImages[index]);

    setUploadedFiles(newFiles);
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUploading(true);
      let imageFileNames: string[] = [];

      // Upload files if there are any
      if (uploadedFiles.length > 0) {
        toast.loading("Đang tải ảnh lên...", { id: "upload" });
        const uploadResponse = await fileApi.uploadFiles(
          uploadedFiles,
          "books"
        );

        if (uploadResponse.success && uploadResponse.data) {
          imageFileNames = uploadResponse.data.map((file) => file.fileName);
          toast.success(`Đã tải lên ${imageFileNames.length} ảnh thành công!`, {
            id: "upload",
          });
        } else {
          throw new Error("Upload failed");
        }
      }

      // Prepare book data with proper structure for backend
      const bookData: any = {
        isbn: formData.isbn,
        title: formData.title,
        author: formData.author,
        yearOfPublication: formData.yearOfPublication,
        shortDes: formData.shortDes || "",
        description: formData.description || "",
        sellingPrice: formData.sellingPrice,
        importPrice: formData.importPrice,
        status: formData.status,
        quantity: formData.quantity,
        // Add image array from uploaded files
        ...(imageFileNames.length > 0 && {
          image: imageFileNames,
        }),
        // Add categories (you can add UI for this later)
        categories: formData.category?.map((cat) => ({ id: cat.id })) || [],
        // Add supplier and inventory (default to id: 1 for now)
        supplier: { id: 1 },
        inventory: { id: 1 },
        // Entry form details (optional, can be empty array)
        entryFormDetails: [],
      };

      console.log("Submitting form data:", bookData);
      console.log("Modal mode:", modalMode);

      if (modalMode === "create") {
        const response = await bookApi.createBook(bookData);
        console.log("Create response:", response);
        toast.success("Thêm sách thành công!");
      } else if (modalMode === "edit" && selectedBook) {
        const response = await bookApi.updateBook(selectedBook.id, bookData);
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
    } finally {
      setIsUploading(false);
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
      // Update status to STOP_SALE instead of deleting
      await bookApi.updateBook(bookToDelete.id, {
        ...bookToDelete,
        status: "STOP_SALE",
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
    <AdminLayout>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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
                Nhà cung cấp:
              </label>
              <input
                type="text"
                placeholder="Nhập tên nhà cung cấp"
                value={searchSupplier}
                onChange={(e) => setSearchSupplier(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleReset}
                className="w-30 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
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
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-semibold transition-colors"
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
              <div className="relative">
                <button
                  onClick={() => setShowColumnConfig(!showColumnConfig)}
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
                    </div>
                    <div className="space-y-2 max-h-116 overflow-y-auto">
                      {Object.entries(visibleColumns).map(([key, value]) => (
                        <label
                          key={key}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() =>
                              toggleColumn(key as keyof typeof visibleColumns)
                            }
                            className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {key === "stt" && "STT"}
                            {key === "title" && "Tên sách"}
                            {key === "author" && "Tác giả"}
                            {key === "supplier" && "Nhà cung cấp"}
                            {key === "publisher" && "Nhà xuất bản"}
                            {key === "price" && "Giá bán"}
                            {key === "quantity" && "Số lượng"}
                            {key === "status" && "Trạng thái"}
                            {key === "createdAt" && "CreatedAt"}
                            {key === "updatedAt" && "UpdatedAt"}
                            {key === "actions" && "Actions"}
                          </span>
                        </label>
                      ))}
                    </div>
                    <button
                      onClick={() => toggleAllColumns()}
                      className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
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
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center">
                        Tên Sách
                        {renderSortIcon("title")}
                      </div>
                    </th>
                  )}
                  {visibleColumns.author && (
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("author")}
                    >
                      <div className="flex items-center">
                        Tác giả
                        {renderSortIcon("author")}
                      </div>
                    </th>
                  )}
                  {visibleColumns.supplier && (
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("supplier.companyName")}
                    >
                      <div className="flex items-center">
                        Nhà cung cấp
                        {renderSortIcon("supplier.companyName")}
                      </div>
                    </th>
                  )}
                  {visibleColumns.publisher && (
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("publisher")}
                    >
                      <div className="flex items-center">
                        Nhà xuất bản
                        {renderSortIcon("publisher")}
                      </div>
                    </th>
                  )}
                  {visibleColumns.price && (
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("sellingPrice")}
                    >
                      <div className="flex items-center">
                        Giá bán
                        {renderSortIcon("sellingPrice")}
                      </div>
                    </th>
                  )}
                  {visibleColumns.quantity && (
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("quantity")}
                    >
                      <div className="flex items-center">
                        Số lượng
                        {renderSortIcon("quantity")}
                      </div>
                    </th>
                  )}
                  {visibleColumns.status && (
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Trạng thái
                    </th>
                  )}
                  {visibleColumns.createdAt && (
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        CreatedAt
                        {renderSortIcon("createdAt")}
                      </div>
                    </th>
                  )}
                  {visibleColumns.updatedAt && (
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("updatedAt")}
                    >
                      <div className="flex items-center">
                        UpdatedAt
                        {renderSortIcon("updatedAt")}
                      </div>
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
                        Object.values(visibleColumns).filter((v) => v).length
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
                        Object.values(visibleColumns).filter((v) => v).length
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
                          {currentPage * pageSize + index + 1}
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
                      {visibleColumns.supplier && (
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {book.supplier?.companyName || "N/A"}
                        </td>
                      )}
                      {visibleColumns.publisher && (
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {book.publisher || "N/A"}
                        </td>
                      )}
                      {visibleColumns.price && (
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {book.sellingPrice?.toLocaleString("vi-VN")}₫
                        </td>
                      )}
                      {visibleColumns.quantity && (
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {book.quantity || 0}
                        </td>
                      )}
                      {visibleColumns.status &&
                        (() => {
                          const stockStatus = getStockStatus(
                            book.quantity || 0
                          );
                          return (
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.className}`}
                              >
                                {stockStatus.label}
                              </span>
                            </td>
                          );
                        })()}
                      {visibleColumns.createdAt && (
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {book.createdAt
                            ? new Date(book.createdAt).toLocaleString("vi-VN")
                            : "N/A"}
                        </td>
                      )}
                      {visibleColumns.updatedAt && (
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {book.updatedAt
                            ? new Date(book.updatedAt).toLocaleString("vi-VN")
                            : "N/A"}
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openViewModal(book)}
                              title="Xem"
                              className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => openEditModal(book)}
                              title="Sửa"
                              className="p-1.5 hover:bg-yellow-50 rounded text-yellow-600 transition-colors"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(book)}
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
              {Math.min((currentPage + 1) * pageSize, totalBooks)} trên{" "}
              {totalBooks} rows
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronLeft className="text-gray-600" />
              </button>

              <div className="flex gap-1">{renderPagination()}</div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
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
                    {modalMode === "create" && "Thêm sách mới"}
                    {modalMode === "edit" && "Chỉnh sửa sách"}
                    {modalMode === "view" && "Chi tiết sách"}
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
                  {/* File Upload Section - Only in create/edit mode */}
                  {modalMode !== "view" && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Hình ảnh sách
                      </label>

                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FaPlus className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click để chọn ảnh
                              </span>{" "}
                              hoặc kéo thả
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, JPEG (Chấp nhận nhiều file)
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/png,image/jpeg,image/jpg"
                            multiple
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>

                      {/* Preview uploaded images */}
                      {previewImages.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Ảnh đã chọn ({previewImages.length}):
                          </p>
                          <div className="grid grid-cols-4 gap-4">
                            {previewImages.map((preview, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FaTimes className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center rounded-b-lg">
                                  {uploadedFiles[index]?.name.substring(0, 15)}
                                  {uploadedFiles[index]?.name.length > 15
                                    ? "..."
                                    : ""}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Book Images - Only in view mode */}
                  {modalMode === "view" &&
                    formData.image &&
                    formData.image.length > 0 && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Hình ảnh sách ({formData.image.length} ảnh)
                        </label>

                        {/* Main Image Display */}
                        <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden mb-4 border-2 border-gray-200">
                          <img
                            src={formData.image[selectedImageIndex]}
                            alt={`${formData.title} - ảnh ${
                              selectedImageIndex + 1
                            }`}
                            className="w-full h-full object-contain"
                          />

                          {/* Image Counter */}
                          <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                            {selectedImageIndex + 1} / {formData.image.length}
                          </div>

                          {/* Navigation Arrows */}
                          {formData.image.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImageIndex((prev) =>
                                    prev === 0
                                      ? formData.image!.length - 1
                                      : prev - 1
                                  );
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold transition-all z-10"
                              >
                                ‹
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImageIndex((prev) =>
                                    prev === formData.image!.length - 1
                                      ? 0
                                      : prev + 1
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
                            {formData.image.map((img, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImageIndex(idx);
                                }}
                                className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                  idx === selectedImageIndex
                                    ? "border-blue-500 ring-2 ring-blue-300"
                                    : "border-gray-300 hover:border-blue-400"
                                }`}
                              >
                                <img
                                  src={img}
                                  alt={`Thumbnail ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên sách <span className="text-red-500">*</span>
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
                        Tác giả <span className="text-red-500">*</span>
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

                    {/* ISBN */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ISBN <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="isbn"
                        value={formData.isbn || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        required
                        placeholder="Ví dụ: 978-3-16-148410-0"
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
                        value={formData.yearOfPublication || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        min="1900"
                        max={new Date().getFullYear()}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-900"
                      />
                    </div>

                    {/* Import Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá nhập <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="importPrice"
                        value={formData.importPrice || ""}
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
                        Giá bán <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="sellingPrice"
                        value={formData.sellingPrice || ""}
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
                        Số lượng <span className="text-red-500">*</span>
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
                        value={formData.status || "SALE"}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-900"
                      >
                        <option value="SALE">Đang bán</option>
                        <option value="STOP_SALE">Ngừng bán</option>
                        <option value="OUT_STOCK">Hết hàng</option>
                      </select>
                    </div>

                    {/* Short Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả ngắn
                      </label>
                      <textarea
                        name="shortDes"
                        value={formData.shortDes || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        rows={2}
                        placeholder="Mô tả ngắn về sách (1-2 câu)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-900"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả chi tiết
                      </label>
                      <textarea
                        name="description"
                        value={formData.description || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        rows={4}
                        placeholder="Mô tả chi tiết về nội dung sách"
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
                        disabled={isUploading}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaSave />
                        {isUploading
                          ? "Đang xử lý..."
                          : modalMode === "create"
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
                    <span className="font-semibold">Lưu ý:</span> Sách sẽ được
                    chuyển sang trạng thái "Hết hàng" và không thể bán được nữa.
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
    </AdminLayout>
  );
}
