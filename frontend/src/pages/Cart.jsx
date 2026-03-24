import { useCart } from "../Context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="mb-4 text-gray-600">Your cart is empty</p>
        <Link to="/" className="underline">
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-3xl font-semibold mb-10">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Items */}
          <div className="md:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex gap-4 bg-white p-4 border rounded-lg"
              >
                <img
                  src={item.image}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-medium">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Size: {item.size}
                  </p>
                  <p className="font-semibold">
                    ₹{item.price}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, -1)
                      }
                      className="border w-8 h-8"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, 1)
                      }
                      className="border w-8 h-8"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(item.id, item.size)
                    }
                    className="text-xs text-red-500 mt-2 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white p-6 border rounded-lg h-fit">
            <h3 className="text-lg font-medium mb-4">
              Order Summary
            </h3>

            <div className="flex justify-between mb-4">
              <span>Total</span>
              <span className="font-semibold">
                ₹{total}
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-black text-white py-2"
            >
              Checkout
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Cart;
