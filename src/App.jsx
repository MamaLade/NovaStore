import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import ShopHighlights from "./components/ShopHighlights/ShopHighlights";
import Cart from "./components/Cart/Cart";
import MiniCart from "./components/Cart/MiniCart";
import AuthModal from "./components/AuthModal/AuthModal";
import Checkout from "./pages/Checkout/Checkout";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Profile from "./pages/Profile/Profile.jsx";
import Shop from "./pages/Shop/Shop";
import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import Products from "./pages/Admin/Products/Products";
import AdminOrders from "./pages/Admin/Orders/Orders";
import Users from "./pages/Admin/Users/Users";
import Footer from "./components/Footer/Footer";
import FlashSale from "./components/FlashSale/FlashSale";
import EmailPreview from "./pages/EmailPreview/EmailPreview";

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [miniOpen, setMiniOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  return (
    <>
      <Navbar
        openCart={() => setCartOpen(true)}
        setMiniOpen={setMiniOpen}
        search={search}
        setSearch={setSearch}
        openAuth={(mode) => setAuthMode(mode)}
      />

      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <MiniCart isOpen={miniOpen} onClose={() => setMiniOpen(false)} />

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitchMode={() => setAuthMode(authMode === "login" ? "register" : "login")}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <FlashSale />
              <ShopHighlights />
              <ProductGrid
                category={category}
                setCategory={setCategory}
                search={search}
                sort={sort}
                setSort={setSort}
              />
              <Footer />
            </>
          }
        />

        <Route path="/product/:id" element={<><ProductDetail /><Footer /></>} />
        <Route path="/shop/:id" element={<><Shop /><Footer /></>} />
        <Route path="/checkout" element={<><Checkout /><Footer /></>} />
        <Route path="/profile" element={<><Profile /><Footer /></>} />
        <Route path="/email-preview/:orderId" element={<><EmailPreview /><Footer /></>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
