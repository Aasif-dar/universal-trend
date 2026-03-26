import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await customFetch.get("/api/orders/my");
        setOrders(res.data);
      } catch (err) {
        console.error("Fetch orders error:", err);

        if (err.response?.status === 401) {
          navigate("/login"); // 🔐 redirect if not logged in
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading orders...
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-3xl font-semibold mb-10">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border rounded-lg p-6"
              >
                <p className="text-sm text-gray-500 mb-2">
                  Order ID: {order._id}
                </p>

                <p className="font-medium mb-2">
                  Total: ₹{order.total}
                </p>

                <ul className="text-sm text-gray-600 list-disc pl-5">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} ({item.size}) × {item.quantity}
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-gray-400 mt-3">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <p className="text-sm mt-2">
                  Status: <b>{order.status}</b>
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default MyOrders;