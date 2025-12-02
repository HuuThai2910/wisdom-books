import "./App.css";
import CartPage from "./pages/client/CartPage";
import CheckOutPage from "./pages/client/CheckoutPage";
import OrdersPage from "./pages/client/OrdersPage";
import PaymentSuccessPage from "./pages/client/PaymentSuccessPage";
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
import ScrollToTop from "./components/ScrollToTop";
import ManageUserPage from "./pages/admin/ManageUserPage";
import UserFormPage from "./pages/admin/UserFormPage";
import OrderManagement from "./pages/admin/OrderManagement";
import LoginPage from "./pages/client/LoginPage";

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
                        background: "#fff",
                        color: "#000",
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: "#fff",
                            color: "#000",
                        },  
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
                
                    <Route path="/admin/orders" element={<OrderManagement />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route
                        path="/payment-success"
                        element={<PaymentSuccessPage />}
                    />
                    <Route
                        path="/admin/manage-users"
                        element={<ManageUserPage />}
                    />
                    <Route
                        path="/admin/user-form"
                        element={<UserFormPage />}
                    />
                    <Route
                        path="/admin/user-form/:id"
                        element={<UserFormPage />}
                    />
                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />
                </Routes>
            </div>
        </>
    );
}

export default App;
