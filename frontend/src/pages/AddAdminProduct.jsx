import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import adminCategories from "../data/adminCategories";

const AdminAddProduct = () => {
  const { user } = useAuth();

  const [isPopular, setIsPopular] = useState(false);
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    if (!type || !category || !image) {
      alert("All fields including image are required");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("description", form.description);
    data.append("type", type);
    data.append("category", category);
    data.append("isPopular", isPopular);
    data.append("image", image);

    await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: data,
    });

    alert("Product added successfully");
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-6 border rounded-lg">
        <h1 className="text-2xl font-semibold mb-6">Add Product</h1>

        <form onSubmit={submit} className="space-y-4">

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setCategory("");
            }}
            className="border w-full px-3 py-2"
            required
          >
            <option value="">Select Product Type</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="fragrances">Fragrances</option>
          </select>

          {type && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border w-full px-3 py-2"
              required
            >
              <option value="">Select Category</option>
              {adminCategories[type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}

          <input
            placeholder="Product Name"
            className="border w-full px-3 py-2"
            required
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Price"
            className="border w-full px-3 py-2"
            required
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            className="border w-full px-3 py-2"
            rows="3"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* IMAGE INPUT (REQUIRED) */}
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImage(e.target.files[0])}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPopular}
              onChange={(e) => setIsPopular(e.target.checked)}
            />
            Mark as Popular Product
          </label>

          <button className="w-full bg-black text-white py-2">
            Add Product
          </button>

        </form>
      </div>
    </section>
  );
};

export default AdminAddProduct;
