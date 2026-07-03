import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo & Giới thiệu */}
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/logo.png" alt="NovaStore Logo" />
            </div>
            <div className="footer-about">
              <h3>Về NovaStore</h3>
              <p>
                NovaStore là cửa hàng chuyên cung cấp quần áo, giày dép và phụ kiện thời trang với tiêu chí chất lượng tốt – giá cả hợp lý – phong cách hiện đại. Chúng tôi luôn cập nhật những xu hướng thời trang mới nhất nhằm mang đến cho khách hàng nhiều lựa chọn phù hợp với mọi độ tuổi và phong cách.
              </p>
              <p>
                Với mong muốn giúp mọi người dễ dàng sở hữu những sản phẩm thời trang đẹp mà không phải chi trả quá nhiều, NovaStore luôn lựa chọn những sản phẩm có chất lượng tốt, mẫu mã đa dạng và giá thành cạnh tranh. Mỗi sản phẩm đều được kiểm tra cẩn thận trước khi đến tay khách hàng nhằm đảm bảo trải nghiệm mua sắm tốt nhất.
              </p>
              <p>
                Không chỉ chú trọng đến chất lượng sản phẩm, NovaStore còn hướng đến việc xây dựng một môi trường mua sắm trực tuyến tiện lợi, nhanh chóng và an toàn. Chúng tôi luôn lắng nghe ý kiến của khách hàng để không ngừng cải thiện dịch vụ, nâng cao chất lượng phục vụ và mang đến sự hài lòng trong từng đơn hàng.
              </p>
              <p className="footer-slogan">
                NovaStore – Thời trang chất lượng, giá cả hợp lý cho mọi người.
              </p>
            </div>
          </div>

          {/* Liên hệ */}
          <div className="footer-section">
            <h3>Liên hệ</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <span className="contact-label">Chủ cửa hàng:</span>
                <span className="contact-value">Anh Công Anh</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">📞 Điện thoại:</span>
                <span className="contact-value">0356 832 776</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">☎️ Hotline:</span>
                <span className="contact-value">0356 832 776</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">✉️ Email:</span>
                <span className="contact-value">conganh14503@gmail.com</span>
              </div>
            </div>

            <h3 style={{ marginTop: "32px" }}>Mạng xã hội</h3>
            <div className="footer-social">
              <div className="social-item">
                <span className="social-label">📘 Facebook:</span>
                <span className="social-value">NovaStore Official</span>
              </div>
              <div className="social-item">
                <span className="social-label">🎵 TikTok:</span>
                <span className="social-value">@novastore.official</span>
              </div>
            </div>
          </div>

          {/* Chính sách */}
          <div className="footer-section">
            <h3>Chính sách</h3>
            <div className="footer-policies">
              <div className="policy-item">
                <h4>Chính sách giao hàng</h4>
                <ul>
                  <li>Giao hàng trên toàn quốc.</li>
                  <li>Thời gian giao hàng từ 2–5 ngày làm việc tùy khu vực.</li>
                  <li>Hỗ trợ kiểm tra thông tin đơn hàng trước khi thanh toán (nếu đơn vị vận chuyển hỗ trợ).</li>
                  <li>Miễn phí vận chuyển cho các đơn hàng đạt giá trị theo chương trình khuyến mãi của NovaStore.</li>
                </ul>
              </div>

              <div className="policy-item">
                <h4>Chính sách đổi trả</h4>
                <ul>
                  <li>Hỗ trợ đổi sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng.</li>
                  <li>Sản phẩm đổi trả phải còn nguyên tem, nhãn mác và chưa qua sử dụng.</li>
                  <li>Không áp dụng đổi trả đối với các sản phẩm giảm giá đặc biệt hoặc các chương trình xả kho, trừ trường hợp lỗi từ nhà sản xuất.</li>
                </ul>
              </div>

              <div className="policy-item">
                <h4>Chính sách bảo mật</h4>
                <ul>
                  <li>NovaStore cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng.</li>
                  <li>Mọi thông tin chỉ được sử dụng để xử lý đơn hàng, chăm sóc khách hàng và nâng cao chất lượng dịch vụ.</li>
                  <li>Không chia sẻ hoặc bán dữ liệu khách hàng cho bên thứ ba khi chưa có sự đồng ý.</li>
                </ul>
              </div>

              <div className="policy-item">
                <h4>Chính sách thanh toán</h4>
                <ul>
                  <li>Thanh toán khi nhận hàng (COD).</li>
                  <li>Chuyển khoản ngân hàng.</li>
                  <li>Thanh toán trực tuyến (sẵn sàng tích hợp trong các phiên bản nâng cấp).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NovaStore. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
