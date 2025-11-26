import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { serviceItems } from "../../data/service/services";

export default function Services() {
    const navigate = useNavigate();
    const [isPaused, setIsPaused] = useState(false);

    const handleItemClick = (path?: string) => {
        if (path) navigate(path);
    };

    // Duplicate items for infinite loop effect
    const duplicatedItems = [...serviceItems, ...serviceItems];

    return (
        <section className="bg-white py-10 relative overflow-hidden">
            <style>{`
    @keyframes scroll-services {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-100%);
        }
    }

    .services-scroll {
        animation: scroll-services 20s linear infinite;
        white-space: nowrap;
    }

    .services-scroll.paused {
        animation-play-state: paused;
    }
`}</style>

            <div className="relative border-t border-gray-200">
                <div
                    className={`services-scroll flex ${
                        isPaused ? "paused" : ""
                    }`}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {duplicatedItems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: (i % serviceItems.length) * 0.05,
                            }}
                            viewport={{ once: true }}
                            onClick={() => handleItemClick(item.path)}
                            className={`border border-gray-200 p-6 flex items-center justify-center bg-white hover:bg-gray-50 transition-all shadow-sm hover:shadow-md flex-shrink-0 ${
                                item.path ? "cursor-pointer" : "cursor-default"
                            }`}
                            style={{ minWidth: "300px" }}
                        >
                            <div className="flex items-center gap-4 text-blue-500">
                                <div className="text-3xl">
                                    <item.icon />
                                </div>
                                <div>
                                    <h6 className="font-semibold uppercase mb-1 text-sm tracking-wide">
                                        {item.title}
                                    </h6>
                                    <p className="text-xs text-gray-500">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
