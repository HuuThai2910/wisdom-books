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
import BookManagement from "./pages/admin/BookManagement";
import ScrollToTop from "./components/ScrollToTop";

import Dashboard from "./pages/admin/Dashboard";
import EmployeesPage from "./pages/admin/EmployeesPage";
import CustomersPage from "./pages/admin/CustomersPage";
import OrdersPage from "./pages/admin/OrdersPage";
import WarehousePage from "./pages/admin/WarehousePage";
import StatisticsPage from "./pages/admin/StatisticsPage";
import PermissionsPage from "./pages/admin/PermissionsPage";

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
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/return-policy" element={<ReturnPolicyPage />} />
          <Route path="/customer-support" element={<CustomerSupportPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/book-collection" element={<BookCollectionPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/books" element={<BookManagement />} />

          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/employees" element={<EmployeesPage />} />
          <Route path="/admin/customers" element={<CustomersPage />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/admin/warehouse" element={<WarehousePage />} />
          <Route path="/admin/statistics" element={<StatisticsPage />} />
          <Route path="/admin/permissions" element={<PermissionsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
