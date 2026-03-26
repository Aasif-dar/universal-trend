import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await customFetch.get("/api/orders/allorders");
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error:", err);

      if (err.response?.status === 401) {
        navigate("/login"); // 🔐 not logged in
      } else if (err.response?.status === 403) {
        navigate("/"); // 🚫 not admin
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Mark order as delivered
  const markDelivered = async (orderId) => {
    try {
      await customFetch.put(`/api/orders/${orderId}/status`, {
        status: "Delivered",
      });

      // 🔥 refresh orders
      fetchOrders();

    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update order status");
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading orders...
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">

        <h1 className="text-3xl font-semibold mb-10">
          Admin Orders
        </h1>

        {/* MOBILE VIEW */}
        <div className="grid gap-4 md:hidden">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-lg p-4 shadow-sm"
            >

              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Customer</span>
                <span className="font-medium">{order.user?.name}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Email</span>
                <span>{order.user?.email}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Items</span>
                <span>{order.items.length}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Total</span>
                <span className="font-semibold">₹{order.total}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Date</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex justify-between items-center mt-3">

                {order.status === "Delivered" ? (
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Delivered
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                )}

                {order.status === "Delivered" ? (
                  <button
                    disabled
                    className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-500"
                  >
                    Completed
                  </button>
                ) : (
                  <button
                    onClick={() => markDelivered(order._id)}
                    className="px-3 py-1 text-xs rounded bg-black text-white"
                  >
                    Mark Delivered
                  </button>
                )}

              </div>

            </div>
          ))}

        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto bg-white border rounded-xl shadow-sm">

          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Items</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>

              {orders.map((order) => (

                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="p-4 font-medium">
                    {order.user?.name}
                  </td>

                  <td className="p-4 text-gray-600">
                    {order.user?.email}
                  </td>

                  <td className="p-4">
                    {order.items.length}
                  </td>

                  <td className="p-4 font-semibold">
                    ₹{order.total}
                  </td>

                  <td className="p-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4">

                    {order.status === "Delivered" ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        Delivered
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    )}

                  </td>

                  <td className="p-4">

                    {order.status === "Delivered" ? (
                      <button
                        disabled
                        className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-500"
                      >
                        Completed
                      </button>
                    ) : (
                      <button
                        onClick={() => markDelivered(order._id)}
                        className="px-3 py-1 text-xs rounded bg-black text-white hover:bg-gray-800"
                      >
                        Mark Delivered
                      </button>
                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </section>
  );
};

export default AdminOrders;