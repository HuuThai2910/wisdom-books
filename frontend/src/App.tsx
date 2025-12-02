import "./App.css";
import CartPage from "./pages/client/CartPage";
import CheckOutPage from "./pages/client/CheckoutPage";
import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";
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
import ViewBookDetail from "./pages/admin/ViewBookDetail";
import ScrollToTop from "./components/ScrollToTop";
import ClientLayout from "./components/common/ClientLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageUserPage from "./pages/admin/ManageUserPage";
import OrderManagement from "./pages/admin/OrderManagement";
import WarehousePage from "./pages/admin/WarehousePage";
import PermissionsPage from "./pages/admin/PermissionsPage";
import AdminProfile from "./pages/admin/AdminProfile";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

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

      <div style={{ backgroundColor: isAdminRoute ? "#f9fafb" : "#fafafa" }}>
        <Routes>
          <Route
            path="/"
            element={
              <ClientLayout>
                <Home />
              </ClientLayout>
            }
          />
          <Route
            path="/books"
            element={
              <ClientLayout>
                <BooksPage />
              </ClientLayout>
            }
          />
          <Route
            path="/books/:id"
            element={
              <ClientLayout>
                <BookDetailPage />
              </ClientLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <ClientLayout>
                <CartPage />
              </ClientLayout>
            }
          />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route
            path="/checkout"
            element={
              <ClientLayout>
                <CheckOutPage />
              </ClientLayout>
            }
          />
          <Route
            path="/about"
            element={
              <ClientLayout>
                <About />
              </ClientLayout>
            }
          />
          <Route
            path="/shipping"
            element={
              <ClientLayout>
                <ShippingPage />
              </ClientLayout>
            }
          />
          <Route
            path="/return-policy"
            element={
              <ClientLayout>
                <ReturnPolicyPage />
              </ClientLayout>
            }
          />
          <Route
            path="/customer-support"
            element={
              <ClientLayout>
                <CustomerSupportPage />
              </ClientLayout>
            }
          />
          <Route
            path="/payment-methods"
            element={
              <ClientLayout>
                <PaymentMethodsPage />
              </ClientLayout>
            }
          />
          <Route
            path="/security"
            element={
              <ClientLayout>
                <SecurityPage />
              </ClientLayout>
            }
          />
          <Route
            path="/book-collection"
            element={
              <ClientLayout>
                <BookCollectionPage />
              </ClientLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <ClientLayout>
                <ContactPage />
              </ClientLayout>
            }
          />

          <Route path="/admin/books" element={<BookManagement />} />
          <Route path="/admin/books/create" element={<ViewUpsertBook />} />
          <Route path="/admin/books/edit" element={<ViewUpsertBook />} />
          <Route path="/admin/books/view" element={<ViewBookDetail />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/manage-users" element={<ManageUserPage />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/warehouse" element={<WarehousePage />} />
          <Route path="/admin/permissions" element={<PermissionsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
