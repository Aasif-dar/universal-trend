import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

const AdminOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:5000/api/orders/allorders", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markDelivered = async (orderId) => {
    await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ status: "Delivered" }),
    });

    fetchOrders();
  };

  return (
  <section className="py-16 bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto px-4">

      <h1 className="text-3xl font-semibold mb-10">
        Admin Orders
      </h1>

      {/* MOBILE VIEW (CARDS) */}
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