import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

const AdminOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/orders", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        <h1 className="text-3xl font-semibold mb-10">
          Admin – Orders
        </h1>

        <div className="overflow-x-auto bg-white border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="p-3">{order.user.name}</td>
                  <td className="p-3">{order.user.email}</td>
                  <td className="p-3">₹{order.total}</td>
                  <td className="p-3">
                    {order.items.length}
                  </td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <select
                    value={order.status}
                    onChange={(e) =>  
                    fetch(`http://localhost:5000/api/orders/${order._id}/status`, {
                    method: "PUT",
                    headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                        },
                    body: JSON.stringify({ status: e.target.value }),
    })
  }
  className="border px-2 py-1"
>
  <option>Pending</option>
  <option>Shipped</option>
  <option>Delivered</option>
</select>

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
