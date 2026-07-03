import { useState, useEffect } from "react";
import { FaBolt, FaClock } from "react-icons/fa";
import ProductCard from "../ProductCard/ProductCard";
import { useCart } from "../../context/CartContext";
import "./FlashSale.css";

function FlashSale() {
  const { products, addToCart, isWishlisted, toggleWishlist } = useCart();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Get flash sale products (products with oldPrice - discounted items)
  const flashSaleProducts = products
    ?.filter((p) => p.oldPrice && p.oldPrice > p.price)
    .slice(0, 8);

  // Countdown timer (24 hours from now for demo)
  useEffect(() => {
    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + 24);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetTime - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!flashSaleProducts || flashSaleProducts.length === 0) {
    return null;
  }

  return (
    <div className="flash-sale">
      <div className="flash-sale-header">
        <div className="flash-sale-title">
          <FaBolt className="flash-icon" />
          <h2>Flash Sale</h2>
          <span className="flash-badge">GIẢM GIÁ SỐC</span>
        </div>
        <div className="flash-sale-timer">
          <FaClock className="timer-icon" />
          <div className="timer-display">
            <div className="time-unit">
              <span className="time-value">{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="time-label">Giờ</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-unit">
              <span className="time-value">{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="time-label">Phút</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-unit">
              <span className="time-value">{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="time-label">Giây</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flash-sale-products">
        {flashSaleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
            isWishlisted={isWishlisted(product.id)}
            onToggleWishlist={toggleWishlist}
          />
        ))}
      </div>
    </div>
  );
}

export default FlashSale;
