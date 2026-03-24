import { useState } from "react";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {toast} from "sonner"

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    address: "",
    state: "",
    payment: "cod",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryCharge =
    form.state.toLowerCase() === "kashmir" ? 100 : 500;

  const total = subtotal + deliveryCharge;

  const placeOrder = async () => {
    if (!form.phone || !form.address || !form.state) {
      toast.warning("Please fill all delivery details");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          items: cart,
          subtotal,
          total,
          address: form.address,
          phone: form.phone,
          state: form.state,
          paymentMethod: form.payment,
          deliveryCharge
})
      });

      if (!res.ok) {
        alert("Order failed");
        setLoading(false);
        return;
      }

      const data = await res.json();

      clearCart();


      navigate(`/order-success/${data._id}`);
      console.log(data)
      

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10">

        {/* DELIVERY FORM */}
        <div className="bg-white p-8 border rounded-xl shadow-sm">

          <h2 className="text-2xl font-semibold mb-6">
            Delivery Details
          </h2>

          <input
            placeholder="Phone Number"
            className="border w-full px-4 py-3 rounded-md mb-4"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />

          <textarea
            placeholder="Full Address"
            rows="3"
            className="border w-full px-4 py-3 rounded-md mb-4"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />

          <input
            placeholder="State (example: Kashmir)"
            className="border w-full px-4 py-3 rounded-md mb-6"
            value={form.state}
            onChange={(e) => handleChange("state", e.target.value)}
          />

          <h3 className="font-medium mb-3">
            Payment Method
          </h3>

          <label className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              checked={form.payment === "cod"}
              onChange={() => handleChange("payment", "cod")}
            />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-2 text-gray-400">
            <input type="radio" disabled />
            Online Payment (Coming Soon)
          </label>

        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white p-8 border rounded-xl shadow-sm h-fit sticky top-24">

          <h2 className="text-2xl font-semibold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">

            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}

            <hr />

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>₹{deliveryCharge}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>

        </div>

      </div>
    </section>
  );
};

export default Checkout;