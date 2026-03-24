import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

const AdminProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/admin/products", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    await fetch(`http://localhost:5000/api/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    setProducts((prev) => prev.filter((product) => product._id !== id));
  };

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        <h1 className="text-2xl md:text-3xl font-semibold mb-8">
          Admin – Products
        </h1>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto bg-white border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Popular</th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">₹{product.price}</td>
                  <td className="p-3">
                    {product.isPopular ? "Yes" : "No"}
                  </td>

                  <td className="p-3">
                    <img
                      src={product.images[0]  }
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden space-y-4">

          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-lg border shadow-sm"
            >

              <div className="flex gap-4">

                <img
                  src={product.images[0]}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1">

                  <h2 className="font-semibold text-lg">
                    {product.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {product.category}
                  </p>

                  <p className="text-sm mt-1">
                    Price: <span className="font-medium">₹{product.price}</span>
                  </p>

                  <p className="text-sm">
                    Popular:{" "}
                    <span className="font-medium">
                      {product.isPopular ? "Yes" : "No"}
                    </span>
                  </p>

                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="mt-2 text-red-500 text-sm"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default AdminProducts;