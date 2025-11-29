import { EntryForm, EntryFormDetail } from "../api/entryFormApi";
import { format } from "date-fns";

// Hàm chuyển số thành chữ tiếng Việt
function numberToVietnameseWords(num: number): string {
    if (num === 0) return "Không đồng";

    const ones = [
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
    const teens = [
        "mười",
        "mười một",
        "mười hai",
        "mười ba",
        "mười bốn",
        "mười lăm",
        "mười sáu",
        "mười bảy",
        "mười tám",
        "mười chín",
    ];

    function convertLessThanOneThousand(n: number): string {
        if (n === 0) return "";

        if (n < 10) {
            return ones[n];
        } else if (n < 20) {
            return teens[n - 10];
        } else if (n < 100) {
            const ten = Math.floor(n / 10);
            const one = n % 10;
            if (one === 0) {
                return ones[ten] + " mươi";
            } else if (one === 1 && ten > 1) {
                return ones[ten] + " mươi mốt";
            } else if (one === 5 && ten > 0) {
                return ones[ten] + " mươi lăm";
            } else {
                return ones[ten] + " mươi " + ones[one];
            }
        } else {
            const hundred = Math.floor(n / 100);
            const rest = n % 100;
            let result = ones[hundred] + " trăm";

            if (rest === 0) {
                return result;
            } else if (rest < 10) {
                return result + " lẻ " + ones[rest];
            } else {
                return result + " " + convertLessThanOneThousand(rest);
            }
        }
    }

    function convert(n: number): string {
        if (n === 0) return "không";

        let result = "";

        const billion = Math.floor(n / 1000000000);
        const million = Math.floor((n % 1000000000) / 1000000);
        const thousand = Math.floor((n % 1000000) / 1000);
        const remainder = n % 1000;

        if (billion > 0) {
            result += convertLessThanOneThousand(billion) + " tỷ ";
        }

        if (million > 0) {
            result += convertLessThanOneThousand(million) + " triệu ";
        }

        if (thousand > 0) {
            result += convertLessThanOneThousand(thousand) + " nghìn ";
        }

        if (remainder > 0) {
            result += convertLessThanOneThousand(remainder);
        }

        return result.trim();
    }

    const words = convert(num);
    return words.charAt(0).toUpperCase() + words.slice(1) + " đồng chẵn";
}

export async function generateEntryFormPDF(
    entryForm: EntryForm,
    details: EntryFormDetail[]
): Promise<Blob> {
    // Import dynamically to reduce initial bundle size
    const jsPDFModule = await import("jspdf");
    const jsPDF = jsPDFModule.default;

    // Import autoTable - this extends jsPDF prototype
    await import("jspdf-autotable");

    // Create new PDF document
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    }) as any;

    // Load Vietnamese font (you may need to host this file)
    // For now, we'll use default font
    doc.setFont("helvetica");

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("PHIẾU NHẬP KHO", 105, 20, { align: "center" });

    // Date and ID
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const dateStr = format(new Date(entryForm.createdAt), "dd/MM/yyyy HH:mm");
    doc.text(`Ngày: ${dateStr}`, 20, 35);
    doc.text(`Mã phiếu: ${entryForm.id}`, 150, 35);

    // Info section
    doc.setFontSize(10);
    doc.text("Người giao: CÔNG TY TNHH THIẾT BỊ TÂN AN PHÁT", 20, 45);
    doc.text("Hóa đơn số: 1379 - ngày 14/07/2022", 20, 52);
    doc.text(`Người tạo: ${entryForm.createdBy}`, 20, 59);

    // Table
    const tableData = details.map((item, index) => [
        (index + 1).toString(),
        item.isbn,
        item.title,
        item.yearOfPublication.toString(),
        item.unitPrice.toLocaleString() + "₫",
        item.quantity.toString(),
        item.amount.toLocaleString() + "₫",
    ]);

    // Add total row
    tableData.push([
        "",
        "",
        "",
        "",
        "",
        "Tổng cộng:",
        entryForm.totalPrice.toLocaleString() + "₫",
    ]);

    doc.autoTable({
        startY: 65,
        head: [["STT", "ISBN", "Tên sách", "Năm XB", "Giá nhập", "SL", "Thành tiền"]],
        body: tableData,
        theme: "grid",
        headStyles: {
            fillColor: [59, 130, 246],
            textColor: 255,
            fontSize: 9,
            fontStyle: "bold",
            halign: "center",
        },
        bodyStyles: {
            fontSize: 8,
            textColor: 50,
        },
        columnStyles: {
            0: { halign: "center", cellWidth: 12 },
            1: { halign: "left", cellWidth: 32 },
            2: { halign: "left", cellWidth: 50 },
            3: { halign: "center", cellWidth: 20 },
            4: { halign: "right", cellWidth: 25 },
            5: { halign: "center", cellWidth: 15 },
            6: { halign: "right", cellWidth: 30 },
        },
        didParseCell: (data: any) => {
            if (data.row.index === tableData.length - 1) {
                data.cell.styles.fontStyle = "bold";
                data.cell.styles.fillColor = [239, 246, 255];
            }
        },
    });

    // Total in words
    const finalY = doc.lastAutoTable.finalY || 150;
    doc.setFontSize(10);
    doc.text(
        `- Tổng số tiền (Viết bằng chữ): ${numberToVietnameseWords(entryForm.totalPrice)}`,
        20,
        finalY + 10
    );

    // Signature section
    const sigY = finalY + 25;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Người lập phiếu", 30, sigY, { align: "center" });
    doc.text("Người giao hàng", 75, sigY, { align: "center" });
    doc.text("Thủ kho", 120, sigY, { align: "center" });
    doc.text("Kế toán trưởng", 170, sigY, { align: "center" });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text("(Ký, họ tên)", 30, sigY + 5, { align: "center" });
    doc.text("(Ký, họ tên)", 75, sigY + 5, { align: "center" });
    doc.text("(Ký, họ tên)", 120, sigY + 5, { align: "center" });
    doc.text("(Hoặc bộ phận có nhu cầu nhập)", 170, sigY + 5, { align: "center" });

    // Return as blob
    return doc.output("blob");
}

export async function downloadEntryFormPDF(
    entryForm: EntryForm,
    details: EntryFormDetail[]
): Promise<void> {
    const blob = await generateEntryFormPDF(entryForm, details);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `PhieuNhapKho_${entryForm.id}_${format(
        new Date(entryForm.createdAt),
        "ddMMyyyy_HHmmss"
    )}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
