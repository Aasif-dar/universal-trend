import { useParams, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const downloadInvoice = async () => {

  const res = await fetch(
    `http://localhost:5000/api/orders/${orderId}`
  );

  const order = await res.json();

  window.open(order.invoiceUrl);
};

 const sendWhatsApp = async () => {

  const res = await fetch(
    `http://localhost:5000/api/orders/${orderId}`
  );

  const order = await res.json();

  const message = `
🧾 Universal Trend Invoice

Order ID: ${orderId}

Download your invoice:
${order.invoiceUrl}
`;

  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
};

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