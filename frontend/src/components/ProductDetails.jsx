import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../Context/CartContext";

import menProducts from "../data/MensProduct";
import womenProducts from "../data/WomensProducts";
import fragranceProducts from "../data/FragrenceProducts";

const sizes = ["S", "M", "L", "XL", "XXL"];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(null);

  const allProducts = [
    ...menProducts,
    ...womenProducts,
    ...fragranceProducts,
  ];

  const product = allProducts.find(
    (item) => String(item.id) === id
  );

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="mb-4">Product not found</p>
        <button
          onClick={() => navigate(-1)}
          className="border px-4 py-2"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize && product.category !== "Perfumes") {
      alert("Please select a size");
      return;
    }

   addToCart({
    ...product,
    size: selectedSize || "Standard",
  });
};

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <p className="text-sm text-gray-500 mb-6">
          Home / {product.category}
        </p>

        {/* Main */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Image */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[420px] object-cover"
            />
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-semibold mb-4">
              {product.name}
            </h1>

            <p className="text-xl font-bold mb-6">
              ₹{product.price}
            </p>

            {/* Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              This premium {product.name.toLowerCase()} is crafted with
              high-quality materials to ensure comfort, durability,
              and timeless style. Designed exclusively for Universal Trend.
            </p>

            {/* Size Selector */}
            {product.category !== "Perfumes" && (
              <div className="mb-8">
                <h4 className="text-sm font-medium mb-3">
                  Select Size
                </h4>

                <div className="flex gap-3 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-10 border text-sm font-medium transition
                        ${
                          selectedSize === size
                            ? "bg-black text-white"
                            : "bg-white hover:bg-black hover:text-white"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={() => navigate(-1)}
              className="block mt-4 text-sm text-gray-600 underline"
            >
              ← Back to products
            </button>
          </div>

        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold mb-8">
            Customer Reviews
          </h2>

          <div className="space-y-6">

            {/* Review */}
            <div className="bg-white border p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500">★★★★★</span>
                <span className="text-sm text-gray-500">
                  (5.0)
                </span>
              </div>
              <p className="text-sm text-gray-700">
                Excellent quality! Fits perfectly and looks premium.
                Will definitely buy again.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                — Verified Buyer
              </p>
            </div>

            <div className="bg-white border p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500">★★★★☆</span>
                <span className="text-sm text-gray-500">
                  (4.0)
                </span>
              </div>
              <p className="text-sm text-gray-700">
                Nice product, good fabric. Delivery was quick.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                — Verified Buyer
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductDetails;
