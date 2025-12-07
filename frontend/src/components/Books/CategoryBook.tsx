import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Atropos from "atropos/react";
import "atropos/css";
import amThuc from "../../assets/img/book/amthuc.png";
import cntt from "../../assets/img/book/congnghethongtin.png";
import dulich from "../../assets/img/book/dulich.png";
import kinhDoanh from "../../assets/img/book/kinhdoanh.png";
import ngheThuat from "../../assets/img/book/nghethuat.png";
import theThao from "../../assets/img/book/thethao.png";
import thieuNhi from "../../assets/img/book/thieunhi.png";

// Danh sách thể loại với ảnh tương ứng (subset của Header)
const categoryData = [
    {
        id: 1,
        name: "Ẩm thực – Nấu ăn",
        slug: "am-thuc",
        image: amThuc,
    },
    {
        id: 2,
        name: "Công nghệ thông tin",
        slug: "cong-nghe-thong-tin",
        image: cntt,
    },
    {
        id: 3,
        name: "Du lịch – Địa lý",
        slug: "du-lich",
        image: dulich,
    },
    {
        id: 4,
        name: "Kinh doanh",
        slug: "kinh-doanh",
        image: kinhDoanh,
    },
    {
        id: 5,
        name: "Nghệ thuật",
        slug: "nghe-thuat",
        image: ngheThuat,
    },
    {
        id: 6,
        name: "Thể thao",
        slug: "the-thao",
        image: theThao,
    },
    {
        id: 7,
        name: "Thiếu nhi",
        slug: "thieu-nhi",
        image: thieuNhi,
    },
];

interface CategoryBookProps {
    title?: string;
}

export default function CategoryBook({
    title = "TỦ SÁCH NỔI BẬT",
}: CategoryBookProps) {
    const navigate = useNavigate();

    const infiniteCategories = [
        ...categoryData,
        ...categoryData,
        ...categoryData,
    ];

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrame: number;

        setTimeout(() => {
            const totalWidth = scrollContainer.scrollWidth;
            const sectionWidth = totalWidth / 10; // 1 cụm
            const middle = sectionWidth * 5; // bắt đầu ở giữa

            scrollContainer.scrollLeft = middle;

            const speed = 0.8;

            const loop = () => {
                if (!scrollContainer) return;

                scrollContainer.scrollLeft += speed;

                // Khi chạm gần cụm thứ 9 → reset về giữa cụm thứ 5
                if (scrollContainer.scrollLeft >= sectionWidth * 9) {
                    scrollContainer.scrollLeft = middle;
                }

                animationFrame = requestAnimationFrame(loop);
            };

            animationFrame = requestAnimationFrame(loop);
        }, 500);

        return () => cancelAnimationFrame(animationFrame);
    }, []);

    const handleCategoryClick = (categoryName: string) => {
        navigate(`/category/${encodeURIComponent(categoryName)}`);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm relative container mx-auto px-35 pt-10 pb-10">
            {/* Header */}
            <div className="flex items-center gap-3 bg-blue-500 px-4 py-3 rounded-full mb-6 animate-headerPulse">
                {/* ICON */}
                <div className="w-8 h-8 text-white animate-bookFloat">
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-full h-full"
                    >
                        <path d="M4 3h13a1 1 0 011 1v13H5a3 3 0 01-3-3V4a1 1 0 011-1z" />
                        <path d="M7 18h13v2H7a1 1 0 110-2z" />
                    </svg>
                </div>

                {/* TITLE */}
                <h2
                    className="text-2xl font-bold relative overflow-hidden animate-titleFade"
                    style={{
                        fontFamily: "Playfair Display, serif",
                        fontStyle: "italic",
                        textShadow: "2px 4px 8px rgba(0,0,0,0.25)",
                        color: "#fff",
                    }}
                >
                    {title}

                    {/* SHIMMER EFFECT */}
                    <span className="title-shimmer"></span>
                </h2>
            </div>

            {/* Scroll List */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
            >
                {infiniteCategories.map((cat, index) => (
                    <motion.div
                        key={`${cat.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: (index % categoryData.length) * 0.1,
                            duration: 0.5,
                        }}
                        className="min-w-[150px] shrink-0 cursor-pointer"
                        onClick={() => handleCategoryClick(cat.name)}
                    >
                        <Atropos
                            className="atropos-category"
                            activeOffset={40}
                            shadowScale={1.05}
                        >
                            <div className="w-80 h-52 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-white">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Atropos>

                        <div className="text-center mt-3 group/text">
                            <p
                                className="relative inline-block font-bold text-gray-800 text-lg transition-all duration-300 cursor-pointer"
                                style={{
                                    fontFamily: "Playfair Display, serif",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                {/* Main text with gradient on hover */}
                                <span className="relative z-10 bg-clip-text transition-all duration-300 group-hover/text:text-transparent group-hover/text:bg-gradient-to-r group-hover/text:from-blue-600 group-hover/text:via-blue-500 group-hover/text:to-purple-600">
                                    {cat.name}
                                </span>

                                {/* Animated underline */}
                                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover/text:w-full rounded-full"></span>

                                {/* Glow effect on hover */}
                                <span className="absolute inset-0 opacity-0 blur-sm bg-gradient-to-r from-blue-400 to-purple-400 transition-opacity duration-300 group-hover/text:opacity-20 -z-10"></span>
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Custom Styles */}
            <style>{`
                .atropos-category {
                    width: 320px;
                    height: 208px;
                }

                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }

                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                /* Smooth scroll animation */
                @keyframes smoothScroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
                .scroll-smooth {
                    scroll-behavior: smooth;
                }

                /* Smooth pulse cho background */
                @keyframes headerPulse {
                    0% { filter: brightness(1); }
                    50% { filter: brightness(1.08); }
                    100% { filter: brightness(1); }
                }
                .animate-headerPulse {
                    animation: headerPulse 4s ease-in-out infinite;
                }

                /* Icon book nhẹ nhàng nhún lên xuống */
                @keyframes bookFloat {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                    100% { transform: translateY(0); }
                }
                .animate-bookFloat {
                    animation: bookFloat 3s ease-in-out infinite;
                }

                /* Title fade + slide subtle */
                @keyframes titleFade {
                    0% { opacity: 0.85; transform: translateY(0); }
                    50% { opacity: 1; transform: translateY(-2px); }
                    100% { opacity: 0.85; transform: translateY(0); }
                }
                .animate-titleFade {
                    animation: titleFade 5s ease-in-out infinite;
                }

                /* Shimmer chạy qua chữ */
                .title-shimmer {
                    position: absolute;
                    top: 0;
                    left: -150%;
                    width: 150%;
                    height: 100%;
                    background: linear-gradient(
                        120deg,
                        transparent,
                        rgba(255,255,255,0.5),
                        transparent
                    );
                    animation: shimmerMove 3s linear infinite;
                }

                @keyframes shimmerMove {
                    0% { transform: translateX(-150%); }
                    100% { transform: translateX(150%); }
                }

            `}</style>
        </div>
    );
}

// Export category data để sử dụng ở page khác
export { categoryData };
