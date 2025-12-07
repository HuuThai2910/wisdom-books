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
import UserFormPage from "./pages/admin/UserFormPage";
import OrderManagement from "./pages/admin/OrderManagement";
import WarehousePage from "./pages/admin/WarehousePage";
import PermissionsPage from "./pages/admin/PermissionsPage";
import AdminProfile from "./pages/admin/AdminProfile";
import PaymentSuccessPage from "./pages/client/PaymentSuccessPage";
import LoginPage from "./pages/client/LoginPage";
import OrdersPage from "./pages/client/OrdersPage";
import SettingsPage from "./pages/client/SettingsPage";
import RoleBasedRoute from "./components/common/RoleBasedRoute";
import StaffDashboard from "./pages/staff/StaffDashboard";
import WarehouseDashboard from "./pages/warehouse/WarehouseDashboard";
import Unauthorized from "./pages/Unauthorized";
import AccountDisabled from "./pages/AccountDisabled";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { tokenRefreshManager } from "./util/tokenRefreshManager";
import Cookies from "js-cookie";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Start token monitoring on app load if user is logged in
  useEffect(() => {
    const token = Cookies.get("id_token");
    const refreshToken = Cookies.get("refresh_token");

    if (token && refreshToken) {
      console.log("[App] User logged in, starting token monitoring");
      tokenRefreshManager.startMonitoring();
    }

    // Cleanup on unmount
    return () => {
      tokenRefreshManager.stopMonitoring();
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerStyle={{
          top: 80,
          zIndex: 9999,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
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

      <div
        style={{
          backgroundColor: isAdminRoute ? "#f9fafb" : "#fafafa",
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <ClientLayout>
                <Home />
              </ClientLayout>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/account-disabled" element={<AccountDisabled />} />
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
          <Route
            path="/category/:categoryName"
            element={
              <ClientLayout>
                <CategoryPage />
              </ClientLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <ClientLayout>
                <CheckOutPage />
              </ClientLayout>
            }
          />
          <Route
            path="/payment-success"
            element={
              <ClientLayout>
                <PaymentSuccessPage />
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
          <Route
            path="/orders"
            element={
              <ClientLayout>
                <OrdersPage />
              </ClientLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <ClientLayout>
                <SettingsPage />
              </ClientLayout>
            }
          />

          {/* Admin Routes - Only for ADMIN role (1) */}
          <Route
            path="/admin/books"
            element={
              <RoleBasedRoute allowedRoles={["1", "ADMIN", "2", "STAFF"]}>
                <BookManagement />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/books/create"
            element={
              <RoleBasedRoute allowedRoles={["1", "ADMIN", "2", "STAFF"]}>
                <ViewUpsertBook />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/books/edit"
            element={
              <RoleBasedRoute allowedRoles={["1", "ADMIN", "2", "STAFF"]}>
                <ViewUpsertBook />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/books/view"
            element={
              <RoleBasedRoute allowedRoles={["1", "ADMIN", "2", "STAFF"]}>
                <ViewBookDetail />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <RoleBasedRoute allowedRoles={["1", "ADMIN"]}>
                <Dashboard />
                {/* <ManageUserPage /> */}
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <RoleBasedRoute
                allowedRoles={[
                  "1",
                  "ADMIN",
                  "2",
                  "STAFF",
                  "4",
                  "WARE_HOUSE_STAFF",
                ]}
              >
                <AdminProfile />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleBasedRoute allowedRoles={["1", "ADMIN"]}>
                <ManageUserPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/user-form"
            element={
              <RoleBasedRoute allowedRoles={["1", "ADMIN"]}>
                <UserFormPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/user-form/:id"
            element={
              <RoleBasedRoute allowedRoles={["1", "ADMIN"]}>
                <UserFormPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <RoleBasedRoute allowedRoles={["1", "ADMIN", "2", "STAFF"]}>
                <OrderManagement />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/warehouse"
            element={
              <RoleBasedRoute
                allowedRoles={["1", "ADMIN", "4", "WARE_HOUSE_STAFF"]}
              >
                <WarehousePage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/permissions"
            element={
              <RoleBasedRoute allowedRoles={["1", "ADMIN"]}>
                <PermissionsPage />
              </RoleBasedRoute>
            }
          />

          {/* Staff Routes - Only for STAFF role (2) */}
          <Route
            path="/staff/dashboard"
            element={
              <RoleBasedRoute allowedRoles={["2", "STAFF"]}>
                <Dashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/staff/orders"
            element={
              <RoleBasedRoute allowedRoles={["2", "STAFF"]}>
                <OrderManagement />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/staff/books"
            element={
              <RoleBasedRoute allowedRoles={["2", "STAFF"]}>
                <BookManagement />
              </RoleBasedRoute>
            }
          />

          {/* Warehouse Routes - Only for WARE_HOUSE_STAFF role (4) */}
          <Route
            path="/warehouse/dashboard"
            element={
              <RoleBasedRoute allowedRoles={["4", "WARE_HOUSE_STAFF"]}>
                <Dashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/warehouse/inventory"
            element={
              <RoleBasedRoute allowedRoles={["4", "WARE_HOUSE_STAFF"]}>
                <WarehousePage />
              </RoleBasedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
