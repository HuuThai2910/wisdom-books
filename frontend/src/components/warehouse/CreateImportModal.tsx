import { useState, useEffect } from "react";
import entryFormApi from "../../api/entryFormApi";
import { Book as ApiBook } from "../../types";
import toast from "react-hot-toast";
import { X, Trash2, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { useBooks } from "../../contexts/BookContext";

interface BookInImport {
  isbn: string;
  title: string;
  yearOfPublication: number;
  importPrice: number;
  quantity: number;
  amount: number;
}

interface CreateImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (importData: {
    supplier: string;
    invoiceNumber: string;
    books: BookInImport[];
  }) => void;
}

export default function CreateImportModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateImportModalProps) {
  const { books: allBooks, fetchBooks } = useBooks();
  const [filteredBooks, setFilteredBooks] = useState<ApiBook[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [supplier, setSupplier] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [booksInImport, setBooksInImport] = useState<BookInImport[]>([]);
  const [selectedBookIsbn, setSelectedBookIsbn] = useState("");
  const [importQuantity, setImportQuantity] = useState("");
  const [totalInventoryQty, setTotalInventoryQty] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchBooks(0, 20, "quantity,asc", "quantity<100");
      generateInvoiceNumber();
      fetchTotalInventory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      const filtered = allBooks.filter(
        (book) =>
          book.isbn.toLowerCase().includes(keyword) ||
          book.title.toLowerCase().includes(keyword) ||
          book.author?.toLowerCase().includes(keyword) ||
          book.publisher?.toLowerCase().includes(keyword)
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(allBooks);
    }
  }, [searchKeyword, allBooks]);

  const fetchTotalInventory = async () => {
    try {
      const response = await entryFormApi.getTotalInventoryQuantity();
      if (response.data !== undefined) {
        setTotalInventoryQty(response.data);
      }
    } catch (error) {
      console.error("Error fetching total inventory:", error);
    }
  };

  const generateInvoiceNumber = async () => {
    try {
      const response = await entryFormApi.getNextInvoiceNumber();
      console.log("Next invoice number response:", response);
      if (response.data !== undefined) {
        const nextNumber = response.data.toString();
        console.log("Setting invoice number to:", nextNumber);
        setInvoiceNumber(nextNumber);
      } else {
        console.warn("Response data is undefined");
      }
    } catch (error) {
      console.error("Error generating invoice number:", error);
      // Fallback to timestamp
      const timestamp = Date.now().toString().slice(-8);
      const fallbackNumber = `HD${timestamp}`;
      console.log("Using fallback invoice number:", fallbackNumber);
      setInvoiceNumber(fallbackNumber);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        }) as any[][];

        if (jsonData.length < 2) {
          toast.error("File Excel không có dữ liệu");
          return;
        }

        // Kiểm tra header
        const headers = jsonData[0];
        const expectedHeaders = [
          "ISBN",
          "Tên sách",
          "Năm XB",
          "Giá nhập",
          "Số lượng",
        ];

        // Kiểm tra nếu có cột dư
        if (headers.length > expectedHeaders.length) {
          toast.error(
            `File có ${headers.length} cột, nhưng chỉ cho phép ${expectedHeaders.length} cột (ISBN, Tên sách, Năm XB, Giá nhập, Số lượng)`
          );
          return;
        }

        // Kiểm tra tên cột
        const isValidHeaders = expectedHeaders.every(
          (header, index) => headers[index]?.toString().trim() === header
        );

        if (!isValidHeaders) {
          toast.error(
            `Cột không đúng định dạng. Yêu cầu: ${expectedHeaders.join(", ")}`
          );
          return;
        }

        // Đọc dữ liệu từ hàng thứ 2 trở đi
        const booksToAdd: BookInImport[] = [];
        const errors: string[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          const isbn = row[0]?.toString().trim();
          const title = row[1]?.toString().trim();
          const year = Number(row[2]);
          const price = Number(row[3]);
          const quantity = Number(row[4]);

          if (!isbn || !title || !year || !price || !quantity) {
            errors.push(`Hàng ${i + 1}: Thiếu dữ liệu`);
            continue;
          }

          // Tìm sách trong danh sách allBooks
          const bookInDb = allBooks.find((b) => b.isbn === isbn);
          if (!bookInDb) {
            errors.push(`Hàng ${i + 1}: Không tìm thấy sách có ISBN ${isbn}`);
            continue;
          }

          // Kiểm tra số lượng
          if (bookInDb.quantity + quantity > 10000) {
            errors.push(`Hàng ${i + 1}: Số lượng ${isbn} vượt quá 10000 cuốn`);
            continue;
          }

          booksToAdd.push({
            isbn,
            title,
            yearOfPublication: year,
            importPrice: price,
            quantity,
            amount: price * quantity,
          });
        }

        if (errors.length > 0) {
          toast.error(
            <div>
              <div className="font-bold">Có lỗi khi đọc file:</div>
              {errors.slice(0, 3).map((err, idx) => (
                <div key={idx}>{err}</div>
              ))}
              {errors.length > 3 && (
                <div>...và {errors.length - 3} lỗi khác</div>
              )}
            </div>,
            { duration: 5000 }
          );
        }

        if (booksToAdd.length > 0) {
          // Kiểm tra tổng số lượng
          const currentTotal = booksInImport.reduce(
            (sum, b) => sum + b.quantity,
            0
          );
          const newTotal = booksToAdd.reduce((sum, b) => sum + b.quantity, 0);

          if (currentTotal + newTotal > totalInventoryQty) {
            toast.error(
              `Tổng số lượng nhập (${(
                currentTotal + newTotal
              ).toLocaleString()}) vượt quá tổng số lượng trong kho (${totalInventoryQty.toLocaleString()})`
            );
            return;
          }

          // Merge với danh sách hiện tại
          const merged = [...booksInImport];
          booksToAdd.forEach((newBook) => {
            const existing = merged.find((b) => b.isbn === newBook.isbn);
            if (existing) {
              existing.quantity += newBook.quantity;
              existing.amount = existing.importPrice * existing.quantity;
            } else {
              merged.push(newBook);
            }
          });

          setBooksInImport(merged);
          toast.success(`Đã thêm ${booksToAdd.length} sách từ file Excel`);
        }
      } catch (error) {
        console.error("Error reading Excel file:", error);
        toast.error("Lỗi khi đọc file Excel");
      }
    };

    reader.readAsArrayBuffer(file);
    // Reset input để có thể upload lại cùng file
    event.target.value = "";
  };

  const handleAddBook = () => {
    if (!selectedBookIsbn) {
      toast.error("Vui lòng chọn sách và nhập số lượng");
      return;
    }
    if (!importQuantity || Number(importQuantity) <= 0) {
      toast.error("Vui lòng nhập số lượng hợp lệ");
      return;
    }

    const selectedBook = allBooks.find((b) => b.isbn === selectedBookIsbn);
    if (!selectedBook) {
      toast.error("Không tìm thấy sách");
      return;
    }

    const quantity = Number(importQuantity);

    // Kiểm tra số lượng 1 loại sách không quá 10000 cuốn
    if (selectedBook.quantity + quantity > 10000) {
      toast.error(
        `Số lượng sách "${selectedBook.title}" không được vượt quá 10000 cuốn`
      );
      return;
    }

    // Kiểm tra tổng số lượng trong phiếu không được vượt quá tổng số lượng sách trong kho
    const currentTotalInForm = booksInImport.reduce(
      (sum, b) => sum + b.quantity,
      0
    );
    if (currentTotalInForm + quantity > totalInventoryQty) {
      toast.error(
        `Tổng số lượng sách trong phiếu nhập (${
          currentTotalInForm + quantity
        }) không được vượt quá tổng số lượng sách trong kho (${totalInventoryQty})`
      );
      return;
    }

    const importPrice = selectedBook.importPrice || 0;
    const amount = quantity * importPrice;

    // Tìm sách đã tồn tại trong danh sách
    const existingBook = booksInImport.find(
      (b) => b.isbn === selectedBook.isbn
    );

    if (existingBook) {
      // Cộng dồn số lượng nếu đã tồn tại
      const updatedBooks = booksInImport.map((b) =>
        b.isbn === selectedBook.isbn
          ? {
              ...b,
              quantity: b.quantity + quantity,
              amount: b.importPrice * (b.quantity + quantity),
            }
          : b
      );
      setBooksInImport(updatedBooks);
      toast.success(
        `Đã cộng thêm ${quantity} cuốn vào sách "${selectedBook.title}"`
      );
    } else {
      // Thêm mới nếu chưa tồn tại
      const newBook: BookInImport = {
        isbn: selectedBook.isbn,
        title: selectedBook.title,
        yearOfPublication: selectedBook.yearOfPublication,
        importPrice: importPrice,
        quantity: quantity,
        amount: amount,
      };
      setBooksInImport([...booksInImport, newBook]);
      toast.success("Đã thêm sách vào phiếu");
    }

    setSelectedBookIsbn("");
    setImportQuantity("");
  };

  const handleRemoveBook = (isbn: string) => {
    setBooksInImport(booksInImport.filter((b) => b.isbn !== isbn));
    toast.success("Đã xóa sách khỏi phiếu");
  };

  const handleSubmit = () => {
    if (!supplier.trim()) {
      toast.error("Vui lòng nhập tên người/công ty giao hàng");
      return;
    }
    if (booksInImport.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sách vào phiếu");
      return;
    }

    onSubmit({
      supplier: supplier.trim(),
      invoiceNumber: invoiceNumber,
      books: booksInImport,
    });

    // Reset form
    setSupplier("");
    setInvoiceNumber("");
    setBooksInImport([]);
    setSelectedBookIsbn("");
    setImportQuantity("");
    setSearchKeyword("");
  };

  const handleClose = () => {
    setSupplier("");
    setInvoiceNumber("");
    setBooksInImport([]);
    setSelectedBookIsbn("");
    setImportQuantity("");
    setSearchKeyword("");
    onClose();
  };

  const totalQuantity = booksInImport.reduce(
    (sum, book) => sum + book.quantity,
    0
  );
  const totalAmount = booksInImport.reduce((sum, book) => sum + book.amount, 0);

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: "Hết hàng", color: "text-red-600", bg: "bg-red-50" };
    } else if (quantity <= 10) {
      return {
        label: "Gần hết",
        color: "text-orange-600",
        bg: "bg-orange-50",
      };
    }
    return { label: "Còn hàng", color: "text-green-600", bg: "bg-green-50" };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10 rounded-t-lg">
          <h2 className="text-xl font-bold">Tạo phiếu nhập kho</h2>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Thông tin phiếu nhập
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Người giao:
                </label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Nhập tên người/công ty giao hàng"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số hóa đơn:
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                Sách đã thêm ({booksInImport.length})
              </h4>
              {booksInImport.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có sách nào được thêm
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="border border-gray-300 px-3 py-2 text-gray-700">
                          STT
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-gray-700">
                          ISBN
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-gray-700">
                          Tên sách
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-gray-700">
                          Năm XB
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-gray-700">
                          Giá nhập
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-gray-700">
                          Số lượng
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-gray-700">
                          Thành tiền
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-gray-700">
                          Xóa
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {booksInImport.map((book, index) => (
                        <tr key={book.isbn} className="bg-white">
                          <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-800">
                            {book.isbn}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-800">
                            {book.title}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">
                            {book.yearOfPublication}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-right text-gray-800">
                            {book.importPrice.toLocaleString()}₫
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">
                            {book.quantity}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-right text-gray-800">
                            {book.amount.toLocaleString()}₫
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            <button
                              onClick={() => handleRemoveBook(book.isbn)}
                              className="text-red-500 hover:text-red-700 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-blue-50 font-bold">
                        <td
                          colSpan={5}
                          className="border border-gray-300 px-3 py-2 text-right text-gray-800"
                        >
                          Tổng cộng:
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center text-blue-600">
                          {totalQuantity}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-blue-600">
                          {totalAmount.toLocaleString()}₫
                        </td>
                        <td className="border border-gray-300"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Thêm sách vào phiếu
            </h3>

            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Tìm kiếm sách theo tên hoặc ISBN..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <input
                  type="file"
                  id="excel-upload"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="excel-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer transition"
                >
                  <Upload size={18} />
                  Import Excel
                </label>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      ISBN
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      Tên sách
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      Năm XB
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      Giá nhập
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      Tồn kho
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      Số lượng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBooks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Không tìm thấy sách nào
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.slice(0, 20).map((book) => {
                      const status = getStockStatus(book.quantity);
                      return (
                        <tr key={book.isbn} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-800">
                            {book.isbn}
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {book.title}
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {book.yearOfPublication}
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {book.importPrice?.toLocaleString() || 0}₫
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs ${status.bg} ${status.color}`}
                            >
                              {book.quantity}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="1"
                              placeholder="SL"
                              value={
                                selectedBookIsbn === book.isbn
                                  ? importQuantity
                                  : ""
                              }
                              onChange={(e) => {
                                setSelectedBookIsbn(book.isbn);
                                setImportQuantity(e.target.value);
                              }}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => {
                                setSelectedBookIsbn(book.isbn);
                                handleAddBook();
                              }}
                              className="px-3 py-1 rounded text-xs transition bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              Thêm
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Lưu phiếu nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
