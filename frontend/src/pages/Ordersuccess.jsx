import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4">
        Order Placed 🎉
      </h1>
      <p className="text-gray-600 mb-6">
        Thank you for shopping with Universal Trend
      </p>
      <Link to="/" className="underline">
        Continue Shopping
      </Link>
    </section>
  );
};

export default OrderSuccess;
