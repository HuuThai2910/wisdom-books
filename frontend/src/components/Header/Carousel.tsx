import { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "animate.css";

import img1 from "../../assets/img/banner_01.jpg";
import img2 from "../../assets/img/banner_02.jpg";
import img3 from "../../assets/img/banner_03.jpg";
import img4 from "../../assets/img/banner_04.jpg";
import { Link } from "react-router-dom";

const NextArrow = (props: any) => {
    const { currentSlide, slideCount, ...rest } = props;
    return (
        <button
            {...rest}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-5xl z-50 hover:text-yellow-400 transition"
        >
            ❯
        </button>
    );
};

const PrevArrow = (props: any) => {
    const { currentSlide, slideCount, ...rest } = props;
    return (
        <button
            {...rest}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-5xl z-50 hover:text-yellow-400 transition"
        >
            ❮
        </button>
    );
};

export default function Carousel() {
    const sliderRef = useRef<Slider>(null);
    const [start, setStart] = useState(false);

    useEffect(() => {
        // ⏱ Delay 2 giây trước khi chạy auto
        const timer = setTimeout(() => setStart(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const settings = {
        autoplay: start, // chỉ bắt đầu sau 2s
        autoplaySpeed: 4000,
        fade: true,
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    const slides = [
        {
            image: img1,
            title: "Khám Phá Kho Tri Thức",
            desc: "Từ những tác phẩm kinh điển đến sách hiện đại — nơi tri thức và cảm hứng hội tụ. Cùng bạn mở ra thế giới mới qua từng trang sách.",
        },
        {
            image: img2,
            title: "Đọc Sách Mỗi Ngày",
            desc: "Một cuốn sách hay có thể thay đổi cuộc đời bạn. Hãy để mỗi ngày là một hành trình khám phá tri thức và cảm xúc.",
        },
        {
            image: img3,
            title: "Ưu Đãi Đặc Biệt Cho Mùa Học Mới",
            desc: "Giảm giá đến 30% cho các đầu sách học thuật, kỹ năng, và văn học Việt Nam. Cơ hội sở hữu tủ sách ước mơ!",
        },
        {
            image: img4,
            title: "Thế Giới Sách Dành Cho Bạn",
            desc: "Từ tiểu thuyết, kỹ năng sống đến sách thiếu nhi — chúng tôi mang đến cho bạn sự chọn lựa phong phú và đầy cảm hứng.",
        },
    ];

    return (
        <div className="relative animate-fade-in">
            <Slider
                key={start ? "started" : "waiting"}
                ref={sliderRef}
                {...settings}
            >
                {slides.map((slide, i) => (
                    <div key={i} className="relative">
                        <img
                            src={slide.image}
                            alt={`slide-${i}`}
                            className="w-full h-screen object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center text-white px-4">
                            <h5 className="text-lg mb-2 animate__animated animate__fadeInDown text-yellow-400">
                                Cửa Hàng Sách Trực Tuyến
                            </h5>
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate__animated animate__slideInDown text-yellow-300 drop-shadow-lg">
                                {slide.title}
                            </h1>
                            <p className="text-lg max-w-2xl mx-auto mb-5 animate__animated animate__fadeInUp leading-relaxed">
                                {slide.desc}
                            </p>
                            <Link
                                to="/books"
                                className="border-2 border-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-500 hover:text-white transition"
                            >
                                Khám Phá Ngay
                            </Link>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
