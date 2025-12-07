import { FaTruck, FaBox, FaShippingFast, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

import {
    shippingBenefits,
    shippingZones,
    shippingSteps,
    shippingPartners,
} from "../../data/service/shipping/index";

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-blue-50">
            {/* HERO */}
            <div className="relative bg-blue-600 text-white py-20 overflow-hidden">
                {/* Background decorative books */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-6xl">📚</div>
                    <div className="absolute bottom-20 right-20 text-5xl">
                        📦
                    </div>
                    <div className="absolute top-1/3 right-1/4 text-4xl">
                        🚚
                    </div>
                    <div className="absolute bottom-1/3 left-1/4 text-5xl">
                        📖
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <FaTruck className="text-6xl mx-auto mb-4" />
                        <h1 className="text-5xl font-bold mb-4">
                            Giao Hàng Miễn Phí Toàn Quốc
                        </h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            📚 Đọc sách mỗi ngày - Giao tận tay không lo delay
                        </p>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* BENEFITS */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {shippingBenefits.map((benefit, i) => (
                        <div
                            key={i}
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-600 relative overflow-hidden group cursor-pointer"
                        >
                            <div className="relative z-10">
                                <div className="text-blue-600 text-6xl mb-4">
                                    <benefit.icon />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {benefit.desc}
                                </p>
                                <div className="absolute bottom-4 right-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    📖
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SHIPPING ZONES */}
                <div className="bg-white rounded-2xl shadow-2xl p-10 mb-16 border border-blue-100 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 text-blue-50 text-9xl opacity-30 -mr-10 -mt-10">
                        📍
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10 flex items-center justify-center gap-3">
                            <FaMapMarkerAlt className="text-blue-600" />
                            Thời Gian & Phí Giao Hàng
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-blue-600 text-white">
                                        <th className="px-6 py-4 text-left font-semibold rounded-tl-lg">
                                            Khu vực
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold">
                                            Thời gian
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold rounded-tr-lg">
                                            Phí vận chuyển
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shippingZones.map((zone, i) => (
                                        <tr
                                            key={i}
                                            className={`border-b border-blue-50 hover:bg-blue-50 transition-colors ${
                                                zone.highlight
                                                    ? "bg-blue-50"
                                                    : ""
                                            }`}
                                        >
                                            <td className="px-6 py-5 text-gray-800 font-medium flex items-center gap-2">
                                                <span className="text-blue-600">
                                                    📚
                                                </span>
                                                {zone.zone}
                                            </td>
                                            <td className="px-6 py-5 text-gray-600">
                                                {zone.time}
                                            </td>
                                            <td className="px-6 py-5 font-bold text-blue-600 text-lg">
                                                {zone.fee}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* SHIPPING STEPS */}
                <div className="bg-linear-to-br from-blue-50 to-white rounded-2xl p-10 mb-16 border border-blue-200 relative overflow-hidden">
                    {/* Decorative background */}
                    <div className="absolute top-0 left-0 text-blue-100 text-9xl opacity-20 -ml-10 -mt-10">
                        📦
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center flex items-center justify-center gap-3">
                            <FaShippingFast className="text-blue-600" />
                            Quy Trình Giao Hàng
                        </h2>

                        <div className="grid md:grid-cols-4 gap-8">
                            {shippingSteps.map((step, i) => (
                                <div
                                    key={i}
                                    className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-600 relative group cursor-pointer"
                                >
                                    <div className="text-6xl mb-4">
                                        {step.emoji}
                                    </div>
                                    <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                                        {step.step}
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SHIPPING PARTNERS */}
                <div className="bg-white rounded-2xl shadow-xl p-10 mb-16 border border-blue-100">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
                        <FaBox className="text-blue-600" />
                        Đối Tác Vận Chuyển Uy Tín
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6 text-center">
                        {shippingPartners.map((partner, i) => (
                            <div
                                key={i}
                                className="p-6 border-2 border-blue-200 rounded-xl hover:border-blue-600 hover:shadow-lg transition-all duration-300 cursor-pointer bg-linear-to-br from-white to-blue-50"
                            >
                                <div className="text-5xl mb-3">
                                    {partner.emoji}
                                </div>
                                <div className="font-bold text-gray-800 text-lg">
                                    {partner.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BACK HOME BUTTON */}
                <div className="text-center mt-12">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 bg-blue-600 text-white font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl hover:bg-blue-700 transition-all"
                    >
                        <span>Quay lại trang chủ</span>
                        <span>🏠</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
