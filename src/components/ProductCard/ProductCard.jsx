import "./ProductCard.css";
import {
  FaHeart,
  FaStar,
  FaShoppingCart,
} from "react-icons/fa";

import { useCart } from "../../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <span className="discount">
        {product.discount}
      </span>

      <button className="favorite-btn">
        <FaHeart />
      </button>

      <img
        src={product.image}
        alt={product.name}
      />

      <h3>{product.name}</h3>

      <div className="rating">
        <FaStar className="star" />
        <span>{product.rating}</span>
      </div>

      <div className="price">
        <span className="new-price">
          {product.price.toLocaleString()}₫
        </span>

        <span className="old-price">
          {product.oldPrice.toLocaleString()}₫
        </span>
      </div>

      <button
        className="cart-btn"
        onClick={() => addToCart(product)}
      >
        <FaShoppingCart />

        <span style={{ marginLeft: 8 }}>
          Thêm vào giỏ
        </span>
      </button>
    </div>
  );
}

export default ProductCard;