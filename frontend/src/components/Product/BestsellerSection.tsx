import { motion } from "framer-motion";
import { Book } from "../../types";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, TrendingUp } from "lucide-react";

// Import author images
import frankLampardImg from "../../assets/img/author/FrankLampard.png";
import jkRowlingImg from "../../assets/img/author/JKRowling.png";
import pedroDomingosImg from "../../assets/img/author/PedroDomingos.png";
import rayDalioImg from "../../assets/img/author/RayDalio.png";
import robertGreeneImg from "../../assets/img/author/RobertGreene.png";
import shakespeareImg from "../../assets/img/author/Shakespeare.png";
import suzanneCollinsImg from "../../assets/img/author/SuzanneCollins.png";
import thichNhatHanhImg from "../../assets/img/author/ThichNhatHanh.png";
import jeffkinnneyImg from "../../assets/img/author/Jeffkinnney.png";
import karenMMcManusImg from "../../assets/img/author/KarenMMcManus.png";
interface BestsellerSectionProps {
    books: Book[];
}

interface AuthorStats {
    author: string;
    bookCount: number;
    books: Book[];
}

export default function BestsellerSection({ books }: BestsellerSectionProps) {
    const navigate = useNavigate();
    const topAuthors = useMemo(() => {

        const authorMap = new Map<string, AuthorStats>();

        books.forEach((book) => {
            const author = book.author || "Không rõ tác giả";
            if (!authorMap.has(author)) {
                authorMap.set(author, {
                    author,
                    bookCount: 0,
                    books: [],
                });
            }
            const stats = authorMap.get(author)!;
            stats.bookCount++;
            stats.books.push(book);
        });

        const sortedAuthors = Array.from(authorMap.values())
            .sort((a, b) => b.bookCount - a.bookCount)
            .slice(0, 8);
        return sortedAuthors;
    }, [books]);

    const handleAuthorClick = (author: string) => {
        const trimmedAuthor = author.trim();
        navigate(`/books?author=${encodeURIComponent(trimmedAuthor)}`);
    };

    const getAuthorImage = (authorName: string): string => {
        const normalizeString = (str: string) => {
            return str
                .toLowerCase()
                .trim()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
        };

        const normalizedName = normalizeString(authorName);
        const authorImageMap: { [key: string]: string } = {
            // Frank Lampard
            "frank lampard": frankLampardImg,

            // JK Rowling
            "j.k. rowling": jkRowlingImg,
            "jk rowling": jkRowlingImg,
            "j k rowling": jkRowlingImg,

            // Pedro Domingos
            "pedro domingos": pedroDomingosImg,

            // Ray Dalio
            "ray dalio": rayDalioImg,

            // Robert Greene
            "robert greene": robertGreeneImg,

            // William Shakespeare
            "william shakespeare": shakespeareImg,
            shakespeare: shakespeareImg,

            // Suzanne Collins
            "suzanne collins": suzanneCollinsImg,

            // Thích Nhất Hạnh
            "thich nhat hanh": thichNhatHanhImg,

            // Jeff Kinney
            "jeff kinney": jeffkinnneyImg,

            // Karen M McManus
            "karen m mcmanus": karenMMcManusImg,
        };
        return authorImageMap[normalizedName] || "";
    };

    return (
        <section className="products bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 pb-24 pt-20 px-35">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-700 px-5 py-2 rounded-full mb-6 font-semibold text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>TÁC GIẢ PHỔ BIẾN</span>
                        </div>
                        <h2 className="text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            Tác Giả{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Nổi Bật
                            </span>
                        </h2>
                        <div className="h-1.5 w-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full mx-auto mb-6" />
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                            Khám phá những tác giả xuất sắc với nhiều tác phẩm
                            giá trị tại Wisdom Books
                        </p>
                    </motion.div>
                </div>

                {/* Authors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {topAuthors.map((authorStats, idx) => {
                        const authorImage = getAuthorImage(authorStats.author);
                        return (
                            <motion.div
                                key={authorStats.author}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.6,
                                    delay: idx * 0.08,
                                    ease: "easeOut",
                                }}
                                whileHover={{ y: -12, scale: 1.02 }}
                                onClick={() =>
                                    handleAuthorClick(authorStats.author)
                                }
                                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden group border border-gray-100"
                            >
                                {/* Author Image */}
                                <div className="relative h-64 overflow-hidden">
                                    {authorImage ? (
                                        <img
                                            src={authorImage}
                                            alt={authorStats.author}
                                            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                // Fallback to gradient if image fails to load
                                                e.currentTarget.style.display =
                                                    "none";
                                                e.currentTarget.parentElement!.classList.add(
                                                    "bg-gradient-to-br",
                                                    "from-blue-500",
                                                    "to-purple-600"
                                                );
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />

                                    {/* Book Count Badge */}
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-xl border border-white/20">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-blue-600" />
                                                <span className="text-blue-600 font-bold text-sm">
                                                    {authorStats.bookCount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Author Name on Image */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3 className="text-2xl font-bold text-white mb-1 line-clamp-2 drop-shadow-lg">
                                            {authorStats.author}
                                        </h3>
                                        <p className="text-white/90 text-sm font-medium">
                                            {authorStats.bookCount} tác phẩm
                                        </p>
                                    </div>
                                </div>

                                {/* Books List */}
                                <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                                    <div className="space-y-2.5">
                                        {authorStats.books
                                            .slice(0, 3)
                                            .map((book) => (
                                                <div
                                                    key={book.id}
                                                    className="flex items-start gap-3 group/item"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-300" />
                                                    <span className="text-sm text-gray-700 line-clamp-1 flex-1 group-hover/item:text-blue-600 transition-colors duration-300 font-medium">
                                                        {book.title}
                                                    </span>
                                                </div>
                                            ))}
                                        {authorStats.bookCount > 3 && (
                                            <p className="text-xs text-gray-500 italic pl-5 mt-3">
                                                và {authorStats.bookCount - 3}{" "}
                                                tác phẩm khác
                                            </p>
                                        )}
                                    </div>

                                    {/* View All Button */}
                                    <div className="mt-6 pt-5 border-t border-gray-200">
                                        <div className="flex items-center justify-between text-blue-600 font-bold text-sm group-hover:text-blue-700 transition-colors">
                                            <span>Xem tất cả tác phẩm</span>
                                            <motion.span
                                                animate={{
                                                    x: [0, 5, 0],
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                                className="text-lg"
                                            >
                                                →
                                            </motion.span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
