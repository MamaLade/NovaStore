import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatters";

function Orders() {
  const { orders } = useCart();

  return (
    <div className="container">
      <h2>Lịch sử mua hàng</h2>

      {orders.length === 0 ? (
        <p>Chưa có đơn hàng</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>
            <h4>{order.createdAt}</h4>
            <p>{formatCurrency(order.total)}</p>

            {order.items.map((item) => (
              <div key={item.id}>
                {item.name} x{item.quantity}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
