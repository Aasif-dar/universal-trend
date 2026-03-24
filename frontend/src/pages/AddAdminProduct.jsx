import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import adminCategories from "../data/adminCategories";
import { toast } from "react-toastify";

const AdminAddProduct = () => {
  const { user } = useAuth();

  const [isPopular, setIsPopular] = useState(false);
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
    });
    setType("");
    setCategory("");
    setImages([]);
    setIsPopular(false);

    // reset file input
    document.getElementById("imageInput").value = "";
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!type || !category || images.length === 0) {
      toast.error("All fields including images are required");
      return;
    }

    setLoading(true);

    const data = new FormData();

    data.append("name", form.name);
    data.append("price", form.price);
    data.append("description", form.description);
    data.append("type", type);
    data.append("category", category);
    data.append("isPopular", isPopular);

    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/products",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: data,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to add product");
        setLoading(false);
        return;
      }

      toast.success("Product added successfully");

      resetForm();
    } catch (error) {
      console.log(error)
      toast.error("Server error");
    }

    setLoading(false);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-6 border rounded-lg">

        <h1 className="text-2xl font-semibold mb-6">
          Add Product
        </h1>

        <form onSubmit={submit} className="space-y-4">

          {/* TYPE */}
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

          {/* CATEGORY */}
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

          {/* NAME */}
          <input
            placeholder="Product Name"
            className="border w-full px-3 py-2"
            required
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* PRICE */}
          <input
            type="number"
            placeholder="Price"
            className="border w-full px-3 py-2"
            required
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            className="border w-full px-3 py-2"
            rows="3"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* MULTIPLE IMAGE INPUT */}
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            multiple
            required
            onChange={(e) => setImages(e.target.files)}
          />

          {/* POPULAR */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPopular}
              onChange={(e) => setIsPopular(e.target.checked)}
            />
            Mark as Popular Product
          </label>

          {/* BUTTON */}
          <button
            disabled={loading || !type || !category || images.length === 0}
            className={`w-full py-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white"
            }`}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>

        </form>

      </div>
    </section>
  );
};

export default AdminAddProduct;