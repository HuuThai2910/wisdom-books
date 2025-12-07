/**
 * Component đếm ngược thời gian còn lại
 * Dùng để hiển thị thời gian còn lại trước khi đơn hàng hết hạn thanh toán
 */
import { useState, useEffect } from "react";

/**
 * Props của CountdownTimer
 * @property expiredAt - Thời điểm hết hạn (ISO string hoặc Date string)
 */
interface CountdownTimerProps {
    expiredAt: string;
}

/**
 * Component CountdownTimer
 * @param expiredAt - Thời điểm hết hạn thanh toán
 *
 * Hiển thị:
 * - Trước khi hết hạn: mm:ss (VD: 15:30)
 * - Sau khi hết hạn: "Đã hết hạn" (màu đỏ)
 */
const CountdownTimer = ({ expiredAt }: CountdownTimerProps) => {
    // State lưu chuỗi thời gian còn lại (mm:ss hoặc "Đã hết hạn")
    const [timeLeft, setTimeLeft] = useState<string>("");

    // State đánh dấu đã hết hạn hay chưa
    const [isExpired, setIsExpired] = useState(false);

    /**
     * Effect: Tính toán và cập nhật thời gian còn lại mỗi giây
     *
     * Logic:
     * 1. Tính toán thời gian còn lại khi component mount
     * 2. Setup interval để cập nhật mỗi giây
     * 3. Cleanup interval khi component unmount
     *
     * Dependencies: expiredAt, isExpired
     */
    useEffect(() => {
        /**
         * Hàm tính toán thời gian còn lại
         *
         * Logic:
         * 1. Lấy thời gian hiện tại và thời điểm hết hạn
         * 2. Tính khoảng cách (difference) giữa hai thời điểm
         * 3. Nếu difference <= 0 -> đã hết hạn
         * 4. Nếu còn thời gian -> tính phút và giây, format thành mm:ss
         */
        const calculateTimeLeft = () => {
            // Lấy timestamp hiện tại
            const now = new Date().getTime();
            // Chuyển expiredAt thành timestamp
            const expiryTime = new Date(expiredAt).getTime();
            // Tính khoảng cách (milliseconds)
            const difference = expiryTime - now;

            // Nếu đã hết hạn (difference <= 0)
            if (difference <= 0) {
                // Chỉ set một lần để tránh re-render không cần thiết
                if (!isExpired) {
                    setIsExpired(true);
                    setTimeLeft("Đã hết hạn");
                }
                return;
            }

            // Tính số phút còn lại (bỏ qua giờ vì đơn chỉ có 30 phút)
            const minutes = Math.floor(
                (difference % (1000 * 60 * 60)) / (1000 * 60)
            );
            // Tính số giây còn lại
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Format thành mm:ss (VD: 05:30)
            setTimeLeft(
                `${minutes.toString().padStart(2, "0")}:${seconds
                    .toString()
                    .padStart(2, "0")}`
            );
        };

        // Tính ngay lần đầu khi mount
        calculateTimeLeft();

        // Setup interval để cập nhật mỗi giây (1000ms)
        const timer = setInterval(calculateTimeLeft, 1000);

        // Cleanup: clear interval khi component unmount
        return () => clearInterval(timer);
    }, [expiredAt, isExpired]);

    /**
     * Render countdown timer
     *
     * Style:
     * - Font monospace (font-mono) để các số căn đều
     * - Màu đỏ nếu đã hết hạn
     * - Màu cam nếu còn thời gian
     */
    return (
        <span
            className={`font-mono font-bold ${
                isExpired ? "text-red-600" : "text-orange-600"
            }`}
        >
            {timeLeft}
        </span>
    );
};

export default CountdownTimer;
