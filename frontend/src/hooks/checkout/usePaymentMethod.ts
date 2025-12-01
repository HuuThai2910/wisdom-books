import { useState } from "react";
import { UsePaymentMethodReturn } from "../../types";

export const usePaymentMethod = (
    initialMethod: string = "COD"
): UsePaymentMethodReturn => {
    const [paymentMethod, setPaymentMethod] = useState<string>(initialMethod);

    const handlePaymentMethodChange = (method: string) => {
        setPaymentMethod(method);
    };

    return {
        paymentMethod,
        handlePaymentMethodChange,
    };
};
