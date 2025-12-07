import { FaShoppingCart, FaStar, FaChevronRight, FaEye } from "react-icons/fa";

export default function Features() {
    const features = [
        {
            icon: FaShoppingCart,
            title: "Miễn phí vận chuyển",
            description: "Cho đơn hàng từ 200.000đ",
            bgColor: "bg-purple-100",
            iconColor: "text-purple-600",
        },
        {
            icon: FaStar,
            title: "Sản phẩm chính hãng",
            description: "100% sách chính hãng",
            bgColor: "bg-orange-100",
            iconColor: "text-orange-500",
        },
        {
            icon: FaChevronRight,
            title: "Thanh toán linh hoạt",
            description: "Nhiều hình thức thanh toán",
            bgColor: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            icon: FaEye,
            title: "Hỗ trợ 24/7",
            description: "Tư vấn mọi lúc mọi nơi",
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
    ];

    return (
        <section className="py-16">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="text-center p-6 bg-white rounded-lg shadow-sm"
                        >
                            <div
                                className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                            >
                                <feature.icon
                                    className={`${feature.iconColor} text-2xl`}
                                />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
