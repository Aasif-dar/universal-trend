import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Home from "./pages/Home";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Fragrances from "./pages/Fragrence";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import ProductDetails from "./components/ProductDetails";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/Ordersuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import MyOrders from "./pages/MyOrders";
import AdminOrders from "./pages/AdminOrders";
import AdminRoute from "./components/AdminRoute";
import AdminAddProduct from "./pages/AddAdminProduct";
import Profile from "./pages/Profile";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import AdminProducts from "./pages/AdminProducts";



function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25 }}
  >
    <Routes location={location}>
      {/* your routes */}
    </Routes>
  </motion.div>
</AnimatePresence>


  return (
    <>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <NavBar />

      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Routes>

      <Route
      path="/admin/products"
      element={
      <AdminRoute>
      <AdminProducts />
      </AdminRoute>
  }
/>
        <Route
        path="/profile"
        element={
        <ProtectedRoute>
        <Profile />
        </ProtectedRoute>
  }
/>

        <Route 
        path="/admin/add-product"
        element={
        <AdminRoute>
        <AdminAddProduct />
        </AdminRoute>
  }
/>

     <Route
     path="/my-orders"
     element={
    <ProtectedRoute>
    <MyOrders />
    </ProtectedRoute>
  }
/>


      <Route path="/cart" element={
      <ProtectedRoute>
      <Cart />
      </ProtectedRoute>
  }
/>
      <Route
      path="/checkout"
      element={
     <ProtectedRoute>
     <Checkout />
     </ProtectedRoute>
  }
/>    <Route
      path="/admin/orders"
      element={
      <AdminRoute>
      <AdminOrders />
      </AdminRoute>
  }
/>

        <Route path="/" element={<Home />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/fragrances" element={<Fragrances/>} />
        <Route path="/login" element={<Auth />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />

      </Routes>
    </>
  );
}

export default App;
