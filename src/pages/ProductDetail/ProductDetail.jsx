import "./ProductDetail.css";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaHeart, FaMapMarkerAlt, FaShippingFast, FaStar, FaStore } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatters";
import ProductReviews from "../../components/ProductReviews/ProductReviews";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart, isWishlisted, toggleWishlist, products, getProductRating } = useCart();

  const product = (products || []).find((p) => p.id === Number(id));
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");

  // Get price based on selected size
  const currentPrice = product?.sizePrices?.[selectedSize] || product?.price || 0;

  // Get rating from reviews
  const productRating = getProductRating(product?.id);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) return <h2 className="detail-empty">Không tìm thấy sản phẩm</h2>;

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - currentPrice) / product.oldPrice) * 100)
    : 0;

  const liked = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      price: currentPrice,
    });
  };

  return (
    <div className="detail-page">
      <div className="detail">
        <div className="left">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="right">
          <span className="detail-category">{product.brand}</span>
          <h2>{product.name}</h2>

          <div className="detail-rating">
            <span><FaStar /> {productRating || "Chưa có đánh giá"}</span>
            <span>Đã bán {product.sold}</span>
            <span>Còn {product.stock} sản phẩm</span>
          </div>

          <div className="detail-price-row">
            <p className="price">{formatCurrency(currentPrice)}</p>
            {product.oldPrice && <p className="old">{formatCurrency(product.oldPrice)}</p>}
            {discount > 0 && <span className="discount">-{discount}%</span>}
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="option-group">
            <span>Size</span>
            <div className="option-list">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  className={selectedSize === size ? "active" : ""}
                  onClick={() => setSelectedSize(size)}
                  type="button"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <span>Màu sắc</span>
            <div className="option-list">
              {product.colors?.map((color) => (
                <button
                  key={color}
                  className={selectedColor === color ? "active" : ""}
                  onClick={() => setSelectedColor(color)}
                  type="button"
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="brand-box">
            <div className="brand-box-main">
              <div className="brand-box-icon"><FaStore /></div>
              <div>
                <h3>{product.brand}</h3>
                <p>
                  {product.category === "ao"
                    ? "Áo"
                    : product.category === "quan"
                    ? "Quần"
                    : product.category === "giay"
                    ? "Giày"
                    : product.category === "tui"
                    ? "Túi xách"
                    : product.category === "mu"
                    ? "Mũ lưỡi trai"
                    : product.category === "vong"
                    ? "Vòng tay"
                    : "Phụ kiện"}
                </p>
              </div>
            </div>
          </div>

          <div className="detail-actions">
            <button onClick={handleAddToCart}>Thêm vào giỏ</button>
            <button
              className={["wishlist-detail-btn", liked ? "liked" : ""]
                .filter(Boolean)
                .join(" ")}
              onClick={() => toggleWishlist(product)}
              type="button"
            >
              <FaHeart />
              <span>{liked ? "Đã yêu thích" : "Yêu thích"}</span>
            </button>
          </div>
        </div>

        <div className="related">
          <h3>Sản phẩm liên quan</h3>

          <div className="grid">
            {related.map((p) => (
              <Link to={`/product/${p.id}`} key={p.id} className="mini-card">
                <img src={p.image} alt={p.name} />
                <p>{p.name}</p>
                <span>{p.brand}</span>
                <b>{formatCurrency(p.price)}</b>
              </Link>
            ))}
          </div>
        </div>

        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}

export default ProductDetail;
