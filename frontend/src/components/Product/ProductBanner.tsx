import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import image1 from "../../assets/img/banner_07.jpg";
import image2 from "../../assets/img/banner_08.jpg";
import { useNavigate } from "react-router-dom";

export default function ProductBanner() {
    const navigate = useNavigate();
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const button1Ref = useRef<HTMLButtonElement>(null);
    const button2Ref = useRef<HTMLButtonElement>(null);
    const [mousePos1, setMousePos1] = useState({ x: 0, y: 0 });
    const [mousePos2, setMousePos2] = useState({ x: 0, y: 0 });
    const [isHovering1, setIsHovering1] = useState(false);
    const [isHovering2, setIsHovering2] = useState(false);
    const [isTargetHit1, setIsTargetHit1] = useState(false);
    const [isTargetHit2, setIsTargetHit2] = useState(false);

    // 🎯 Parallax effect
    const { scrollYProgress: scrollY1 } = useScroll({
        target: ref1,
        offset: ["start end", "end start"],
    });
    const y1 = useTransform(scrollY1, [0, 1], [0, -100]);

    const { scrollYProgress: scrollY2 } = useScroll({
        target: ref2,
        offset: ["start end", "end start"],
    });
    const y2 = useTransform(scrollY2, [0, 1], [0, -80]);

    const handleMouseMove1 = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos1({ x, y });

        // Check if crosshair hits the button
        if (button1Ref.current) {
            const buttonRect = button1Ref.current.getBoundingClientRect();
            const containerRect = e.currentTarget.getBoundingClientRect();
            const buttonX = buttonRect.left - containerRect.left;
            const buttonY = buttonRect.top - containerRect.top;
            const buttonWidth = buttonRect.width;
            const buttonHeight = buttonRect.height;

            const isHit =
                x >= buttonX &&
                x <= buttonX + buttonWidth &&
                y >= buttonY &&
                y <= buttonY + buttonHeight;
            setIsTargetHit1(isHit);
        }
    };

    const handleMouseMove2 = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos2({ x, y });

        // Check if crosshair hits the button
        if (button2Ref.current) {
            const buttonRect = button2Ref.current.getBoundingClientRect();
            const containerRect = e.currentTarget.getBoundingClientRect();
            const buttonX = buttonRect.left - containerRect.left;
            const buttonY = buttonRect.top - containerRect.top;
            const buttonWidth = buttonRect.width;
            const buttonHeight = buttonRect.height;

            const isHit =
                x >= buttonX &&
                x <= buttonX + buttonWidth &&
                y >= buttonY &&
                y <= buttonY + buttonHeight;
            setIsTargetHit2(isHit);
        }
    };

    return (
        <section className="py-16 bg-white overflow-hidden">
            <style>{`
                .crosshair-container {
                    cursor: none;
                }

                .crosshair {
                    position: absolute;
                    pointer-events: none;
                    z-index: 50;
                }

                .crosshair::before,
                .crosshair::after {
                    content: '';
                    position: absolute;
                    background: rgba(255, 255, 255, 0.9);
                    box-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.4);
                }

                .crosshair::before {
                    width: 1150px;
                    height: 2px;
                    left: -550px;
                    top: -1.5px;
                }

                .crosshair::after {
                    width: 2px;
                    height: 1150px;
                    left: -1.5px;
                    top: -550px;
                }

                .crosshair-dot {
                    position: absolute;
                    width:2px;
                    height: 2px;
                    background: rgba(255, 255, 255, 1);
                    border-radius: 50%;
                    left: -2px;
                    top: -2px;
                    box-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.6);
                }

                .target-button {
                    transition: all 0.3s ease;
                }

                .target-button.hit {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%) !important;
                    transform: scale(1.1);
                    box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
                }
            `}</style>
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8">
                {/* Banner trái */}
                <motion.div
                    ref={ref1}
                    initial={{ opacity: 0, x: -80, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 crosshair-container"
                    onMouseMove={handleMouseMove1}
                    onMouseEnter={() => setIsHovering1(true)}
                    onMouseLeave={() => {
                        setIsHovering1(false);
                        setIsTargetHit1(false);
                    }}
                >
                    {isHovering1 && (
                        <div
                            className="crosshair"
                            style={{
                                left: `${mousePos1.x}px`,
                                top: `${mousePos1.y}px`,
                            }}
                        >
                            <div className="crosshair-dot"></div>
                        </div>
                    )}

                    <motion.img
                        src={image1}
                        alt="Sách mới"
                        className="w-full h-[420px] object-cover transform-gpu"
                        style={{ y: y1 }}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6 }}
                    />

                    {/* Overlay chung */}
                    <div
                        className="absolute inset-0 bg-black/30 flex flex-col justify-center p-8 rounded-2xl"
                        style={{ pointerEvents: "none" }}
                    >
                        <motion.h3
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg"
                        >
                            Sách Mới
                        </motion.h3>
                        <motion.h4
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-3xl font-semibold text-blue-300 drop-shadow-lg"
                        >
                            Ra Mắt Tháng Này
                        </motion.h4>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-lg text-gray-200 mt-3"
                        >
                            Cập nhật hơn 1.000+ tựa sách mới.
                        </motion.p>

                        <motion.button
                            ref={button1Ref}
                            onClick={() => navigate("/books")}
                            whileHover={{ scale: 1.08 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className={`mt-5 w-fit bg-blue-400 text-white rounded-full px-6 py-2 hover:scale-110 transition target-button ${
                                isTargetHit1 ? "hit" : ""
                            }`}
                            style={{ pointerEvents: "auto" }}
                        >
                            Xem Ngay
                        </motion.button>
                    </div>
                </motion.div>

                {/* Banner phải */}
                <motion.div
                    ref={ref2}
                    initial={{ opacity: 0, x: 80, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 crosshair-container"
                    onMouseMove={handleMouseMove2}
                    onMouseEnter={() => setIsHovering2(true)}
                    onMouseLeave={() => {
                        setIsHovering2(false);
                        setIsTargetHit2(false);
                    }}
                >
                    {isHovering2 && (
                        <div
                            className="crosshair"
                            style={{
                                left: `${mousePos2.x}px`,
                                top: `${mousePos2.y}px`,
                            }}
                        >
                            <div className="crosshair-dot"></div>
                        </div>
                    )}

                    <motion.img
                        src={image2}
                        alt="Sale Sách"
                        className="w-full h-[420px] object-cover transform-gpu"
                        style={{ y: y2 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                    />

                    {/* Overlay giống hệt banner trái */}
                    <div
                        className="absolute inset-0 bg-black/30 flex flex-col justify-center p-8 rounded-2xl"
                        style={{ pointerEvents: "none" }}
                    >
                        <motion.h3
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg"
                        >
                            SALE
                        </motion.h3>
                        <motion.h4
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-3xl font-semibold text-blue-300 drop-shadow-lg"
                        >
                            Giảm Đến 50% Sách Hot
                        </motion.h4>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-lg text-gray-200 mt-3"
                        >
                            Ưu đãi lớn cho hàng ngàn tựa sách.
                        </motion.p>

                        <motion.button
                            ref={button2Ref}
                            onClick={() => navigate("/books")}
                            whileHover={{ scale: 1.08 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className={`mt-5 w-fit bg-orange-600 text-white rounded-full px-6 py-2 hover:scale-110 transition target-button ${
                                isTargetHit2 ? "hit" : ""
                            }`}
                            style={{ pointerEvents: "auto" }}
                        >
                            Mua Ngay
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
