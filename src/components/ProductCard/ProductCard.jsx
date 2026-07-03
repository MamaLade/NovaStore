import "./ProductCard.css";
import { FaHeart, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatters";
import { useCart } from "../../context/CartContext";

function ProductCard({
  product,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
}) {
  const { getProductRating } = useCart();

  if (!product) return null;

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const productRating = getProductRating(product.id);

  return (
    <div className="card">
      <div className="image-box">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>

        {discount > 0 && <span className="discount">-{discount}%</span>}

        <button
          className={["heart-button", isWishlisted ? "liked" : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onToggleWishlist?.(product)}
          aria-label={isWishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          type="button"
        >
          <FaHeart />
        </button>
      </div>

      <div className="info">
        <Link to={`/product/${product.id}`}>
          <h3 className="name">{product.name}</h3>
        </Link>

        <div className="shop-line">
          <FaStore />
          <span>{product.shop?.name}</span>
        </div>

        {product.description && (
          <p className="desc">
            {product.description.length > 60
              ? product.description.slice(0, 60) + "..."
              : product.description}
          </p>
        )}

        <div className="meta">
          <div className="rating">
            <FaStar className="star" />
            <span>{productRating || "Chưa có"}</span>
          </div>

          <span className="sold">Đã bán {product.sold}</span>
        </div>

        <div className="option-preview">
          <span>{product.sizes?.length || 0} size</span>
          <span>{product.colors?.length || 0} màu</span>
        </div>

        <div className="price-box">
          <span className="price">{formatCurrency(product.price)}</span>

          {product.oldPrice && (
            <span className="old-price">{formatCurrency(product.oldPrice)}</span>
          )}
        </div>

        <button className="btn" onClick={() => onAddToCart?.(product)}>
          <FaShoppingCart />
          <span>Thêm vào giỏ</span>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
