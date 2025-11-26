import { Link } from "react-router-dom";
import { Book } from "../../types";
import BookCard from "./BookCard";

interface NewArrivalsAndSaleProps {
    newBooks: Book[];
    saleBooks: Book[];
}

export default function NewArrivalsAndSale({
    newBooks,
    saleBooks,
}: NewArrivalsAndSaleProps) {
    return (
        <section className="py-16 bg-white/50">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* New Arrivals */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold wisbook-gradient-text">
                                Sách Mới Về
                            </h2>
                            <Link
                                to="/books"
                                className="text-purple-600 font-semibold hover:underline"
                            >
                                Xem thêm
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {newBooks.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    </div>

                    {/* Sale Books */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold wisbook-gradient-text">
                                Đang Giảm Giá
                            </h2>
                            <Link
                                to="/books"
                                className="text-purple-600 font-semibold hover:underline"
                            >
                                Xem thêm
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {saleBooks.length > 0 ? (
                                saleBooks.map((book) => (
                                    <BookCard key={book.id} book={book} />
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12 text-gray-500">
                                    Hiện chưa có sách giảm giá
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
