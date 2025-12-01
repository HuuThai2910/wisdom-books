import { X, RefreshCw } from "lucide-react";
import { EntryFormDetail, EntryForm } from "../../types";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { downloadEntryFormPDF } from "../../util/pdfGenerator";

interface EntryFormDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryForm: EntryForm | null;
  details: EntryFormDetail[];
  loading: boolean;
}

// Hàm chuyển số thành chữ
const numberToVietnameseWords = (num: number): string => {
  if (num === 0) return "Không đồng";

  const units = [
    "",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const levels = ["", "nghìn", "triệu", "tỷ"];

  const readBlock = (n: number): string => {
    const hundred = Math.floor(n / 100);
    const ten = Math.floor((n % 100) / 10);
    const unit = n % 10;

    let result = "";

    if (hundred > 0) {
      result += units[hundred] + " trăm";
      if (ten === 0 && unit !== 0) {
        result += " lẻ";
      }
    }

    if (ten > 1) {
      result += " " + units[ten] + " mươi";
      if (unit === 1) {
        result += " mốt";
      } else if (unit > 0) {
        result += " " + units[unit];
      }
    } else if (ten === 1) {
      result += " mười";
      if (unit > 0) {
        result += " " + units[unit];
      }
    } else if (unit > 0) {
      result += " " + units[unit];
    }

    return result.trim();
  };

  let result = "";
  let blockIndex = 0;

  while (num > 0) {
    const block = num % 1000;
    if (block > 0) {
      const blockText = readBlock(block);
      result =
        blockText +
        (levels[blockIndex] ? " " + levels[blockIndex] : "") +
        " " +
        result;
    }
    num = Math.floor(num / 1000);
    blockIndex++;
  }

  return (
    result.trim().charAt(0).toUpperCase() +
    result.trim().slice(1) +
    " đồng chẵn"
  );
};

export default function EntryFormDetailModal({
  isOpen,
  onClose,
  entryForm,
  details,
  loading,
}: EntryFormDetailModalProps) {
  if (!isOpen || !entryForm) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto p-4">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold">Chi tiết phiếu nhập kho</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 uppercase">
                Phiếu nhập kho
              </h3>
              <p className="text-gray-600 mt-2">
                Ngày:{" "}
                <span className="font-semibold text-gray-800">
                  {format(new Date(entryForm.createdAt), "dd/MM/yyyy HH:mm")}
                </span>
                {" - "}
                Mã phiếu:{" "}
                <span className="font-semibold text-blue-600">
                  {entryForm.id}
                </span>
              </p>
            </div>

            <div className="mb-4 space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Người giao:</span>{" "}
                <span className="text-gray-900">
                  CÔNG TY TNHH THIẾT BỊ TÂN AN PHÁT
                </span>
              </p>
              <p>
                <span className="font-medium">Hóa đơn số:</span>{" "}
                <span className="text-gray-900">{entryForm.id}</span>
                {" - "}
                <span className="text-gray-600">
                  ngày {format(new Date(entryForm.createdAt), "dd/MM/yyyy")}
                </span>
              </p>
              <p>
                <span className="font-medium">Người tạo:</span>{" "}
                <span className="text-gray-900">{entryForm.createdBy}</span>
              </p>
            </div>

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
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="border border-gray-300 px-3 py-8 text-center text-gray-500"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="animate-spin" size={18} />
                          <span>Đang tải dữ liệu...</span>
                        </div>
                      </td>
                    </tr>
                  ) : details.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="border border-gray-300 px-3 py-8 text-center text-gray-500"
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    details.map((item, index) => (
                      <tr key={item.id} className="bg-white">
                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-gray-800">
                          {item.isbn}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-gray-800">
                          {item.title}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">
                          {item.yearOfPublication}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-gray-800">
                          {item.unitPrice.toLocaleString()}₫
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">
                          {item.quantity}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-gray-800">
                          {item.amount.toLocaleString()}₫
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="bg-blue-50 font-bold">
                    <td
                      colSpan={6}
                      className="border border-gray-300 px-3 py-2 text-right text-gray-800"
                    >
                      Tổng cộng:
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right text-blue-600">
                      {entryForm.totalPrice.toLocaleString()}₫
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-gray-700">
              <p>
                <span className="font-medium">
                  - Tổng số tiền (Viết bằng chữ):
                </span>{" "}
                <span className="border-b border-gray-400 inline-block min-w-[400px] text-gray-900">
                  {numberToVietnameseWords(entryForm.totalPrice)}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center mt-8 mb-20 text-gray-700">
              <div>
                <p className="font-bold text-gray-800">Người lập phiếu</p>
                <p className="italic text-sm text-gray-600">(Ký, họ tên)</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">Người giao hàng</p>
                <p className="italic text-sm text-gray-600">(Ký, họ tên)</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">Thủ kho</p>
                <p className="italic text-sm text-gray-600">(Ký, họ tên)</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">Quản lý</p>
                <p className="italic text-sm text-gray-600">
                  (Hoặc bộ phận có nhu cầu nhập)
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                if (!entryForm) return;
                try {
                  downloadEntryFormPDF(entryForm, details);
                  toast.success("Đã tải xuống phiếu nhập kho");
                } catch (error) {
                  console.error("Error printing invoice:", error);
                  toast.error("Không thể in phiếu nhập kho");
                }
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              In phiếu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
