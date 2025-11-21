// Core Types
export interface Book {
    id: number;
    title: string;
    author: string;
    price: number;
    image: string;
    description?: string;
    categoryId?: number;
    stock?: number;
    quantity?: number;
    publishedYear?: number;
    publisher?: string;
}

export interface CartItem {
    id: number;
    quantity: number;
    selected: boolean;
    book: Book;
}

export interface Address {
    province: string;
    ward: string;
    address: string;
}

export interface User {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    address?: Address;
    role?: string;
}

export interface Voucher {
    id: number;
    name: string;
    code: string;
    discountValue: number;
    description?: string;
    minOrderValue?: number;
    maxDiscount?: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}

export interface CheckoutItem {
    id: number;
    quantity: number;
    book: Book;
}

// Form Types
export interface DeliveryFormData {
    fullName: string;
    phone: string;
    email: string;
    province: string;
    ward: string;
    address: string;
    orderNote: string;
}

// API Response Types
export interface ApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T;
}

// Redux State Types
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface CartState {
    items: CartItem[];
    loading: boolean;
    error: string | null;
    totalItems: number;
}

export interface CheckoutState {
    checkoutItems: CheckoutItem[];
}

export interface BookState {
    books: Book[];
    currentBook: Book | null;
    loading: boolean;
    error: string | null;
}

// Component Props Types
export interface VoucherModalProps {
    isOpen: boolean;
    onClose: () => void;
    vouchers: Voucher[];
    selectedVoucher: number | null;
    onSelectVoucher: (voucherId: number | null) => void;
}

export interface DeliveryInformationProps {
    formData: DeliveryFormData;
    onFormChange: (data: DeliveryFormData) => void;
    defaultAddress?: User;
    checkDefault: boolean;
    onCheckDefaultChange: (checked: boolean) => void;
}

export interface VoucherSelectorProps {
    selectedVoucher: number | null;
    selectedVoucherData?: Voucher;
    discount: number;
    onOpenModal: () => void;
    onRemoveVoucher: () => void;
}

export interface PaymentMethodProps {
    paymentMethod: string;
    onPaymentMethodChange: (method: string) => void;
}

export interface OrderSummaryProps {
    checkoutItems: CheckoutItem[];
    subtotal: number;
    discount: number;
    total: number;
    onSubmit: () => void;
}

export interface CartItemProps {
    item: CartItem;
}

// Hook Return Types
export interface UseCheckoutReturn {
    checkoutItems: CheckoutItem[];
    defaultAddress: User | null;
    vouchers: Voucher[];
    selectedVoucher: number | null;
    selectedVoucherData?: Voucher;
    isVoucherModalOpen: boolean;
    subtotal: number;
    discount: number;
    total: number;
    handleSelectVoucher: (voucherId: number | null) => void;
    handleRemoveVoucher: () => void;
    openVoucherModal: () => void;
    closeVoucherModal: () => void;
}

export interface UseDeliveryFormReturn {
    formData: DeliveryFormData;
    checkDefault: boolean;
    handleFormChange: (data: DeliveryFormData) => void;
    handleCheckDefaultChange: (checked: boolean) => void;
}

export interface UsePaymentMethodReturn {
    paymentMethod: string;
    handlePaymentMethodChange: (method: string) => void;
}

export interface UseOrderSubmitReturn {
    handleSubmit: (
        formData: DeliveryFormData,
        paymentMethod: string,
        selectedVoucher: number | null,
        total: number
    ) => void;
}

// Utility Types
export type PaymentMethodType = "bank-transfer" | "cod";

export interface OrderData {
    deliveryInfo: DeliveryFormData;
    paymentMethod: string;
    voucherId: number | null;
    total: number;
    timestamp: string;
}
