import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { Book } from "../../types";
import BookCard from "./BookCard";

interface FeaturedBooksProps {
    books: Book[];
    loading: boolean;
}

export default function FeaturedBooks({ books, loading }: FeaturedBooksProps) {
    return (
        <section className="py-16">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold wisbook-gradient-text">
                        Sách Nổi Bật
                    </h2>
                    <Link
                        to="/books"
                        className="flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all"
                    >
                        Xem tất cả <FaChevronRight />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-xl text-gray-600">Đang tải...</div>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
