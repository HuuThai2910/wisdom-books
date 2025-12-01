# Hướng dẫn Import sách từ file Excel

## Định dạng file Excel

File Excel phải có **ĐÚNG 5 CỘT** theo thứ tự sau:

| ISBN              | Tên sách   | Năm XB | Giá nhập | Số lượng |
| ----------------- | ---------- | ------ | -------- | -------- |
| 978-3-16-148410-0 | Sách mẫu 1 | 2023   | 50000    | 10       |
| 978-1-23-456789-7 | Sách mẫu 2 | 2022   | 75000    | 20       |

## Yêu cầu

### 1. Tên cột (Header - Hàng đầu tiên)

- **PHẢI** có đúng 5 cột với tên chính xác: `ISBN`, `Tên sách`, `Năm XB`, `Giá nhập`, `Số lượng`
- Không được thêm hoặc bớt cột
- Không được đổi tên cột

### 2. Dữ liệu

- **ISBN**: Mã ISBN của sách (phải tồn tại trong hệ thống)
- **Tên sách**: Tên đầy đủ của sách
- **Năm XB**: Năm xuất bản (số nguyên)
- **Giá nhập**: Giá nhập của sách (số nguyên, đơn vị VNĐ)
- **Số lượng**: Số lượng nhập (số nguyên dương)

### 3. Kiểm tra tự động

Hệ thống sẽ kiểm tra:

- ✅ File có đúng 5 cột (nếu dư cột → lỗi)
- ✅ Tên cột có đúng không
- ✅ ISBN có tồn tại trong hệ thống không
- ✅ Số lượng 1 loại sách không vượt quá 10,000 cuốn
- ✅ Tổng số lượng nhập không vượt quá tổng số lượng trong kho

## Cách sử dụng

1. Mở modal "Tạo phiếu nhập kho"
2. Click nút **"Import Excel"** (màu xanh lá)
3. Chọn file Excel (.xlsx hoặc .xls)
4. Hệ thống sẽ đọc và hiển thị kết quả:
   - ✅ Thành công: Các sách hợp lệ được thêm vào danh sách
   - ❌ Lỗi: Hiển thị thông báo lỗi cụ thể (thiếu dữ liệu, ISBN không tồn tại, vượt số lượng...)

## Ví dụ file Excel

### ✅ ĐÚNG - Có đúng 5 cột

```
| ISBN              | Tên sách           | Năm XB | Giá nhập | Số lượng |
|-------------------|--------------------|--------|----------|----------|
| 978-3-16-148410-0 | Clean Code         | 2020   | 250000   | 50       |
| 978-0-13-468599-1 | Design Patterns    | 2019   | 300000   | 30       |
```

### ❌ SAI - Có 6 cột (dư cột "Ghi chú")

```
| ISBN              | Tên sách           | Năm XB | Giá nhập | Số lượng | Ghi chú   |
|-------------------|--------------------|--------|----------|----------|-----------|
| 978-3-16-148410-0 | Clean Code         | 2020   | 250000   | 50       | Sách hay  |
```

**Lỗi**: "File có 6 cột, nhưng chỉ cho phép 5 cột (ISBN, Tên sách, Năm XB, Giá nhập, Số lượng)"

## Lưu ý

- Nếu ISBN đã có trong danh sách nhập, số lượng sẽ được cộng dồn
- Các hàng bị lỗi sẽ bỏ qua, hàng hợp lệ vẫn được import
- Tối đa hiển thị 3 lỗi đầu tiên trong thông báo
- Sau khi import, có thể xóa từng sách không mong muốn

## File mẫu

Tải file mẫu tại: `/public/template-import-books.xlsx`

---

**Lưu ý quan trọng**:

- Phải có đúng 5 cột, không được thêm cột
- ISBN phải tồn tại trong hệ thống
- Tuân thủ giới hạn số lượng (≤ 10,000 cuốn/loại, tổng ≤ tổng kho)
