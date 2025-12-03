import Services from "../../components/Services/Services";
import OurProducts from "../../components/Product/OurProducts";
import ProductBanner from "../../components/Product/ProductBanner";
import SuggestProduct from "../../components/Product/SuggestProduct";
import ProductOffers from "../../components/ProductOffers/ProductOffers";
import { useEffect, useState } from "react";
import { Book } from "../../types";
import bookApi from "../../api/bookApi";

export default function Home() {
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch tất cả sách khi Home page mount
    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                setLoading(true);
                // Fetch nhiều sách hơn để đủ cho tất cả components
                const response = await bookApi.getAllBooks({
                    page: 0,
                    size: 500, // Increase to get all books
                    sort: "createdAt,desc",
                });

                // API returns ApiResponse<PaginatedResponse<Book>>
                // Structure: { data: { meta: {...}, result: Book[] } }
                const booksData = response.data.result || [];
                console.log("Books fetched:", booksData.length);

                setAllBooks(booksData);
            } catch (error) {
                console.error("Error fetching books:", error);
                setAllBooks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAllBooks();
    }, []);

    return (
        <>
            <div className="wisbook-gradient-overlay">
                <Services />
                <div className="px-4">
                    <ProductOffers />
                </div>
            </div>
            <main className="relative wisbook-gradient-overlay">
                {loading ? (
                    <section className="product bg-white py-16">
                        <div className="container mx-auto px-6">
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-pulse flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <div className="text-lg text-gray-600">
                                        Đang tải dữ liệu, vui lòng chờ...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (
                    <>
                        <OurProducts books={allBooks} />
                    </>
                )}
                <ProductBanner />
            </main>
            <div className="wisbook-gradient-overlay">
                {!loading && (
                    <>
                        <SuggestProduct books={allBooks} />
                    </>
                )}
            </div>
        </>
    );
}
