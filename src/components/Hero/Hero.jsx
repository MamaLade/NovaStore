import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Mua sắm dễ dàng</h1>

        <p>
          Khám phá hàng ngàn sản phẩm chất lượng với giá ưu đãi mỗi ngày.
        </p>

        <button>Mua ngay</button>
      </div>

      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"
          alt="Hero"
        />
      </div>
    </section>
  );
}

export default Hero;