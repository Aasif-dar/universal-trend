import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import customFetch from "../utils/customFetch";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch order once
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await customFetch.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Order fetch error:", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // ✅ Download invoice
  const downloadInvoice = () => {
    if (!order?.invoiceUrl) return;
    window.open(order.invoiceUrl);
  };

  // ✅ WhatsApp share
  const sendWhatsApp = () => {
    if (!order?.invoiceUrl) return;

    const message = `
🧾 Universal Trend Invoice

Order ID: ${orderId}

Download your invoice:
${order.invoiceUrl}
`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading order...
      </div>
    );
  }

  // ❌ Order not found
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="mb-4">Order not found</p>
        <button
          onClick={() => navigate("/")}
          className="border px-4 py-2"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border rounded-xl p-10 max-w-lg text-center shadow-sm">

        <h1 className="text-3xl font-semibold mb-4">
          🎉 Order Placed Successfully
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for shopping with us.
        </p>

        <div className="mb-6">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-semibold text-lg">{orderId}</p>
        </div>

        <div className="space-y-3">

          <button
            onClick={downloadInvoice}
            className="w-full bg-black text-white py-3 rounded-md"
          >
            Download Invoice
          </button>

          <button
            onClick={sendWhatsApp}
            className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600"
          >
            Send Invoice via WhatsApp
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full text-sm text-gray-500 underline"
          >
            Continue Shopping
          </button>

        </div>

      </div>
    </section>
  );
};

export default OrderSuccess;