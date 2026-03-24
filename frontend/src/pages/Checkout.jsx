import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const res = await fetch(
      "http://localhost:5000/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          items: cart,
          total,
        }),
      }
    );

    if (res.ok) {
      clearCart();
      navigate("/order-success");
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 border rounded-lg max-w-md w-full">

        <h1 className="text-2xl font-semibold mb-6">
          Checkout
        </h1>

        <button
          onClick={placeOrder}
          className="w-full bg-black text-white py-2"
        >
          Place Order
        </button>

      </div>
    </section>
  );
};

export default Checkout;
