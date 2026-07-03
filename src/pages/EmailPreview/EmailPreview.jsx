import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import OrderConfirmationEmail from "../../components/OrderConfirmationEmail/OrderConfirmationEmail";

function EmailPreview() {
  const { orderId } = useParams();
  const { orders } = useCart();

  // Find the order or use a sample order for demo
  const order = orders.find((o) => o.id === Number(orderId)) || {
    id: orderId || "123456789",
    items: [
      {
        id: 1,
        name: "Nike Hoodie Oversize",
        image: "https://picsum.photos/seed/nike1/600/600",
        price: 390000,
        quantity: 2,
        selectedSize: "L",
        selectedColor: "Đen",
      },
      {
        id: 2,
        name: "Áo Thun Basic Cotton",
        image: "https://picsum.photos/seed/tee2/600/600",
        price: 199000,
        quantity: 1,
        selectedSize: "M",
        selectedColor: "Trắng",
      },
    ],
    total: 979000,
    customer: {
      name: "Nguyễn Văn A",
      phone: "0356 832 776",
      address: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
      note: "Giao hàng giờ hành chính",
    },
    paymentMethod: "cod",
    createdAt: "03/07/2026 16:30",
    status: "Đang xử lý",
  };

  return (
    <div style={{ padding: "40px 20px", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#1a1a2e", marginBottom: "10px" }}>Xem trước Email xác nhận đơn hàng</h1>
        <p style={{ color: "#666" }}>
          Đây là giao diện email sẽ được gửi cho khách hàng sau khi đặt hàng thành công.
        </p>
      </div>
      <OrderConfirmationEmail order={order} />
    </div>
  );
}

export default EmailPreview;
