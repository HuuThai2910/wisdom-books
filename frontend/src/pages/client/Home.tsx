import Services from "../../components/Services/Services";
import OurProducts from "../../components/Product/OurProducts";
import ProductBanner from "../../components/Product/ProductBanner";
import SuggestProduct from "../../components/Product/SuggestProduct";
import ProductOffers from "../../components/ProductOffers/ProductOffers";
import { useBooks } from "../../contexts/BookContext";
export default function Home() {
    const { books, loading } = useBooks();

    return (
        <>
            <div className="wisbook-gradient-overlay">
                <Services />
                <ProductOffers />
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
                    <OurProducts books={books} />
                )}
                <ProductBanner />
            </main>
            <div className="wisbook-gradient-overlay">
                {!loading && <SuggestProduct books={books} />}
            </div>
        </>
    );
}
