import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";
import SortBar from "../components/SortBar";
import MobileFilterDrawer from "../components/MobileFilterDrawer";
import Footer from "../components/Footer";
import adminCategories from "../data/adminCategories";
import { useSearchParams } from "react-router-dom";

const sortProducts = (products, sort) => {
  if (sort === "priceLowHigh")
    return [...products].sort((a, b) => a.price - b.price);
  if (sort === "priceHighLow")
    return [...products].sort((a, b) => b.price - a.price);
  if (sort === "nameAZ")
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  return products;
};

const Men = () => {
  const categories = adminCategories.men;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState(
    urlCategory || "All"
  );

  useEffect(() => {
    if (urlCategory) setActiveCategory(urlCategory);
  }, [urlCategory]);

  // 🔹 FETCH FROM BACKEND
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:5000/api/products?type=men"
        );
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔹 FILTER
  const filtered = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  // 🔹 SORT
  const sortedProducts = useMemo(
    () => sortProducts(filtered, sort),
    [filtered, sort]
  );

  return (
    <div>
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* HEADER */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Home / <span className="text-black">Men</span>
            </p>
            <h1 className="text-3xl font-semibold">Men</h1>
          </div>

          {/* MOBILE TOP BAR */}
          <div className="flex justify-between items-center md:hidden mb-6">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="border px-4 py-2 text-sm"
            >
              Filter: {activeCategory} ({sortedProducts.length})
            </button>

            <SortBar
              count={sortedProducts.length}
              sortValue={sort}
              onSortChange={setSort}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* DESKTOP SIDEBAR */}
            <div className="hidden md:block sticky top-24 self-start">
              <CategorySidebar
                categories={categories}
                active={activeCategory}
                onChange={(cat) => {
                  setActiveCategory(cat);
                  setSort("default");
                }}
              />
            </div>

            {/* PRODUCTS */}
            <div className="md:col-span-3">

              {/* DESKTOP SORT */}
              <div className="hidden md:block mb-4">
                <SortBar
                  count={sortedProducts.length}
                  sortValue={sort}
                  onSortChange={setSort}
                />
              </div>

              {/* STATES */}
              {loading ? (
                <div className="text-center py-20 text-gray-500">
                  Loading products...
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  No products found.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MOBILE FILTER DRAWER */}
          <MobileFilterDrawer
            open={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
            categories={categories}
            active={activeCategory}
            onChange={(cat) => {
              setActiveCategory(cat);
              setSort("default");
              setMobileFilterOpen(false);
            }}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Men;
