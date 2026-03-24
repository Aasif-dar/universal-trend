import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../Context/CartContext";
import { toast } from "sonner";

const sizes = ["S", "M", "L", "XL", "XXL"];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        if (!res.ok) throw new Error("Not found");

        const data = await res.json();
        setProduct(data);

        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0]);
        }

      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading product...
      </div>
    );
  }

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
    if (!selectedSize && product.type !== "fragrances") {
      toast.warning("Please select a size first ⚠️");
      return;
    }

    addToCart({
      ...product,
      size: selectedSize || "Standard",
      quantity: 1
    });

    toast.success("Added to cart 🛒");
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <p className="text-sm text-gray-500 mb-6">
          Home / {product.type}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* IMAGE GALLERY */}

          <div className="flex gap-4">

            {/* Thumbnails */}

            <div className="flex flex-col gap-3">

              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="thumb"
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 object-cover border cursor-pointer
                  ${mainImage === img ? "border-black" : "border-gray-300"}`}
                />
              ))}

            </div>

            {/* Main Image */}

            <div className="bg-white border rounded-lg overflow-hidden">
              <img
                src={mainImage}
                alt={product.name}
                className="w-[420px] h-[420px] object-cover"
              />
            </div>

          </div>

          {/* PRODUCT INFO */}

          <div>

            <h1 className="text-3xl font-semibold mb-4">
              {product.name}
            </h1>

            <p className="text-xl font-bold mb-6">
              ₹{product.price}
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* SIZE SELECTOR */}

            {product.type !== "fragrances" && (
              <div className="mb-8">

                <h4 className="text-sm font-medium mb-3">
                  Select Size
                </h4>

                <div className="flex gap-3 flex-wrap">

                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-10 border text-sm font-medium
                      ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "hover:bg-black hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}

                </div>

              </div>
            )}

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

        {/* REVIEWS */}

        <div className="mt-20">

          <h2 className="text-2xl font-semibold mb-8">
            Customer Reviews
          </h2>

          <div className="bg-white border p-6 rounded-lg">
            <span className="text-yellow-500">★★★★★</span>

            <p className="text-sm text-gray-700 mt-2">
              Excellent quality and premium feel.
            </p>

            <p className="text-xs text-gray-400 mt-1">
              — Verified Buyer
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ProductDetails;