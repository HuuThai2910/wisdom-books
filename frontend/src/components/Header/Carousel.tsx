import { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "animate.css";

import bannerBg from "../../assets/img/banner.jpg";
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
      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white flex items-center justify-center shadow-lg hover:shadow-xl z-40 transition-all duration-300 hover:scale-105 border-2 border-white/30 backdrop-blur-sm group"
    >
      <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <svg
        className="w-5 h-5 relative z-10 transform group-hover:translate-x-0.5 transition-transform duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="-7 0 24 24"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { currentSlide, slideCount, ...rest } = props;
  return (
    <button
      {...rest}
      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white flex items-center justify-center shadow-lg hover:shadow-xl z-40 transition-all duration-300 hover:scale-105 border-2 border-white/30 backdrop-blur-sm group"
    >
      <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <svg
        className="w-5 h-5 relative z-10 transform group-hover:-translate-x-0.5 transition-transform duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="-7 0 24 24"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
};

export default function Carousel() {
  const sliderRef = useRef<Slider>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStart(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const settings = {
    autoplay: start,
    autoplaySpeed: 5000,
    fade: false,
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots: any) => (
      <div style={{ bottom: "30px" }}>
        <ul className="flex gap-2 justify-center"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-gray-400 hover:bg-blue-500 transition-all duration-300 cursor-pointer"></div>
    ),
  };

  const slides = [
    {
      image: img1,
      badge: "Quality Books",
      title: "Đọc Sách Mỗi Ngày",
      highlight: "Tri Thức",
      subtitle: "Mở Ra Tương Lai",
      desc: "Chúng tôi mang đến cho bạn những cuốn sách chất lượng cao trong vòng 30 phút. Nếu bạn muốn nâng cao kiến thức, hãy để chúng tôi đồng hành cùng bạn.",
      awards: {
        title: "#1 Nhà Sách Uy Tín",
        year: "2024 Best Service Award",
        rating: "4.8",
        reviews: "12.9k Đánh giá",
      },
    },
    {
      image: img2,
      badge: "Best Seller",
      title: "Khám Phá Kho",
      highlight: "Sách Hay",
      subtitle: "Nhất Việt Nam",
      desc: "Từ tiểu thuyết, self-help đến sách thiếu nhi. Mỗi cuốn sách là một hành trình mới, một thế giới mới đang chờ bạn khám phá.",
      awards: {
        title: "#1 Cửa Hàng Sách Trực Tuyến",
        year: "2024 Reader's Choice",
        rating: "4.9",
        reviews: "15.2k Đánh giá",
      },
    },
    {
      image: img3,
      badge: "Special Offer",
      title: "Ưu Đãi Đặc Biệt",
      highlight: "Giảm Giá",
      subtitle: "Lên Đến 40%",
      desc: "Cơ hội sở hữu những đầu sách bán chạy nhất với giá ưu đãi. Đừng bỏ lỡ chương trình khuyến mãi đặc biệt dành riêng cho bạn!",
      awards: {
        title: "#1 Ưu Đãi Hấp Dẫn",
        year: "2024 Hot Deal Award",
        rating: "4.7",
        reviews: "10.5k Đánh giá",
      },
    },
    {
      image: img4,
      badge: "New Arrivals",
      title: "Sách Mới Về",
      highlight: "Hàng Tuần",
      subtitle: "Cập Nhật Liên Tục",
      desc: "Luôn cập nhật những đầu sách mới nhất từ các tác giả trong và ngoài nước. Đón đọc ngay những tác phẩm hot nhất hiện nay!",
      awards: {
        title: "#1 Sách Mới Nhất",
        year: "2024 Fresh Content",
        rating: "5.0",
        reviews: "8.3k Đánh giá",
      },
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bannerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-white/95 via-white/90 to-white/85"></div>
      </div>

      <div className="relative z-10 pt-20 px-5">
        <Slider
          key={start ? "started" : "waiting"}
          ref={sliderRef}
          {...settings}
        >
          {slides.map((slide, i) => (
            <div key={i}>
              <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-60 items-center min-h-[400px]">
                  {/* Left Content */}
                  <div className="space-y-4 animate__animated animate__fadeInLeft pl-10 ml-20">
                    {/* Badge */}
                    <div className="inline-block">
                      <span className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                        {slide.badge}
                      </span>
                    </div>

                    {/* Main Heading */}
                    <div>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                        <span className="text-gray-900">{slide.title}</span>
                        <br />
                        <span className="text-blue-600">{slide.highlight}</span>
                        <br />
                        <span className="text-gray-900">{slide.subtitle}</span>
                      </h1>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
                      {slide.desc}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Link
                        to="/books"
                        className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <span>Mua Sách Ngay</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </Link>
                      <Link
                        to="/about"
                        className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-full font-semibold text-sm hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                      >
                        Xem Thêm
                      </Link>
                    </div>

                    {/* Awards Badge */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                      <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">
                          {slide.awards.title}
                        </h3>
                        <p className="text-xs text-blue-600 font-semibold">
                          {slide.awards.year}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, idx) => (
                              <svg
                                key={idx}
                                className="w-3 h-3 text-yellow-400 fill-current"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">
                            {slide.awards.rating}
                          </span>
                          <span className="text-xs text-gray-400">
                            • {slide.awards.reviews}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="relative animate__animated animate__fadeInRight">
                    {/* Decorative Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-linear-to-br from-blue-400 to-blue-600 rounded-full opacity-20 blur-3xl"></div>

                    {/* Main Circle with Image */}
                    <div className="relative w-full max-w-[400px] mx-auto">
                      <div className="relative w-[350px] h-[350px] mx-auto">
                        {/* Background Circle */}
                        <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-blue-600 rounded-full"></div>

                        {/* Image Container */}
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                          <img
                            src={slide.image}
                            alt={`slide-${i}`}
                            className="w-full h-full object-cover scale-110"
                          />
                        </div>

                        {/* Quality Badge */}
                        <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-3 border-white transform rotate-12 z-10">
                          <div className="text-center">
                            <div className="text-[9px] font-bold">Good</div>
                            <div className="text-[8px] font-semibold">
                              Quality
                            </div>
                            <div className="text-[7px]">Book</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        <style>{`
          .slick-dots li.slick-active div {
            background-color: #3b82f6 !important;
            width: 32px !important;
            border-radius: 9999px !important;
          }
          .slick-dots li div {
            margin: 0 !important;
          }
        `}</style>
      </div>
    </div>
  );
}
