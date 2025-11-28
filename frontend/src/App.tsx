import "./App.css";
import CartPage from "./pages/client/CartPage";
import CheckOutPage from "./pages/client/CheckoutPage";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/client/Home";
import About from "./pages/client/About";
import ShippingPage from "./pages/client/ShippingPage";
import ReturnPolicyPage from "./pages/client/ReturnPolicyPage";
import CustomerSupportPage from "./pages/client/CustomerSupportPage";
import PaymentMethodsPage from "./pages/client/PaymentMethodsPage";
import SecurityPage from "./pages/client/SecurityPage";
import BookCollectionPage from "./pages/client/BookCollectionPage";
import ContactPage from "./pages/client/ContactPage";
import BooksPage from "./pages/client/BooksPage";
import BookDetailPage from "./pages/client/BookDetailPage";
import CategoryPage from "./pages/client/CategoryPage";
import BookManagement from "./pages/admin/BookManagement";
import ViewUpsertBook from "./pages/admin/ViewUpsertBook";
import ScrollToTop from "./components/ScrollToTop";

function App() {
    return (
        <>
            <ScrollToTop />
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#363636",
                        color: "#fff",
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: "#4ade80",
                            secondary: "#fff",
                        },
                    },
                    error: {
                        duration: 3000,
                        style: {
                            background: "#fff",
                            color: "#000",
                        },
                        iconTheme: {
                            primary: "#ef4444",
                            secondary: "#fff",
                        },
                    },
                }}
            />

            <div style={{ backgroundColor: "#fafafa" }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/books" element={<BooksPage />} />
                    <Route path="/books/:id" element={<BookDetailPage />} />
                    <Route
                        path="/category/:categoryName"
                        element={<CategoryPage />}
                    />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckOutPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/shipping" element={<ShippingPage />} />
                    <Route
                        path="/return-policy"
                        element={<ReturnPolicyPage />}
                    />
                    <Route
                        path="/customer-support"
                        element={<CustomerSupportPage />}
                    />
                    <Route
                        path="/payment-methods"
                        element={<PaymentMethodsPage />}
                    />
                    <Route path="/security" element={<SecurityPage />} />
                    <Route
                        path="/book-collection"
                        element={<BookCollectionPage />}
                    />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/admin/books" element={<BookManagement />} />
                    <Route
                        path="/admin/books/create"
                        element={<ViewUpsertBook />}
                    />
                    <Route
                        path="/admin/books/edit"
                        element={<ViewUpsertBook />}
                    />
                </Routes>
            </div>
        </>
    );
}

export default App;
