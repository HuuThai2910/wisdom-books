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
        // Chuyển đến trang category để có banner đẹp
        navigate(`/category/${encodeURIComponent(categoryName)}`);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 relative container mx-auto mb-12">
            {/* Header */}
            <div className="flex items-center gap-3 bg-blue-500 px-4 py-3 rounded-lg mb-6">
                <div className="text-white text-xl">📕</div>
                <h2 className="text-4xl font-bold">{title}</h2>
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
                    >
                        <Atropos
                            className="atropos-category"
                            activeOffset={40}
                            shadowScale={1.05}
                        >
                            <div
                                className="w-80 h-52 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-white"
                                onClick={() => handleCategoryClick(cat.name)}
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Atropos>

                        <p
                            className="text-center mt-2 font-semibold text-gray-800 hover:text-blue-600 transition-colors text-3xl"
                            style={{ fontFamily: "Playfair Display, serif" }}
                        >
                            {cat.name}
                        </p>
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

            `}</style>
        </div>
    );
}

// Export category data để sử dụng ở page khác
export { categoryData };
