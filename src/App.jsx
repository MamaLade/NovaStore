import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import Cart from "./components/Cart/Cart";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Navbar openCart={() => setIsCartOpen(true)} />

      <Hero />

      <ProductGrid />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}

export default App;