import { AlertCircle, Clock } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

interface PaymentNoticeProps {
    expiredAt: string;
}

const PaymentNotice = ({ expiredAt }: PaymentNoticeProps) => {
    return (
        <div className="px-6 py-3 bg-orange-50 border-t border-orange-100">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm text-orange-800 leading-relaxed">
                        <span className="font-semibold">Lưu ý:</span> Phải thanh
                        toán đơn hàng trong 30 phút kể từ khi tạo đơn
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-orange-700">
                            Thời gian còn lại:
                        </span>
                        <CountdownTimer expiredAt={expiredAt} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentNotice;
