import { useState } from "react";
import { FaStar, FaUser } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import "./ProductReviews.css";

function ProductReviews({ productId }) {
  const { reviews, addReview, getProductReviews, user } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const productReviews = getProductReviews(productId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Bạn cần đăng nhập để đánh giá sản phẩm");
      return;
    }

    if (!comment.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }

    addReview({
      productId,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
    });

    setComment("");
    setRating(5);
    setShowForm(false);
  };

  const averageRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : 0;

  return (
    <div className="product-reviews">
      <div className="reviews-header">
        <h3>Đánh giá sản phẩm</h3>
        <div className="reviews-summary">
          <div className="average-rating">
            <span className="rating-number">{averageRating}</span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={star <= averageRating ? "filled" : ""}
                />
              ))}
            </div>
            <span className="review-count">{productReviews.length} đánh giá</span>
          </div>
        </div>
      </div>

      {user && (
        <button
          className="btn-write-review"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Đóng" : "Viết đánh giá"}
        </button>
      )}

      {showForm && (
        <form className="review-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Đánh giá của bạn</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={star <= rating ? "active" : ""}
                  onClick={() => setRating(star)}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Nội dung đánh giá</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowForm(false)}>
              Hủy
            </button>
            <button type="submit" className="btn-submit">
              Gửi đánh giá
            </button>
          </div>
        </form>
      )}

      <div className="reviews-list">
        {productReviews.length === 0 ? (
          <p className="no-reviews">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
        ) : (
          productReviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    <FaUser />
                  </div>
                  <div>
                    <span className="reviewer-name">{review.userName}</span>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className="review-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={star <= review.rating ? "filled" : ""}
                    />
                  ))}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductReviews;
