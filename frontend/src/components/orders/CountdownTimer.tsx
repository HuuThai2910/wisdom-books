import { useState, useEffect } from "react";

interface CountdownTimerProps {
    expiredAt: string;
}

const CountdownTimer = ({ expiredAt }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const expiryTime = new Date(expiredAt).getTime();
            const difference = expiryTime - now;

            if (difference <= 0) {
                if (!isExpired) {
                    setIsExpired(true);
                    setTimeLeft("Đã hết hạn");
                }
                return;
            }

            const minutes = Math.floor(
                (difference % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft(
                `${minutes.toString().padStart(2, "0")}:${seconds
                    .toString()
                    .padStart(2, "0")}`
            );
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [expiredAt, isExpired]);

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
