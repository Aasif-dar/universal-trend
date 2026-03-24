import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="group bg-white border rounded-lg overflow-hidden hover:shadow-md transition">

        <div className="h-64 bg-gray-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x400?text=No+Image";
            }}
          />
        </div>

        <div className="p-4">
          <h3 className="text-sm text-gray-700 mb-1">
            {product.name}
          </h3>
          <p className="font-semibold text-black">
            ₹{product.price}
          </p>
        </div>

      </div>
    </Link>
  );
};

export default ProductCard;
